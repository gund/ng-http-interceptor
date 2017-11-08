import { browser, by, ElementArrayFinder, ElementFinder } from 'protractor';

describe('Umd bundle', () => {

  beforeEach(() => browser.get('http://localhost:8080'));

  it('should have title', () => {
    expect(browser.getTitle()).toBe('Ng Http Demo' as any);
  });

  describe('Ng App', () => {
    beforeEach(() => browser.wait(() => browser.element(by.css('.loaded-app')).isPresent()));

    describe('controls', () => {
      it('should be present', () => {
        const h2 = browser.element(by.css('h2'));
        expect(h2.getText()).toBe('Ng2 Http Interceptor Demo' as any);

        const input = browser.element(by.css('input[type="text"]'));
        expect(input.isPresent()).toBeTruthy();

        const button = browser.element(by.css('button'));
        expect(button.getText()).toBe('Make request' as any);
      });
    });

    describe('interception flow', () => {
      let input: ElementFinder
        , btn: ElementFinder
        , requests: ElementArrayFinder
        , error: ElementFinder
        , response: ElementFinder;

      beforeEach(() => {
        input = browser.element(by.css('input[type="text"]'));
        btn = browser.element(by.css('button'));
        requests = browser.element(by.css('.requests')).all(by.css('p'));
        error = browser.element(by.css('.error'));
        response = browser.element(by.css('.response'));
      });

      it('should make request to `/` and render response by default', () => {
        const request = requests.last();
        expect(request.getText()).toMatch(/get request to \//i);
        expect(response.getText()).toMatch(/DOCTYPE/);
      });

      it('should make request to `/none` and render error', () => {
        input.sendKeys('/none');
        btn.click();
        browser.waitForAngular();

        expect(requests.count()).toBe(2 as any);
        expect(requests.last().getText()).toMatch(/get request to \/none/i);

        expect(error.isPresent()).toBeTruthy();
        expect(error.getText()).toMatch(/404/);
      });
    });
  });
});
