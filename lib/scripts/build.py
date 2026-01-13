import subprocess
from pathlib import Path
from typing import Iterable, List

from clean import clean, remove_build_dir
from css import verify_css_classes
from util import BUILD_DIR, ROOT, cyan, green


def run(cmd: str) -> None:
    result = subprocess.run(cmd.split(), cwd=str(ROOT))
    if result.returncode != 0:
        raise SystemExit(result.returncode)


def get_total_size(paths: Iterable[Path]) -> int:
    return sum(p.stat().st_size for p in paths if p.is_file())


def format_bytes(byte_size: int) -> str:
    value = float(byte_size)
    for unit in ["B", "KB", "MB"]:
        if value < 1024:
            return f"{value:.2f} {unit}"
        value /= 1024
    return f"{byte_size} B"


def get_saved_percent(before: int, after: int) -> float:
    return ((before - after) / before) * 100.0


def remove_empty_files() -> None:
    removed = []
    for path in BUILD_DIR.rglob("*"):
        if path.is_file():
            name = path.name
            content = path.read_text(encoding="utf-8").strip()
            if not content:
                path.unlink()
                removed.append(name)

    if removed:
        print(f"Removed empty files:")
        print(f"{', '.join(removed)}")


def main() -> None:
    # clean up mess
    clean()

    cyan("\nCompiling TypeScript...")
    run("npx tsc")
    green("TypeScript compiled!\n")

    cyan("Converting scss...")
    run("npx sass --no-source-map --style=compressed src/style.scss style.css")
    green("scss converted!\n")

    cyan("Validating emitted CSS classes...")
    verify_css_classes()
    green("CSS classes verified!\n")

    cyan("Minifying JavaScript...")

    files_before = list(BUILD_DIR.rglob("*"))
    size_before = get_total_size(files_before)

    run(
        "npx esbuild build/**/*.js --minify --format=esm --tree-shaking=true --target=es2018 --outdir=build --allow-overwrite --log-level=silent"
    )
    remove_empty_files()

    files_after = list(BUILD_DIR.rglob("*"))

    size_after = get_total_size(files_after)
    percent = get_saved_percent(size_before, size_after)

    run("rsync -a --remove-source-files build/ ./")
    remove_build_dir()

    green("Build complete!\n")
    print(f"Pre-minified size: {format_bytes(size_before)}")
    print(f"Post-minified size: {format_bytes(size_after)}")
    print(f"Saved: {format_bytes(size_before - size_after)} ({percent:.2f}%)")


if __name__ == "__main__":
    main()
