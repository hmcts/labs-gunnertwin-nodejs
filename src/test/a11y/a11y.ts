import { app } from '../../main/app';

import * as supertest from 'supertest';

const pa11y = require('pa11y');

const agent = supertest.agent(app);

class Pa11yResult {
  documentTitle: string;
  pageUrl: string;
  issues: PallyIssue[];
  constructor(documentTitle: string, pageUrl: string, issues: PallyIssue[]) {
    this.documentTitle = documentTitle;
    this.pageUrl = pageUrl;
    this.issues = issues;
  }
}

class PallyIssue {
  code: string;
  context: string;
  message: string;
  selector: string;
  type: string;
  typeCode: number;
  constructor(code: string, context: string, message: string, selector: string, type: string, typeCode: number) {
    this.code = code;
    this.context = context;
    this.message = message;
    this.selector = selector;
    this.type = type;
    this.typeCode = typeCode;
  }
}

function ensurePageCallWillSucceed(url: string): Promise<void> {
  return agent.get(url).then((res: supertest.Response) => {
    if (res.redirect) {
      throw new Error(`Call to ${url} resulted in a redirect to ${res.get('Location')}`);
    }
    if (res.serverError) {
      throw new Error(`Call to ${url} resulted in internal server error`);
    }
  });
}

function runPally(url: string): Promise<Pa11yResult> {
  const result = pa11y(url, {
    hideElements: '.govuk-footer__licence-logo, .govuk-header__logotype-crown',
    timeout: 120000, // 120s for Jenkins
    chromeLaunchConfig: { args: ['--no-sandbox', '--disable-setuid-sandbox'] },
  });
  return result;
}

function expectNoErrors(messages: PallyIssue[]): void {
  const errors = messages.filter(m => m.type === 'error');
  if (errors.length > 0) {
    const errorsAsJson = `${JSON.stringify(errors, null, 2)}`;
    throw new Error(`There are accessibility issues: \n${errorsAsJson}\n`);
  }
}

function testAccessibility(url: string): void {
  describe(`Page ${url}`, () => {
    test('should have no accessibility errors', async () => {
      const testUrl = agent.get(url).url;
      await ensurePageCallWillSucceed(url);
      const result = await runPally(testUrl);
      expect(result.issues).toEqual(expect.any(Array));
      expectNoErrors(result.issues);
    }, 150000); // 150s for Jest
  });
}

describe('Accessibility', () => {
  testAccessibility('/');
});
