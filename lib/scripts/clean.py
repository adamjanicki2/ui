import shutil
from pathlib import Path
from util import BUILD_DIR, ROOT, SRC_DIR, cyan, green


def remove_build_dir() -> None:
    shutil.rmtree(BUILD_DIR, ignore_errors=True)


def remove_path(path: Path) -> None:
    if path.is_dir():
        shutil.rmtree(path, ignore_errors=True)
    elif path.is_file():
        try:
            path.unlink()
        except:
            pass


def clean() -> None:
    cyan("Cleaning build files...")
    remove_build_dir()

    for entry in SRC_DIR.iterdir():
        path = ROOT / entry.name
        if path.exists():
            print(f"Deleting {path.relative_to(ROOT)}")
            remove_path(path)

    for filename in ["index.js", "index.d.ts", "style.css", "__pycache__/"]:
        path = ROOT / filename
        if path.exists():
            print(f"Deleting {path.relative_to(ROOT)}")
            remove_path(path)

    green("Deleted all build artifacts!")


if __name__ == "__main__":
    clean()
