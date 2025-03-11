#!/bin/bash

# Check if a commit message was provided
if [ -z "$1" ]; then
  echo "Error: No commit message provided."
  echo "Usage: ./commit-changes.sh 'Your commit message here'"
  exit 1
fi

# Use the provided commit message
commit_message="$1"

git add .
git commit -m "$commit_message"
git push
