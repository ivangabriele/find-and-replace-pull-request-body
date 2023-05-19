import core from '@actions/core'
import github from '@actions/github'
import { jest } from '@jest/globals'

import { run } from './index.js'

const INPUTS = {}

function cleanMultilineText(text) {
  return text
    .split('\n')
    .map(line => line.replace(/^\s+/g, ''))
    .join('\n')
    .trim()
}

const octokitMock = {
  rest: {
    pulls: {
      update: jest.fn(),
    },
  },
}

describe('utils', () => {
  beforeAll(() => {
    jest.spyOn(core, 'getInput').mockImplementation(name => {
      return INPUTS[name]
    })

    jest.spyOn(github, 'getOctokit').mockImplementation(() => octokitMock)
  })

  it('should replace the HTML Comment Tag', async () => {
    const pullRequestBody = cleanMultilineText(`
      ## Related Pull Requests & Issues

      None

      ## Preview URL

      <!-- AUTOFILLED_PREVIEW_URL -->
      _Waiting for deployment..._
      <!-- AUTOFILLED_PREVIEW_URL -->
    `)
    Object.defineProperty(github, 'context', {
      value: {
        payload: {
          pull_request: {
            body: pullRequestBody,
            number: 1,
          },
        },
      },
    })

    INPUTS.body = ''
    INPUTS.find = 'AUTOFILLED_PREVIEW_URL'
    INPUTS.githubToken = 'FAKE_GITHUB_TOKEN'
    INPUTS.isHtmlCommentTag = 'true'
    INPUTS.replace = 'https://example.org'

    run()

    const expectedNextPullRequestBody = cleanMultilineText(`
      ## Related Pull Requests & Issues

      None

      ## Preview URL

      <!-- AUTOFILLED_PREVIEW_URL -->
      https://example.org
      <!-- AUTOFILLED_PREVIEW_URL -->
    `)

    expect(octokitMock.rest.pulls.update).toHaveBeenCalledWith({
      body: expectedNextPullRequestBody,
      pull_number: 1,
    })
  })
})
