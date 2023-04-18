import core from '@actions/core'
import github from '@actions/github'

try {
  const githubToken = core.getInput('githubToken', { required: true })
  const body = core.getInput('body')
  const find = core.getInput('find')
  const isHtmlCommentTag = core.getInput('isHtmlCommentTag').toLowerCase() === 'true'
  const replace = core.getInput('replace')

  if (!githubToken.length) {
    throw new Error(
      'You forgot to set `githubToken` input.\n' +
        'Please check your setup: https://github.com/ivangabriele/find-and-replace-pull-request-body#usage',
    )
  }

  if (!body.length && (!find.length || !replace.length)) {
    throw new Error(
      'You must either set `body` input or both `find` and `replace` inputs.\n' +
        'Please check your setup: https://github.com/ivangabriele/find-and-replace-pull-request-body#usage',
    )
  }

  if (body.length && (find.length || replace.length)) {
    throw new Error(
      "You can't use `body` input while setting `find` and `replace` ones.\n" +
        'Please check your setup: https://github.com/ivangabriele/find-and-replace-pull-request-body#usage',
    )
  }

  if (isHtmlCommentTag && !find.length) {
    throw new Error(
      "You can't set set `isHtmlCommentTag` input to `true` without also setting `find` input.\n" +
        'Please check your setup: https://github.com/ivangabriele/find-and-replace-pull-request-body#usage',
    )
  }

  const { context } = github
  const octokit = github.getOctokit(githubToken)

  const pullRequestNumber = context.payload.pull_request.number
  const pullRequestBody = context.payload.pull_request.body

  if (!body.length && !pullRequestBody) {
    throw new Error(
      'Pull request body is empty. There is nothing to `find` and `replace`.\n' +
        'Please check your setup: https://github.com/ivangabriele/find-and-replace-pull-request-body#usage',
    )
  }

  if (isHtmlCommentTag === 'true') {
    const findRegexp = new RegExp(`\<\!\-\- ${find} \-\-\>.*\<\!\-\- ${find} \-\-\>`, 's')
    const replacement = body.length ? body : `<!-- ${find} -->\n${replace}\n<!-- ${find} -->`
    const nextPullRequestBody = body.length ? body : pullRequestBody.replace(findRegexp, replacement)

    await octokit.rest.pulls.update({
      ...context.repo,
      pull_number: pullRequestNumber,
      body: nextPullRequestBody,
    })
  } else {
    const nextPullRequestBody = body.length ? body : pullRequestBody.replace(find, replace)

    await octokit.rest.pulls.update({
      ...context.repo,
      pull_number: pullRequestNumber,
      body: nextPullRequestBody,
    })
  }
} catch (e) {
  core.setFailed(e.message)
}
