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

  test('FileRouter should be able to hanlde network relative paths.', () => {
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
    fileRouter.attach('/index.html', { name: 'index', suffix: 'html', });
    fileRouter.attach('/main.js', { name: 'main', suffix: 'js', });
    expect(JSON.stringify(fileRouter.gain('/index.html'))).toMatch('{\"name\":\"index\",\"suffix\":\"html\"}');
    expect(JSON.stringify(fileRouter.gain('/main.js'))).toMatch('{\"name\":\"main\",\"suffix\":\"js\"}');
    expect(fileRouter.root.count).toBe(2);
    expect(fileRouter.root.find('js').find('main').count).toBe(1);
    expect(fileRouter.root.find('html').find('index').count).toBe(1);
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

  test('FileRouter should support multi-level file names.', () => {
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
    fileRouter.attach('/445.chunk.js', { type: 'chunk', name: '445', });
    fileRouter.attach('/main.bundle.js', { type: 'bundle', name: 'main', });
    expect(JSON.stringify(fileRouter.gain('/445.chunk.js'))).toMatch('{\"type\":\"chunk\",\"name\":\"445\"}');
    expect(JSON.stringify(fileRouter.gain('/main.bundle.js'))).toMatch('{\"type\":\"bundle\",\"name\":\"main\"}');
    expect(fileRouter.root.find('js').count).toBe(2);
    expect(fileRouter.root.find('js').find('chunk').count).toBe(1);
    expect(fileRouter.root.find('js').find('bundle').count).toBe(1);
  });

  test('FileRouter is set to be hidden without error.', () => {
    const fileRouter = new FileRouter({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 8,
      logInterval: 5,
      interception: undefined,
      hideError: true,
      debug: false,
    });
    expect(fileRouter.gain('/male/john')).toBe(undefined);
    expect(fileRouter.gain('/main.bundle.js')).toBe(undefined);
    expect(fileRouter.gain('/445.chunk.js')).toBe(undefined);
    expect(fileRouter.gain('./static/445.chunk.js')).toBe(undefined);
    expect(fileRouter.gain('./asset/favicon-32x32.png')).toBe(undefined);
    expect(fileRouter.gain('/Users/test/Works/temporary/asset')).toBe(undefined);
    expect(fileRouter.gain('/fasdfdas/fasdfads/gasdfasd.fsadfsad/.fadsfasdfdsa')).toBe(undefined);
  });

  test('FileRouter can handle individual file name.', () => {
    const fileRouter = new FileRouter({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 8,
      logInterval: 5,
      interception: undefined,
      hideError: true,
      debug: false,
    });
    fileRouter.attach('445.chunk.js', { type: 'chunk', name: '445', });
    fileRouter.attach('main.bundle.js', { type: 'bundle', name: 'main', });
    expect(JSON.stringify(fileRouter.gain('445.chunk.js'))).toMatch('{\"type\":\"chunk\",\"name\":\"445\"}');
    expect(JSON.stringify(fileRouter.gain('main.bundle.js'))).toMatch('{\"type\":\"bundle\",\"name\":\"main\"}');
    expect(fileRouter.root.find('js').count).toBe(2);
    expect(fileRouter.root.find('js').find('chunk').count).toBe(1);
    expect(fileRouter.root.find('js').find('bundle').count).toBe(1);
  });
});
