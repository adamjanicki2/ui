import os

CYAN = "\033[36m"
GREEN = "\033[32m"
RESET = "\033[0m"

print(f"{CYAN}Finding build files to clean...{RESET}")

src_dir = "src"
entries = [entry for entry in os.listdir(src_dir) if entry != "src"]

for entry in entries:
    print(entry)

print(f"{CYAN}Cleaning build files...{RESET}")

# Delete corresponding entries in the root directory
for entry in entries:
    target = entry
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
additional_files = ["index.js", "index.d.ts", "style.css"]
for file_name in additional_files:
    if os.path.isfile(file_name):
        print(f"Deleting file: {file_name}")
        os.remove(file_name)

print(f"{GREEN}Deleted all build artifacts!{RESET}")
