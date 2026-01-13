import re
from pathlib import Path
from typing import Dict, List, Set

from util import ROOT, cyan, green

COMMON_TYPES_PATH = ROOT / "src" / "types" / "common.ts"
STYLE_CSS_PATH = ROOT / "style.css"
TRANSFORM_VFX_PATH = ROOT / "src" / "components" / "ui" / "transformVfx.ts"

# matches a type declaration like type SizeToken = ...
TYPE_DECLARATION_REGEX = r"^\s*(?:export\s+)?type\s+(\w+)\s*=\s*([^;]+);"


# returns map of type unions, e.g. `{'ContentType': '"error" | "info" | "static" | "success" | "warning"'}`
def load_type_aliases(text: str) -> Dict[str, List[str]]:
    aliases = {}
    pattern = re.compile(TYPE_DECLARATION_REGEX, re.MULTILINE)
    for match in pattern.finditer(text):
        name, expr = match.group(1), match.group(2).strip()
        if not expr.startswith("{"):
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
        elif re.fullmatch(r"\d+", type_element):
            values.append(type_element)
        else:
            alias_type = aliases[type_element]
            values += get_union_type_suffixes_dfs(alias_type, aliases, stack)

    stack.remove(type_expression)
    return values


# returns map of the VFX type, e.g. `{'align': '"center" | "end" | "start"', ... }`
def load_vfx_type(text: str) -> Dict[str, str]:
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
    transformer_rules = load_transformation_classnames()

    for prop, type_expression in props.items():
        rules = transformer_rules[prop]

        class_suffixes = get_union_type_suffixes_dfs(type_expression, aliases, set())
        prefixes = rules["prefixes"]
        literals = rules["literals"]

        assert prefixes or literals, f"Missing class rules for {prop}"

        if prefixes:
            assert class_suffixes
            for prefix in prefixes:
                for value in class_suffixes:
                    expected.add(f"{prefix}{value}")
        if literals:
            assert not class_suffixes
            expected.update(literals)

    return expected


# matches any camelCase key
VFX_KEY_REGEX = r"^\s{2}([a-zA-Z]+)\s*:"
# matches any aui classname
AUI_CLASSNAME_REGEX = r"aui-[a-z-]+-?"


# returns map of VFX keys to class names, e.g. `{'pos': {'prefixes': {'aui-pos-'}, 'literals': set()}, ... }`
def load_transformation_classnames() -> Dict[str, Dict[str, Set[str]]]:
    text = TRANSFORM_VFX_PATH.read_text(encoding="utf-8")
    classnames = {}
    current_key = None
    in_transformers = False

    for line in text.splitlines():
        if not in_transformers:
            if "const transformers" in line:
                in_transformers = True
            continue

        if line.strip().startswith("};"):
            break

        key_match = re.match(VFX_KEY_REGEX, line)
        if key_match:
            current_key = key_match.group(1)
            classnames.setdefault(current_key, {"prefixes": set(), "literals": set()})

        tokens = re.findall(AUI_CLASSNAME_REGEX, line)
        if tokens:
            assert current_key
            for token in tokens:
                if token.endswith("-"):
                    classnames[current_key]["prefixes"].add(token)
                else:
                    classnames[current_key]["literals"].add(token)

    return classnames


def verify_css_classes() -> None:
    types_text = COMMON_TYPES_PATH.read_text(encoding="utf-8")
    aliases = load_type_aliases(types_text)
    props = load_vfx_type(types_text)
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
