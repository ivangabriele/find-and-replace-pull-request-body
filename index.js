import core from '@actions/core'
import github from '@actions/github'

try {
  const githubToken = core.getInput('githubToken', { required: true })
  const body = core.getInput('body')
  const find = core.getInput('find')
  const replace = core.getInput('replace')

  if (!githubToken.length) {
    throw new Error(
      'You forgot to set `githubToken` parameter.\n' +
        'Please check your setup: https://github.com/ivangabriele/replace-pull-request-body#usage.',
    )
  }

  if (!body.length || (!find.length && !replace.length)) {
    throw new Error(
      'You must either set `body` parameter or both `find` and `replace` parameters.\n' +
        'Please check your setup: https://github.com/ivangabriele/replace-pull-request-body#usage.',
    )
  }

  if (body.length && (find.length || replace.length)) {
    throw new Error(
      "You can't use `body` parameter while setting `find` and `replace` ones.\n" +
        'Please check your setup: https://github.com/ivangabriele/replace-pull-request-body#usage.',
    )
  }

  const { context } = github
  const octokit = github.getOctokit(githubToken)

  const pullRequestNumber = context.payload.pull_request.number
  const pullRequestBody = context.payload.pull_request.body

  if (!body.length && !pullRequestBody) {
    throw new Error(
      'Pull request body is empty. There is nothing to `find` and `replace`.\n' +
        'Please check your setup: https://github.com/ivangabriele/replace-pull-request-body#usage.',
    )
  }

  const nextPullRequestBody = body.length ? body : pullRequestBody.replace(find, replace)

  await octokit.rest.pulls.update({
    ...context.repo,
    pull_number: pullRequestNumber,
    body: nextPullRequestBody,
  })
} catch (e) {
  core.setFailed(e.message)
}
