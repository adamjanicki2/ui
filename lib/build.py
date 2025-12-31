import subprocess
from clean import cyan, green, clean, ROOT, BUILD_DIR


def run(cmd):
    result = subprocess.run(cmd.split(), cwd=str(ROOT), stdout=subprocess.PIPE)
    if result.returncode != 0:
        raise SystemExit(result.returncode)


def get_total_size(paths):
    total = 0
    for path in paths:
        if path.is_file():
            total += path.stat().st_size
    return total


units = ["B", "KB", "MB", "GB", "TB"]


def format_bytes(byte_size):
    value = float(byte_size)
    for unit in units:
        if value < 1024 or unit == units[-1]:
            if unit == "B":
                return f"{int(value)} {unit}"
            return f"{value:.2f} {unit}"
        value /= 1024
    return f"{byte_size} B"


def get_saved_percent(before, after):
    saved = before - after
    return (saved / before) * 100.0


def main():
    clean()
    cyan("\nCompiling TypeScript...")
    run("npx tsc")
    green("TypeScript compiled!\n")

    cyan("Converting scss...")
    run("npx sass --no-source-map --style=compressed src/style.scss build/style.css")
    green("scss converted!\n")

    cyan("Minifying JavaScript...")

    files_before = list(BUILD_DIR.rglob("*.js"))
    size_before = get_total_size(files_before)

    run(
        "npx esbuild build/**/*.js --minify --format=esm --tree-shaking=true --target=es2018 --outdir=build --allow-overwrite --log-level=silent"
    )

    files_after = list(BUILD_DIR.rglob("*.js"))
    size_after = get_total_size(files_after)

    percent = get_saved_percent(size_before, size_after)

    assert files_after == files_before

    green("Build complete!\n")
    print(f"Emitted files: {len(files_after)}")
    print(f"Pre-minified size: {format_bytes(size_before)}")
    print(f"Post-minified size: {format_bytes(size_after)}")
    print(f"Saved: {format_bytes(size_before - size_after)} ({percent:.2f}%)")


if __name__ == "__main__":
    main()
