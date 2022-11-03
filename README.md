# Create Release With Tag
Action for create release with tag
Add to GITHUB_TOKEN with workflow credentials.
Add the checkout action first. Ex:
```
- name: Checkout
  uses: actions/checkout@v3
  with:
    fetch-depth: 0
    token: ${{ secrets.GITHUB_TOKEN }}
```
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

    # Just set tag
    # is optional
    # Default is false
    just-tag: ''

    # Tag name for append in commit
    # is optional
    append-tag: ''

    # Set append-tag name to uppercase
    # is optional
    upper: ''

```