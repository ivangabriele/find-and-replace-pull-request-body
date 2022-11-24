# replace-pull-request-body

> This action replaces workflow related action Pull Request body.

## Usage

### Replacing the entire PR body

```yml
      - name: Replace Pull Request Body
        uses: ivangabriele/replace-pull-request-body@v1
        with:
          githubToken: ${{ secrets.GITHUB_TOKEN }}
          body: |
            # A New PR Body Title

            With a new body description.
```

### Replacing a specific part of the PR body

Let's say you have a PR body like this:

```md
# Preview URL

_Waiting for deployment..._<!-- AUTOFILLED_PREVIEW_URL -->
```

```yml
      - name: Replace Pull Request Body
        uses: ivangabriele/replace-pull-request-body@v1
        with:
          githubToken: ${{ secrets.GITHUB_TOKEN }}
          find: '_Waiting for deployment..._<!-- AUTOFILLED_PREVIEW_URL -->'
          replace: 'https://example.com/my-preview'
```

will replace the `find` string with the `replace` string and update the PR body to become:

```md
# Preview URL

https://example.com/my-preview
```
