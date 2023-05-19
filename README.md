# find-and-replace-pull-request-body

> This action replaces the workflow related action Pull Request body.

---

- [Usage](#usage)
  - [Replacing the entire PR body (continuous)](#replacing-the-entire-pr-body-continuous)
  - [Replacing a specific part of the PR body using a string (one time)](#replacing-a-specific-part-of-the-pr-body-using-a-string-one-time)
  - [Replacing a specific part of the PR body using an HTML Comment Tag (continuous)](#replacing-a-specific-part-of-the-pr-body-using-an-html-comment-tag-continuous)

---

## Usage

### Replacing the entire PR body (continuous)

```yml
      - name: Replace Pull Request Body
        uses: ivangabriele/find-and-replace-pull-request-body@v1.1.5
        with:
          githubToken: ${{ secrets.GITHUB_TOKEN }}
          body: |
            # A New PR Body Title

            With a new body description.
```

### Replacing a specific part of the PR body using a string (one time)

Let's say you have a PR body like this:

```md
# Preview URL

_Waiting for deployment..._
```

```yml
      - name: Replace Pull Request Body
        uses: ivangabriele/find-and-replace-pull-request-body@v1.1.5
        with:
          githubToken: ${{ secrets.GITHUB_TOKEN }}
          find: '_Waiting for deployment..._'
          replace: 'https://example.com/my-preview'
```

will replace the `find` string with the `replace` string and update the PR body to become:

```md
# Preview URL

https://example.com/my-preview
```

### Replacing a specific part of the PR body using an HTML Comment Tag (continuous)

Let's say you have a PR body like this:

```md
# Preview URL

<!-- AUTOFILLED_PREVIEW_URL -->
_Waiting for deployment..._
<!-- AUTOFILLED_PREVIEW_URL -->
```

```yml
      - name: Replace Pull Request Body
        uses: ivangabriele/find-and-replace-pull-request-body@v1.1.5
        with:
          githubToken: ${{ secrets.GITHUB_TOKEN }}
          find: 'AUTOFILLED_PREVIEW_URL'
          isHtmlCommentTag: true
          replace: 'https://example.com/my-preview'
```

will replace what's between the `find` HTML Comment Tags with the `replace` string and update the PR body to become:

```md
# Preview URL

<!-- AUTOFILLED_PREVIEW_URL -->
https://example.com/my-preview
<!-- AUTOFILLED_PREVIEW_URL -->
```
