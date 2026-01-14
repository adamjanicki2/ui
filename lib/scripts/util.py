from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BUILD_DIR = ROOT / "build"
SRC_DIR = ROOT / "src"

CYAN = "\033[36m"
GREEN = "\033[32m"
RESET = "\033[0m"


def cyan(msg: str) -> None:
    print(f"{CYAN}{msg}{RESET}")


def green(msg: str) -> None:
    print(f"{GREEN}{msg}{RESET}")
