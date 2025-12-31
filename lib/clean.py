import shutil
from pathlib import Path


ROOT = Path(__file__).resolve().parent
BUILD_DIR = ROOT / "build"

CYAN = "\033[36m"
GREEN = "\033[32m"
RESET = "\033[0m"


def cyan(msg):
    print(f"{CYAN}{msg}{RESET}")


def green(msg):
    print(f"{GREEN}{msg}{RESET}")


def clean():
    cyan("Cleaning build files...")
    try:
        shutil.rmtree(BUILD_DIR)
        green("Deleted all build artifacts!")
    except:
        cyan("Nothing to clean!")


if __name__ == "__main__":
    clean()
