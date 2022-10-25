# Create Release With Tag
Action for create release with tag

## Usage
```
- uses: badico-cloud-hub/create-release-with-tag@v1
  with:
    # Commit hash for release in repository
    # is required
    sha: ''
    
    # Tag name for release
    # is required
    tag: ''

    # Tag name for append in commit
    # is optional
    append_tag: ''

    # Token with credentials for repository
    # is required
    gh-token: ''


```