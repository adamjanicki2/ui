import shutil

CYAN = "\033[36m"
GREEN = "\033[32m"
RESET = "\033[0m"

build_dir = "./build"

print(f"{CYAN}Cleaning build files...{RESET}")

try:
    shutil.rmtree(build_dir)
    print(f"{GREEN}Deleted all build artifacts!{RESET}")
except Exception as e:
    print(f"{CYAN}Nothing to clean!{RESET}")
