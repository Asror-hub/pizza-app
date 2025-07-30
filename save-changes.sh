#!/bin/bash

# Script to easily save changes to GitHub
echo "🔄 Checking for changes..."

# Check if there are any changes to commit
if git diff-index --quiet HEAD --; then
    echo "✅ No changes to commit"
else
    echo "📝 Changes detected! Committing and pushing..."
    
    # Add all changes
    git add .
    
    # Get commit message from user or use default
    if [ -z "$1" ]; then
        commit_message="Update: $(date '+%Y-%m-%d %H:%M:%S')"
    else
        commit_message="$1"
    fi
    
    # Commit changes
    git commit -m "$commit_message"
    
    # Push to GitHub
    git push origin main
    
    echo "✅ Changes successfully saved to GitHub!"
    echo "📋 Commit message: $commit_message"
fi 