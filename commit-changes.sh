#!/bin/bash

# Initialize commit message from argument if provided
commit_message="$1"

# If no commit message was provided as an argument, prompt for one
if [ -z "$commit_message" ]; then
  echo "No commit message provided as an argument."
  echo -n "Please enter a commit message: "
  read commit_message
  
  # Check if the user entered a message after being prompted
  if [ -z "$commit_message" ]; then
    echo "Error: No commit message provided. Aborting."
    exit 1
  fi
fi

# Extract the current version number from index.js
current_version=$(grep -o 'Version [0-9]\+\.[0-9]\+' pages/index.js | grep -o '[0-9]\+\.[0-9]\+')
if [ -z "$current_version" ]; then
  echo "Could not find current version in pages/index.js"
  exit 1
fi

# Increment the version number
major=$(echo $current_version | cut -d. -f1)
minor=$(echo $current_version | cut -d. -f2)
new_minor=$((minor + 1))
new_version="$major.$new_minor"

# Update the version in index.js
node update-version.js "$new_version"

# Proceed with git commands
git add .
git commit -m "$commit_message (v$new_version)"
git push

echo "Committed and pushed with version $new_version"
