import core from '@actions/core'
import github from '@actions/github'
import { jest } from '@jest/globals'

import { run } from './index.js'

const CONTEXT = {
  payload: {
    pull_request: {
      body: undefined,
      number: 0,
    },
  },
}
const INPUTS = {}

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

    jest.spyOn(github, 'context').mockImplementation(() => CONTEXT)
    jest.spyOn(github, 'getOctokit').mockImplementation(() => octokitMock)
  })

  it('should replace the HTML Comment Tag', async () => {
    CONTEXT.payload.pull_request.body = `
## Related Pull Requests & Issues

None

## Preview URL

<!-- AUTOFILLED_PREVIEW_URL -->
_Waiting for deployment..._
<!-- AUTOFILLED_PREVIEW_URL -->
    `.trim()

    INPUTS.body = ''
    INPUTS.find = 'AUTOFILLED_PREVIEW_URL'
    INPUTS.githubToken = 'FAKE_GITHUB_TOKEN'
    INPUTS.isHtmlCommentTag = 'true'
    INPUTS.replace = 'https://example.org'

    run()

    expect(octokitMock.rest.pulls.update).toHaveBeenCalled()
  })
})
