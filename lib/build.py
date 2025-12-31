import subprocess
from pathlib import Path

from clean import cyan, green, clean, ROOT, BUILD_DIR, remove_build_dir


def run(cmd):
    result = subprocess.run(cmd.split(), cwd=str(ROOT))
    if result.returncode != 0:
        raise SystemExit(result.returncode)


def get_total_size(paths):
    return sum(p.stat().st_size for p in paths if p.is_file())


def format_bytes(byte_size):
    value = float(byte_size)
    for unit in ["B", "KB", "MB"]:
        if value < 1024:
            return f"{value:.2f} {unit}"
        value /= 1024
    return f"{byte_size} B"


def get_saved_percent(before, after):
    return ((before - after) / before) * 100.0


def main():
    # clean up mess
    clean()

    cyan("Compiling TypeScript...")
    run("npx tsc")
    green("TypeScript compiled!\n")

    cyan("Converting scss...")
    run("npx sass --no-source-map --style=compressed src/style.scss style.css")
    green("scss converted!\n")

    cyan("Minifying JavaScript...")

    files_before = list(BUILD_DIR.rglob("*"))
    size_before = get_total_size(files_before)

    run(
        "npx esbuild build/**/*.js --minify --format=esm --tree-shaking=true --target=es2018 --outdir=build --allow-overwrite --log-level=silent"
    )

    files_after = list(BUILD_DIR.rglob("*"))
    assert files_after == files_before

    size_after = get_total_size(files_after)
    percent = get_saved_percent(size_before, size_after)

    run("rsync -a --remove-source-files build/ ./")
    remove_build_dir()

    green("Build complete!\n")
    print(f"Emitted files: {len(files_after)}")
    print(f"Pre-minified size: {format_bytes(size_before)}")
    print(f"Post-minified size: {format_bytes(size_after)}")
    print(f"Saved: {format_bytes(size_before - size_after)} ({percent:.2f}%)")


if __name__ == "__main__":
    main()
