import os
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BUILD_DIR = ROOT / "build"
SRC_DIR = ROOT / "src"

CYAN = "\033[36m"
GREEN = "\033[32m"
RESET = "\033[0m"


def cyan(msg):
    print(f"{CYAN}{msg}{RESET}")


def green(msg):
    print(f"{GREEN}{msg}{RESET}")


def remove_build_dir():
    shutil.rmtree(BUILD_DIR, ignore_errors=True)


def remove_path(path):
    if path.is_dir():
        shutil.rmtree(path, ignore_errors=True)
    elif path.is_file():
        try:
            path.unlink()
        except:
            pass


def clean():
    cyan("Cleaning build files...")
    remove_build_dir()

    for entry in SRC_DIR.iterdir():
        path = ROOT / entry.name
        if path.exists():
            print(f"Deleting {path.relative_to(ROOT)}")
            remove_path(path)

    for filename in [
        "index.js",
        "index.d.ts",
        "style.css",
    ]:
        path = ROOT / filename
        if path.exists():
            print(f"Deleting {path.relative_to(ROOT)}")
            remove_path(path)

    green("Deleted all build artifacts!")


if __name__ == "__main__":
    clean()
