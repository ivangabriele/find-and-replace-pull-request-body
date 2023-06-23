import core from '@actions/core'
import github from '@actions/github'

export async function run() {
  try {
    const githubToken = core.getInput('githubToken', { required: true })
    const prNumber = core.getInput('prNumber')
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

    if (!context.payload.pull_request && !prNumber) {
      throw new Error(
        // must provide one
      //   "You can't use `body` input while setting `find` and `replace` ones.\n" +
      //     'Please check your setup: https://github.com/ivangabriele/find-and-replace-pull-request-body#usage',
      )
    }

    if (context.payload.pull_request && prNumber) {
      throw new Error(
        // only one
      //   "You can't use `body` input while setting `find` and `replace` ones.\n" +
      //     'Please check your setup: https://github.com/ivangabriele/find-and-replace-pull-request-body#usage',
      )
    }

    let pullRequestNumber;
    let pullRequestBody;

    if (context.payload.pull_request) {
      pullRequestNumber = context.payload.pull_request.number
      pullRequestBody = context.payload.pull_request.body
    } else {
      const {data: pullRequest} = await octokit.rest.pulls.get({
        ...context.repo,
        pull_number: parseInt(prNumber, 10),
      })

      pullRequestNumber = pullRequest.number
      pullRequestBody = pullRequest.body
    }

    if (!body.length && !pullRequestBody) {
      throw new Error(
        'Pull request body is empty. There is nothing to `find` and `replace`.\n' +
          'Please check your setup: https://github.com/ivangabriele/find-and-replace-pull-request-body#usage',
      )
    }

    if (body.length) {
      await octokit.rest.pulls.update({
        ...context.repo,
        pull_number: pullRequestNumber,
        body,
      })
    } else if (isHtmlCommentTag) {
      const findRegexp = new RegExp(`\<\!\-\- ${find} \-\-\>.*\<\!\-\- ${find} \-\-\>`, 's')
      const replacement = body.length ? body : `<!-- ${find} -->\n${replace}\n<!-- ${find} -->`
      const nextPullRequestBody = pullRequestBody.replace(findRegexp, replacement)

      await octokit.rest.pulls.update({
        ...context.repo,
        pull_number: pullRequestNumber,
        body: nextPullRequestBody,
      })
    } else {
      const nextPullRequestBody = pullRequestBody.replace(find, replace)

      await octokit.rest.pulls.update({
        ...context.repo,
        pull_number: pullRequestNumber,
        body: nextPullRequestBody,
      })
    }
  } catch (e) {
    core.setFailed(e.message)
  }
}

run()
