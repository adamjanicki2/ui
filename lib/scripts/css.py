import re
from pathlib import Path
from typing import Dict, List, Set

from clean import ROOT, cyan, green

COMMON_TYPES_PATH = ROOT / "src" / "types" / "common.ts"
STYLE_CSS_PATH = ROOT / "style.css"

VFX_CLASS_RULES = {
    "pos": "aui-pos-",
    "axis": "aui-flex-",
    "gap": "aui-gap-",
    "align": "aui-align-",
    "justify": "aui-justify-",
    "stretch": "aui-stretch-",
    "overflow": "aui-ov-",
    "overflowX": "aui-ov-x-",
    "overflowY": "aui-ov-y-",
    "z": "aui-z-",
    "padding": "aui-pa-",
    "paddingTop": "aui-pt-",
    "paddingBottom": "aui-pb-",
    "paddingLeft": "aui-pl-",
    "paddingRight": "aui-pr-",
    "margin": "aui-ma-",
    "marginTop": "aui-mt-",
    "marginBottom": "aui-mb-",
    "marginLeft": "aui-ml-",
    "marginRight": "aui-mr-",
    "width": "aui-w-",
    "minWidth": "aui-minw-",
    "maxWidth": "aui-maxw-",
    "height": "aui-h-",
    "minHeight": "aui-minh-",
    "maxHeight": "aui-maxh-",
    "radius": "aui-radius-",
    "borderWidth": "aui-bw-",
    "borderStyle": "aui-bs-",
    "borderColor": "aui-bc-",
    "shadow": "aui-shadow-",
    "opacity": "aui-op-",
    "hover": "aui-hov-",
    "fontSize": "aui-f-",
    "fontWeight": "aui-fw-",
    "textAlign": "aui-ta-",
    "lineHeight": "aui-lh-",
    "color": "aui-c-",
    "backgroundColor": "aui-bg-",
    "cursor": "aui-cursor-",
    "wrap": "aui-flex-wrap",
    "italics": "aui-it",
    "border": "aui-ba",
    "borderTop": "aui-bt",
    "borderBottom": "aui-bb",
    "borderLeft": "aui-bl",
    "borderRight": "aui-br",
}


def load_type_aliases(text: str) -> Dict[str, str]:
    aliases = {}
    pattern = re.compile(r"^\s*(?:export\s+)?type\s+(\w+)\s*=\s*([^;]+);", re.MULTILINE)
    for match in pattern.finditer(text):
        name, expr = match.group(1), match.group(2).strip()
        if expr.startswith("{"):
            continue
        aliases[name] = expr
    return aliases


def get_union_type_suffixes_dfs(
    type_expression: str, aliases: Dict[str, str], stack: Set[str]
) -> List[str]:
    assert type_expression not in stack, "Type is not a DAG"
    stack.add(type_expression)

    values = []
    types = [t.strip() for t in type_expression.split("|")]
    for type_element in types:
        if type_element == "boolean":
            return []
        if re.fullmatch(r'"[^"]+"', type_element):
            values.append(type_element[1:-1])
            continue
        if re.fullmatch(r"\d+", type_element):
            values.append(type_element)
            continue

        alias_type = aliases[type_element]
        values += get_union_type_suffixes_dfs(alias_type, aliases, stack)

    stack.remove(type_expression)
    return values


def load_vfx_props(text: str) -> Dict[str, str]:
    start = text.find("export type Vfx = {")
    end = text.find("};", start)
    assert start != -1 and end != -1, "Unable to find Vfx type definition."

    block = text[start:end]

    props = {}
    pattern = re.compile(r"^\s*([a-zA-Z0-9]+)\?:\s*([^;]+);")
    for line in block.splitlines():
        match = pattern.match(line)
        if match:
            props[match.group(1)] = match.group(2).strip()
    return props


def build_expected_classes(props: Dict[str, str], aliases: Dict[str, str]) -> Set[str]:
    expected = set()
    for prop, rule in VFX_CLASS_RULES.items():
        class_suffixes = get_union_type_suffixes_dfs(props[prop], aliases, set())
        if rule.endswith("-"):
            assert class_suffixes

            for value in class_suffixes:
                expected.add(f"{rule}{value}")

        else:
            assert not class_suffixes
            expected.add(rule)

    return expected


def verify_css_classes() -> None:
    types_text = COMMON_TYPES_PATH.read_text(encoding="utf-8")
    aliases = load_type_aliases(types_text)
    props = load_vfx_props(types_text)
    expected = build_expected_classes(props, aliases)

    emitted_css = Path(STYLE_CSS_PATH).read_text(encoding="utf-8")

    missing = []
    for class_name in sorted(expected):
        if not class_name in emitted_css:
            missing.append(class_name)

    assert missing == [], f"Unexpected missing classes: {missing}"


if __name__ == "__main__":
    cyan("Validating emitted CSS classes...")
    verify_css_classes()
    green("Validated all CSS classes!")
