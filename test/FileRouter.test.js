import { describe, expect, test, } from '@jest/globals';
import FileRouter from '~/class/FileRouter';

describe('[Class] FileRouter;', () => {
  test('FileRouter should support relative paths.', () => {
    const fileRouter = new FileRouter({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
      interception: undefined,
      debug: false,
    });
    fileRouter.attach('../.../test.js', { name: 'test', suffix: 'js', });
    fileRouter.attach('../../demo.sh', { name: 'demo', suffix: 'sh', });
    expect(JSON.stringify(fileRouter.gain('../.../test.js'))).toMatch('{\"name\":\"test\",\"suffix\":\"js\"}');
    expect(JSON.stringify(fileRouter.gain('../../demo.sh'))).toMatch('{\"name\":\"demo\",\"suffix\":\"sh\"}');
    expect(fileRouter.root.find('..').count).toBe(2);
    expect(fileRouter.root.find('..').find('...').find('js').find('test').count).toBe(1);
    expect(fileRouter.root.find('..').find('..').find('sh').find('demo').count).toBe(1);
  });

  test('FileRouter should support absolute paths.', () => {
    const fileRouter = new FileRouter({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
      interception: undefined,
      debug: false,
    });
    fileRouter.attach('/var/log/2015', { name: '2015', description: 1, });
    fileRouter.attach('/var/log/2025', { name: '2025', description: 2, });
    expect(JSON.stringify(fileRouter.gain('/var/log/2015'))).toMatch('{\"name\":\"2015\",\"description\":1}');
    expect(JSON.stringify(fileRouter.gain('/var/log/2025'))).toMatch('{\"name\":\"2025\",\"description\":2}');
    expect(fileRouter.root.find('var').count).toBe(2);
    expect(fileRouter.root.find('var').find('log').count).toBe(2);
    expect(fileRouter.root.find('var').find('log').find('2015').count).toBe(1);
    expect(fileRouter.root.find('var').find('log').find('2025').count).toBe(1);
  });
});
