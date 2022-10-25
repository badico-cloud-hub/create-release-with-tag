# Create Release With Tag
Action for create release with tag

## Usage
```
- uses: badico-cloud-hub/create-release-with-tag@v1
  with:
    # Branch for release in repository
    # Default is ${{github.event.repository.default_branch}}
    branch: ''
    
    # Tag name for release
    # is required
    tag: ''

    # Tag name for append in commit
    # is optional
    append-tag: ''

    # Token with credentials for repository
    # is required
    gh-token: ''


```