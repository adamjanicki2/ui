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
    try:
        shutil.rmtree(BUILD_DIR)
    except:
        pass


def clean():
    remove_build_dir()
    entries = [entry for entry in os.listdir(SRC_DIR) if entry != "src"]

    cyan("Cleaning build files...")

    # Delete corresponding entries in the root directory
    for target in entries:
        if os.path.isdir(target):
            print(f"Deleting directory: {target}")
            # Walk directory and remove all files/subdirectories
            for root, dirs, files in os.walk(target, topdown=False):
                for name in files:
                    os.remove(os.path.join(root, name))
                for name in dirs:
                    os.rmdir(os.path.join(root, name))
            os.rmdir(target)
        elif os.path.isfile(target):
            print(f"Deleting file: {target}")
            os.remove(target)

    # Additional files to delete
    additional_entries = ["index.js", "index.d.ts", "style.css"]
    for name in additional_entries:
        if os.path.isfile(name):
            print(f"Deleting file: {name}")
            os.remove(file_name)

    green("Deleted all build artifacts!")


if __name__ == "__main__":
    clean()
