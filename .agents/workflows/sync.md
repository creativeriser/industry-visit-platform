---
description: Automatically fetch and pull the latest changes from the GitHub repository to sync with teammates.
---

This workflow will safely stash any uncommitted work, pull the latest changes from your teammates on GitHub, and then pop your stash back.

1. Ensure we are on the main branch
```bash
// turbo
git checkout main
```

2. Stash any uncommitted local changes to avoid merge conflicts
```bash
// turbo
git stash
```

3. Fetch and pull the latest changes from GitHub
```bash
// turbo
git pull origin main --rebase
```

4. Restore any stashed local changes
```bash
// turbo
git stash pop || echo "No stashed changes to pop, or there was a conflict."
```

5. Install any new dependencies that might have been pulled
```bash
// turbo
npm install
```

✅ **Sync Complete!** Your local project is now up-to-date with your teammates.
