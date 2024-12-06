# go through every js file, even in subdirectories, and remove all comments

import os
import re

def remove_comments_from_js_files(directory):
    for root, _, files in os.walk(directory):  # Use os.walk to traverse directories
        for file in files:
            if file.endswith(".js"):
                with open(os.path.join(root, file), "r") as f:
                    content = f.read()
                    # remove all comments
                    content = re.sub(r"//.*", "", content)
                with open(os.path.join(root, file), "w") as f:
                    f.write(content)

remove_comments_from_js_files("src")  # Call the function with the "src" directory
