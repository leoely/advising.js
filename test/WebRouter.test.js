import { describe, expect, test, } from '@jest/globals';
import WebRouter from '~/class/WebRouter';

describe('[Class] WebRouter;', () => {
  test('WebRouter additions require additional support for path variables.', () => {
    const webRouter = new WebRouter({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
    });
    webRouter.add('/movie/action//{page}/{index}', ['Thunderbolts', 'Sinners', 'Havoc']);
    expect(JSON.stringify(webRouter.router.root.find('movie').find('action').pathKeys)).toMatch('[\"page\",\"index\"]');
  });

  test('WebRouter additions require additional support for path variables.', () => {
    const webRouter = new WebRouter({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
    });
    webRouter.add('/movie/action//{page}/{index}', ['Thunderbolts', 'Sinners', 'Havoc']);
    expect(JSON.stringify(webRouter.match('/movie/action//1/1?k1=v1&k2=v2'))).toMatch('{\"content\":[\"Thunderbolts\",\"Sinners\",\"Havoc\"],\"queryParams\":{\"k2\":\"v2\",\"k1\":\"v1k2\"},\"pathVariables\":{\"page\":\"1\",\"index\":\"1\"}}');
  });
});
