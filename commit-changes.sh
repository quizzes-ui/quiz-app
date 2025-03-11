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

# Proceed with git commands
git add .
git commit -m "$commit_message"
git push
