import { describe, expect, test, } from '@jest/globals';
import Router from '~/class/Router';

describe('[Class] Router: Time complexity test cases;', () => {
  test('Router should be able to hash conversion when add.', () => {
    const router = new Router({
      threshold: 0,
      number: 4,
      bond: 0,
      dutyCycle: 0,
      logLevel: 7,
      logInterval: 5,
      interception: undefined,
      debug: false,
    });
    router.add('/male/john', ['male', 'john'], { name: 'john', age: 22, });
    expect(router.root.status).toBe(5);
    expect(Array.isArray(router.root.hash)).toBe(true);
    expect(router.root.find('male').status).toBe(5);
    expect(Array.isArray(router.root.find('male').hash)).toBe(true);
  });

  test('Router matching result should be correct.', () => {
    const router = new Router({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
      interception: undefined,
      debug: false,
    });
    router.add('/male/john', ['male', 'john'], { name: 'john', age: 22, });
    router.add('/male/robert', ['male', 'robert'], { name: 'robert', age: 18, });
    router.add('/male/david', ['male', 'david'], { name: 'david', age: 40, });
    expect(JSON.stringify(router.match('/male/john', ['male', 'john']))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/robert', ['male', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/david', ['male', 'david']))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male/david', ['male', 'david']))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male/david', ['male', 'david']))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male/david', ['male', 'david']))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male/david', ['male', 'david']))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male/david', ['male', 'david']))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male/david', ['male', 'david']))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male/robert', ['male', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/john', ['male', 'john']))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/john', ['male', 'john']))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/john', ['male', 'john']))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/john', ['male', 'john']))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/robert', ['male', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/robert', ['male', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/robert', ['male', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(router.root.count).toBe(17);
    expect(router.root.find('male').count).toBe(17);
    expect(router.root.find('male').find('john').count).toBe(5);
    router.delete('/male/david', ['male', 'david']);
  });

  test('Router adds results after matching should be correct.', () => {
    const router = new Router({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
      interception: undefined,
      debug: false,
    });
    router.add('/male/john', ['male', 'john'], { name: 'john', age: 22, });
    router.add('/male/robert', ['male', 'robert'], { name: 'robert', age: 18, });
    router.add('/male/david', ['male', 'david'], { name: 'david', age: 40, });
    expect(JSON.stringify(router.match('/male/john', ['male', 'john']))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/robert', ['male', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/david', ['male', 'david']))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male/david', ['male', 'david']))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male/david', ['male', 'david']))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male/david', ['male', 'david']))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male/david', ['male', 'david']))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male/david', ['male', 'david']))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male/david', ['male', 'david']))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male/robert', ['male', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    router.add('/male', ['male'], ['john', 'robert', 'david']);
    expect(JSON.stringify(router.match('/male/john', ['male', 'john']))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/john', ['male', 'john']))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/john', ['male', 'john']))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/john', ['male', 'john']))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/robert', ['male', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/robert', ['male', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/robert', ['male', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male', ['male']))).toMatch('[\"john\",\"robert\",\"david\"]');
  });

  test('Router leaf node mixture produces results from thing result should be correct.', () => {
    const router = new Router({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
      interception: undefined,
      debug: false,
    });
    router.add('/male', ['male'], ['john', 'robert', 'david']);
    router.add('/male/john', ['male', 'john'], { name: 'john', age: 22, });
    router.add('/male/robert', ['male', 'robert'], { name: 'robert', age: 18, });
    router.add('/male/david', ['male', 'david'], { name: 'david', age: 40, });
    expect(JSON.stringify(router.match('/male/john', ['male', 'john']))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/robert', ['male', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/david', ['male', 'david']))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male', ['male']))).toMatch('[\"john\",\"robert\",\"david\"]');
  });

  test('Router leaf node mixture produces results from cluster should be correct.', () => {
    const router = new Router({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
      interception: undefined,
      debug: false,
    });
    router.add('/male/john', ['male', 'john'], { name: 'john', age: 22, });
    router.add('/male/robert', ['male', 'robert'], { name: 'robert', age: 18, });
    router.add('/male/david', ['male', 'david'], { name: 'david', age: 40, });
    router.add('/male', ['male'], ['john', 'robert', 'david']);
    expect(JSON.stringify(router.match('/male', ['male']))).toMatch('[\"john\",\"robert\",\"david\"]');
    expect(JSON.stringify(router.match('/male/john', ['male', 'john']))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/robert', ['male', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/david', ['male', 'david']))).toMatch('{\"name\":\"david\",\"age\":40}');
  });

  test('Router matching containing the mixture should be correct.', () => {
    const router = new Router({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
      interception: undefined,
      debug: false,
    });
    router.add('/male/programmer/john', ['male', 'programmer', 'john'], { name: 'john', age: 22, });
    router.add('/male/programmer/robert', ['male', 'programmer', 'robert'], { name: 'robert', age: 18, });
    router.add('/male/programmer/david', ['male', 'programmer', 'david'], { name: 'david', age: 40, });
    router.add('/male/programmer', ['male', 'programmer'], ['john', 'robert', 'david']);
    expect(JSON.stringify(router.match('/male/programmer', ['male', 'programmer']))).toMatch('[\"john\",\"robert\",\"david\"]');
    expect(JSON.stringify(router.match('/male/programmer/john', ['male', 'programmer', 'john']))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/programmer/robert', ['male', 'programmer', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/programmer/david', ['male', 'programmer', 'david']))).toMatch('{\"name\":\"david\",\"age\":40}');
  });

  test('Router intermediate node mixture produces resuls should be correct.', () => { //const router = new Router({
    const router = new Router({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
      interception: undefined,
      debug: false,
    });
    router.add('/country/unitedKingdom/london', ['country', 'unitedKingdom', 'london'], { id: 1, name: 'london',});
    router.add('/country/unitedKingdom/england', ['country', 'unitedKingdom', 'england'], { id: 2, name: 'england',});
    router.add('/country/unitedKingdom/liverpool', ['country', 'unitedKingdom', 'liverpool'], { id: 3, name: 'liveprool',  });
    router.add('/country/unitedKingdom/belfast', ['country', 'unitedKingdom', 'belfast'], { id: 4, name: 'belfast', });
    router.add('/country', ['country'], ['united kingdom']);
    expect(JSON.stringify(router.match('/country/unitedKingdom/london', ['country', 'unitedKingdom', 'london']))).toMatch('{\"id\":1,\"name\":\"london\"}');
    expect(JSON.stringify(router.match('/country/unitedKingdom/england', ['country', 'unitedKingdom', 'england']))).toMatch('{\"id\":2,\"name\":\"england\"}');
    expect(JSON.stringify(router.match('/country/unitedKingdom/liverpool', ['country', 'unitedKingdom', 'liverpool']))).toMatch('{\"id\":3,\"name\":\"liveprool\"}');
    expect(JSON.stringify(router.match('/country/unitedKingdom/belfast', ['country', 'unitedKingdom', 'belfast']))).toMatch('{\"id\":4,\"name\":\"belfast\"}');
    expect(JSON.stringify(router.match('/country', ['country']))).toMatch('[\"united kingdom\"]');
  });

  test('Router should support pure numbers and pure letters.', () => {
    const router = new Router({
      threshold: 0.1,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
      interception: undefined,
      debug: false,
    });
    router.add('/male/john', ['male', 'john'], { name: 'john', age: 22, });
    router.add('/male/robert', ['male', 'robert'], { name: 'robert', age: 18, });
    router.add('/male/david', ['male', 'david'], { name: 'david', age: 40, });
    router.add('/citys/1', ['citys', '1'], ['new york', 'london', 'tokyo']);
    router.add('/citys/2', ['citys', '2'], ['pairs', 'beijing', 'los angeles']);
    expect(JSON.stringify(router.match('/male/john', ['male', 'john']))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/robert', ['male', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/david', ['male', 'david']))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/citys/1', ['citys', '1']))).toMatch('[\"new york\",\"london\",\"tokyo\"]');
    expect(JSON.stringify(router.match('/citys/2', ['citys', '2']))).toMatch('[\"pairs\",\"beijing\",\"los angeles\"]');
    expect(JSON.stringify(router.match('/citys/1', ['citys', '1']))).toMatch('[\"new york\",\"london\",\"tokyo\"]');
    expect(JSON.stringify(router.match('/citys/2', ['citys', '2']))).toMatch('[\"pairs\",\"beijing\",\"los angeles\"]');
    expect(JSON.stringify(router.match('/citys/1', ['citys', '1']))).toMatch('[\"new york\",\"london\",\"tokyo\"]');
    expect(JSON.stringify(router.match('/citys/2', ['citys', '2']))).toMatch('[\"pairs\",\"beijing\",\"los angeles\"]');
    expect(JSON.stringify(router.match('/citys/1', ['citys', '1']))).toMatch('[\"new york\",\"london\",\"tokyo\"]');
    expect(JSON.stringify(router.match('/citys/2', ['citys', '2']))).toMatch('[\"pairs\",\"beijing\",\"los angeles\"]');
    expect(JSON.stringify(router.match('/citys/1', ['citys', '1']))).toMatch('[\"new york\",\"london\",\"tokyo\"]');
    expect(JSON.stringify(router.match('/citys/2', ['citys', '2']))).toMatch('[\"pairs\",\"beijing\",\"los angeles\"]');
    expect(JSON.stringify(router.match('/citys/1', ['citys', '1']))).toMatch('[\"new york\",\"london\",\"tokyo\"]');
    expect(JSON.stringify(router.match('/citys/2', ['citys', '2']))).toMatch('[\"pairs\",\"beijing\",\"los angeles\"]');
    expect(JSON.stringify(router.match('/citys/1', ['citys', '1']))).toMatch('[\"new york\",\"london\",\"tokyo\"]');
    expect(JSON.stringify(router.match('/citys/2', ['citys', '2']))).toMatch('[\"pairs\",\"beijing\",\"los angeles\"]');
    expect(JSON.stringify(router.match('/citys/1', ['citys', '1']))).toMatch('[\"new york\",\"london\",\"tokyo\"]');
    expect(JSON.stringify(router.match('/citys/2', ['citys', '2']))).toMatch('[\"pairs\",\"beijing\",\"los angeles\"]');
    expect(JSON.stringify(router.match('/citys/1', ['citys', '1']))).toMatch('[\"new york\",\"london\",\"tokyo\"]');
    expect(JSON.stringify(router.match('/citys/2', ['citys', '2']))).toMatch('[\"pairs\",\"beijing\",\"los angeles\"]');
  });
});

describe('[Class] Router:', () => {
});

describe('[Class] Router: Space complexity test cases;', () => {
  test('Router initial space is small.', () => {
    const router = new Router({
      threshold: 0.5,
      number: 4,
      bond: 5,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
      interception: undefined,
      debug: false,
    });
    router.add('/male/john', ['male', 'john'], { name: 'john', age: 22, });
    expect(typeof router.root.hash['male']).toMatch('object');
    expect(typeof router.root.hash['male'].hash['john']).toMatch('object');
    expect(router.root.hash['male'].childrens).toBe(undefined);
  });

  test('Router is reduced to the initial hash should be correct.', () => {
    const router = new Router({
      threshold: 0.5,
      number: 2,
      bond: undefined,
      dutyCycle: undefined,
      logLevel: 7,
      logInterval: 5,
      interception: undefined,
      debug: false,
    });
    router.add('/male/programmer/john', ['male', 'programmer', 'john'], { name: 'john', age: 22, });
    router.add('/male/hardwareEngineer/robert', ['male', 'hardwareEngineer', 'robert'], { name: 'robert', age: 18, });
    expect(JSON.stringify(router.match('/male/programmer/john', ['male', 'programmer', 'john']))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert', ['male', 'hardwareEngineer', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert', ['male', 'hardwareEngineer', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert', ['male', 'hardwareEngineer', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert', ['male', 'hardwareEngineer', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert', ['male', 'hardwareEngineer', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert', ['male', 'hardwareEngineer', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert', ['male', 'hardwareEngineer', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert', ['male', 'hardwareEngineer', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert', ['male', 'hardwareEngineer', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert', ['male', 'hardwareEngineer', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert', ['male', 'hardwareEngineer', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert', ['male', 'hardwareEngineer', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/programmer/john', ['male', 'programmer', 'john']))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(typeof router.root.find('male').find('programmer').hash).toMatch('object');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert', ['male', 'hardwareEngineer', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
  });

  test('Router is reduced to middle hash should be correct.', () => {
    const router = new Router({
      threshold: 0.5,
      number: 0,
      bond: undefined,
      dutyCycle: undefined,
      logLevel: 7,
      logInterval: 5,
      interception: undefined,
      debug: false,
    });
    router.add('/male/programmer/john', ['male', 'programmer', 'john'], { name: 'john', age: 22, });
    router.add('/male/hardwareEngineer/robert', ['male', 'hardwareEngineer', 'robert'], { name: 'robert', age: 18, });
    expect(JSON.stringify(router.match('/male/programmer/john', ['male', 'programmer', 'john']))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert', ['male', 'hardwareEngineer', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert', ['male', 'hardwareEngineer', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert', ['male', 'hardwareEngineer', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert', ['male', 'hardwareEngineer', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert', ['male', 'hardwareEngineer', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert', ['male', 'hardwareEngineer', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert', ['male', 'hardwareEngineer', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert', ['male', 'hardwareEngineer', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert', ['male', 'hardwareEngineer', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert', ['male', 'hardwareEngineer', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert', ['male', 'hardwareEngineer', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert', ['male', 'hardwareEngineer', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/programmer/john', ['male', 'programmer', 'john']))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(Array.isArray(router.root.find('male').find('programmer').hash)).toBe(true);
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert', ['male', 'hardwareEngineer', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
  });

  test('Router delete route should be correct.', () => {
    const router = new Router({
      threshold: 0.5,
      number: 4,
      bond: 5,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
      interception: undefined,
      hideError: true,
      debug: false,
    });
    router.add('/male/john', ['male', 'john'], { name: 'john', age: 22, });
    router.add('/male/robert', ['male', 'robert'], { name: 'robert', age: 18, });
    router.add('/male/david', ['male', 'david'], { name: 'david', age: 40, });
    expect(JSON.stringify(router.match('/male/john', ['male', 'john']))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/robert', ['male', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/david', ['male', 'david']))).toMatch('{\"name\":\"david\",\"age\":40}');
    router.delete('/male/john', ['male', 'john']);
    expect(router.root.count).toBe(2);
    router.delete('/male/robert', ['male', 'robert']);
    expect(router.root.count).toBe(1);
    expect(router.root.find('male').count).toBe(1);
    router.delete('/male/david', ['male', 'david']);
  });

  test('Router delete all routes should be correct.', () => {
    const router = new Router({
      threshold: 0.5,
      number: 4,
      bond: 5,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
      interception: undefined,
      hideError: true,
      debug: false,
    });
    router.add('/male/john', ['male', 'john'], { name: 'john', age: 22, });
    router.add('/male/robert', ['male', 'robert'], { name: 'robert', age: 18, });
    router.add('/male/david', ['male', 'david'], { name: 'david', age: 40, });
    expect(JSON.stringify(router.match('/male/john', ['male', 'john']))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/robert', ['male', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/david', ['male', 'david']))).toMatch('{\"name\":\"david\",\"age\":40}');
    router.deleteAll([['/male/john', ['male', 'john']], ['/male/robert', ['male', 'robert']], ['/male, david', ['male', 'david']]]);
  });

  test('Router update routes should be correct.', () => {
    const router = new Router({
      threshold: 0.5,
      number: 4,
      bond: 5,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
      interception: undefined,
      debug: false,
    });
    router.add('/world/male', ['world', 'male'], ['john', 'robert', 'david']);
    expect(JSON.stringify(router.match('/world/male', ['world', 'male']))).toMatch('[\"john\",\"robert\",\"david\"]');
    router.update('/world/male', ['world', 'male'], ['jason', 'kevin', 'eric']);
    expect(router.root.count).toBe(0);
    expect(JSON.stringify(router.match('/world/male', ['world', 'male']))).toMatch('[\"jason\",\"kevin\",\"eric\"]');
    expect(() => router.update('/world/female', ['world', 'female'], ['amani', 'tiffany', 'carolyn'])).toThrow('[Error] Router matching the location does not exist.');
  });

  test('Router exchange routes should be correct.', () => {
    const router = new Router({
      threshold: 0.5,
      number: 4,
      bond: 5,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
      interception: undefined,
      debug: false,
    });
    router.add('/male/john', ['male', 'john'], { name: 'john', age: 22, });
    router.add('/male/robert', ['male', 'robert'], { name: 'robert', age: 18, });
    expect(JSON.stringify(router.match('/male/john', ['male', 'john']))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/john', ['male', 'john']))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/robert', ['male', 'robert']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    router.swap('/male/john', '/male/robert', ['male', 'john'], ['male', 'robert']);
    expect(router.root.find('male').find('john').count).toBe(1);
    expect(router.root.find('male').find('robert').count).toBe(2);
    expect(router.root.find('male').count).toBe(3);
    expect(JSON.stringify(router.match('/male/john', ['male', 'john']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/robert', ['male', 'robert']))).toMatch('{\"name\":\"john\",\"age\":22}');
  });

  test('Router fix route should be correct.', () => {
    const router = new Router({
      threshold: 0.5,
      number: 4,
      bond: 5,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
      interception: undefined,
      debug: false,
    });
    router.add('/male/john', ['male', 'john'], { name: 'robert', age: 18, });
    expect(JSON.stringify(router.match('/male/john', ['male', 'john']))).toMatch('{\"name\":\"robert\",\"age\":18}');
    router.fix('/male/john', ['male', 'john'], { name: 'john', age: 22, });
    expect(JSON.stringify(router.match('/male/john', ['male', 'john']))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/john', ['male', 'john']))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/john', ['male', 'john']))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/john', ['male', 'john']))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(router.root.find('male').find('john').count).toBe(5);
    expect(router.root.find('male').count).toBe(5);
  });

  test('Router truncation function should work correctly.', () => {
    const router = new Router({
      threshold: 0.5,
      number: 4,
      bond: 5,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
      interception: 3,
      hideError: true,
      debug: false,
    });
    router.add('/long/long', ['long', 'long'], { type: 'long', });
    expect(JSON.stringify(router.match('/long/long', ['long', 'long']))).toMatch('{\"type\":\"long\"}');
    expect(JSON.stringify(router.match('/long/long', ['long', 'long']))).toMatch('{\"type\":\"long\"}');
    expect(JSON.stringify(router.match('/long/long', ['long', 'long']))).toMatch('{\"type\":\"long\"}');
    expect(JSON.stringify(router.match('/long/long', ['long', 'long']))).toMatch('{\"type\":\"long\"}');
    expect(JSON.stringify(router.match('/long/long', ['long', 'long']))).toMatch('{\"type\":\"long\"}');
    router.delete('/long/long', ['long', 'long']);
  });

  test('Router can support full range of characters.', () => {
    const router = new Router({
      threshold: 0.5,
      number: 2,
      bond: 5,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
      interception: 3,
      hideError: true,
      debug: false,
    });
    router.add('/book/Cien años de soledad', ['book', 'Cien años de soledad'], { name: 'Cien años de soledad', });
    router.add('/book/Как закалялась сталь', ['book', 'Как закалялась сталь'], { name: 'Как закалялась сталь', });
    router.add('/book/Män som hatar kvinnor', ['book', 'Män som hatar kvinnor'], { name: 'Män som hatar kvinnor', });
    expect(JSON.stringify(router.match('/book/Cien años de soledad', ['book', 'Cien años de soledad']))).toMatch('{\"name\":\"Cien años de soledad\"}');
    expect(router.root.find('book').status).toBe(7);
    expect(JSON.stringify(router.match('/book/Cien años de soledad', ['book', 'Cien años de soledad']))).toMatch('{\"name\":\"Cien años de soledad\"}');
    expect(JSON.stringify(router.match('/book/Cien años de soledad', ['book', 'Cien años de soledad']))).toMatch('{\"name\":\"Cien años de soledad\"}');
    expect(JSON.stringify(router.match('/book/Cien años de soledad', ['book', 'Cien años de soledad']))).toMatch('{\"name\":\"Cien años de soledad\"}');
    expect(JSON.stringify(router.match('/book/Cien años de soledad', ['book', 'Cien años de soledad']))).toMatch('{\"name\":\"Cien años de soledad\"}');
    expect(JSON.stringify(router.match('/book/Как закалялась сталь', ['book', 'Как закалялась сталь']))).toMatch('{\"name\":\"Как закалялась сталь\"}');
    expect(JSON.stringify(router.match('/book/Как закалялась сталь', ['book', 'Как закалялась сталь']))).toMatch('{\"name\":\"Как закалялась сталь\"}');
    expect(JSON.stringify(router.match('/book/Как закалялась сталь', ['book', 'Как закалялась сталь']))).toMatch('{\"name\":\"Как закалялась сталь\"}');
    expect(JSON.stringify(router.match('/book/Как закалялась сталь', ['book', 'Как закалялась сталь']))).toMatch('{\"name\":\"Как закалялась сталь\"}');
    expect(router.root.find('book').status).toBe(7);
    router.delete('/book/Cien años de soledad', ['book', 'Cien años de soledad']);
    expect(Array.isArray(router.root.find('book').hash)).toBe(true);
    expect(JSON.stringify(router.match('/book/Cien años de soledad', ['book', 'Cien años de soledad']))).toBe(undefined);
    expect(JSON.stringify(router.match('/book/Män som hatar kvinnor', ['book', 'Män som hatar kvinnor']))).toMatch('{\"name\":\"Män som hatar kvinnor\"}');
    expect(JSON.stringify(router.match('/book/Män som hatar kvinnor', ['book', 'Män som hatar kvinnor']))).toMatch('{\"name\":\"Män som hatar kvinnor\"}');
    expect(JSON.stringify(router.match('/book/Män som hatar kvinnor', ['book', 'Män som hatar kvinnor']))).toMatch('{\"name\":\"Män som hatar kvinnor\"}');
    expect(JSON.stringify(router.match('/book/Män som hatar kvinnor', ['book', 'Män som hatar kvinnor']))).toMatch('{\"name\":\"Män som hatar kvinnor\"}');
    router.add('/book/窓ぎわのトットちゃん', ['book', '窓ぎわのトットちゃん'], { name: 'Cien años de soledad', });
    expect(JSON.stringify(router.match('/book/窓ぎわのトットちゃん', ['book', '窓ぎわのトットちゃん'], { name: 'Cien años de soledad', }))).toMatch('{\"name\":\"Cien años de soledad\"}');
    expect(JSON.stringify(router.match('/book/窓ぎわのトットちゃん', ['book', '窓ぎわのトットちゃん'], { name: 'Cien años de soledad', }))).toMatch('{\"name\":\"Cien años de soledad\"}');
    expect(JSON.stringify(router.match('/book/窓ぎわのトットちゃん', ['book', '窓ぎわのトットちゃん'], { name: 'Cien años de soledad', }))).toMatch('{\"name\":\"Cien años de soledad\"}');
    expect(JSON.stringify(router.match('/book/窓ぎわのトットちゃん', ['book', '窓ぎわのトットちゃん'], { name: 'Cien años de soledad', }))).toMatch('{\"name\":\"Cien años de soledad\"}');
    expect(JSON.stringify(router.match('/book/窓ぎわのトットちゃん', ['book', '窓ぎわのトットちゃん'], { name: 'Cien años de soledad', }))).toMatch('{\"name\":\"Cien años de soledad\"}');
  });

  test('Router should be able to handle moderate hash removal situations.', () => {
    let router = new Router({
      threshold: undefined,
      number: 1,
      bond: 2,
      dutyCycle: undefined,
      logLevel: 7,
      logInterval: 5,
      interception: undefined,
      hideError: true,
      debug: false,
    });
    router.add('/book/1', ['book', '1'], { name: 'Cien años de soledad', });
    router.add('/book/2', ['book', '2'], { name: 'Как закалялась сталь', });
    expect(JSON.stringify(router.match('/book/1', ['book', '1']))).toMatch('{\"name\":\"Cien años de soledad\"}');
    expect(JSON.stringify(router.match('/book/1', ['book', '1']))).toMatch('{\"name\":\"Cien años de soledad\"}');
    expect(JSON.stringify(router.match('/book/1', ['book', '1']))).toMatch('{\"name\":\"Cien años de soledad\"}');
    router.add('/book/3', ['book', '3'], { name: 'Män som hatar kvinnor', });
    expect(JSON.stringify(router.match('/book/3', ['book', '3']))).toMatch('{\"name\":\"Män som hatar kvinnor\"}');
    router.match('/book/2', ['book', '2']);
    router.delete('/book/1', ['book', '1']);
    router.delete('/book/3', ['book', '3']);
    router.delete('/book/2', ['book', '2']);
    expect(router.match('/book/1', ['book', '1'])).toBe(undefined);
    expect(router.match('/book/2', ['book', '2'])).toBe(undefined);
    expect(router.match('/book/3', ['book', '3'])).toBe(undefined);
  });

  test('Router should be able to handle exceptions in case of truncation of the medium hash.', () => {
    const router = new Router({
      threshold: 0.5,
      number: 2,
      bond: 2,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
      interception: 3,
      hideError: true,
      debug: false,
    });
    router.add('/book/1', ['book', '1'], { name: 'Cien años de soledad', });
    router.add('/book/2', ['book', '2'], { name: 'Как закалялась сталь', });
    expect(JSON.stringify(router.match('/book/1', ['book', '1']))).toMatch('{\"name\":\"Cien años de soledad\"}');
    expect(JSON.stringify(router.match('/book/1', ['book', '1']))).toMatch('{\"name\":\"Cien años de soledad\"}');
    expect(JSON.stringify(router.match('/book/1', ['book', '1']))).toMatch('{\"name\":\"Cien años de soledad\"}');
    expect(JSON.stringify(router.match('/book/1', ['book', '1']))).toMatch('{\"name\":\"Cien años de soledad\"}');
    router.add('/book/3', ['book', '3'], { name: 'Män som hatar kvinnor', });
    expect(JSON.stringify(router.match('/book/3', ['book', '3']))).toMatch('{\"name\":\"Män som hatar kvinnor\"}');
    router.match('/book/2', ['book', '2']);
    router.delete('/book/1', ['book', '1']);
    expect(router.match('/book/1', ['book', '1'])).toBe(undefined);
    router.delete('/book/3', ['book', '3']);
    expect(router.match('/book/3', ['book', '3'])).toBe(undefined);
    expect(JSON.stringify(router.match('/book/2', ['book', '2']))).toMatch('{\"name\":\"Как закалялась сталь\"}');
  });

  test('Router should be able to handle hash reconstruction from digital cases.', () => {
    const router = new Router({
      threshold: 0.5,
      number: 3,
      bond: 5,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
      interception: undefined,
      hideError: true,
      debug: false,
    });
    router.add('/hex/000000', ['hex', '000000'], { color: '000000', });
    expect(JSON.stringify(router.match('/hex/000000', ['hex', '000000']))).toMatch('{\"color\":\"000000\"}');
    expect(JSON.stringify(router.match('/hex/000000', ['hex', '000000']))).toMatch('{\"color\":\"000000\"}');
    router.add('/hex/30b3a3', ['hex', '30b3a3'], { hex: '30b3a3', });
    expect(JSON.stringify(router.match('/hex/30b3a3', ['hex', '30b3a3']))).toMatch('{\"hex\":\"30b3a3\"}');
    router.delete('/hex/30b3a3', ['hex', '30b3a3'], { hex: '30b3a3', });
    expect(JSON.stringify(router.match('/hex/000000', ['hex', '000000']))).toMatch('{\"color\":\"000000\"}');
    router.add('/hex/569498', ['hex', '569498'], { color: '569498', });
    expect(JSON.stringify(router.match('/hex/569498', ['hex', '569498']))).toMatch('{\"color\":\"569498\"}');
    expect(JSON.stringify(router.match('/hex/000000', ['hex', '000000']))).toMatch('{\"color\":\"000000\"}');
    router.add('/hex/2168ad', ['hex', '2168ad'], { color: '2168ad', });
    expect(JSON.stringify(router.match('/hex/2168ad', ['hex', '2168ad']))).toMatch('{\"color\":\"2168ad\"}');
    router.delete('/hex/2168ad', ['hex', '2168ad']);
    expect(JSON.stringify(router.match('/hex/000000', ['hex', '000000']))).toMatch('{\"color\":\"000000\"}');
    expect(JSON.stringify(router.match('/hex/000000', ['hex', '000000']))).toMatch('{\"color\":\"000000\"}');
    expect(JSON.stringify(router.match('/hex/000000', ['hex', '000000']))).toMatch('{\"color\":\"000000\"}');
    router.add('/hex/34eb43', ['hex', '34eb43'], { color: '34eb43', });
    expect(JSON.stringify(router.match('/hex/34eb43', ['hex', '34eb43']))).toMatch('{\"color\":\"34eb43\"}');
    router.add('/hex/14406b', ['hex', '14406b'], { color: '14406b', });
    expect(JSON.stringify(router.match('/hex/14406b', ['hex', '14406b']))).toMatch('{\"color\":\"14406b\"}');
  });

  test('Router should be able to handle hash reconstruction case from alphabet cases.', () => {
    const router = new Router({
      threshold: 0.5,
      number: 3,
      bond: 5,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
      interception: undefined,
      hideError: true,
      debug: false,
    });
    router.add('/hex/ffffff', ['hex', 'ffffff'], { color: 'ffffff', });
    expect(JSON.stringify(router.match('/hex/ffffff', ['hex', 'ffffff']))).toMatch('{\"color\":\"ffffff\"}');
    router.add('/hex/aefaca', ['hex', 'aefaca'], { color: 'aefaca', });
    expect(JSON.stringify(router.match('/hex/aefaca', ['hex', 'aefaca']))).toMatch('{\"color\":\"aefaca\"}');
    expect(JSON.stringify(router.match('/hex/ffffff', ['hex', 'ffffff']))).toMatch('{\"color\":\"ffffff\"}');
    expect(JSON.stringify(router.match('/hex/ffffff', ['hex', 'ffffff']))).toMatch('{\"color\":\"ffffff\"}');
    router.add('/hex/6221ad', ['hex', '6221ad'], { color: '6221ad', });
    expect(JSON.stringify(router.match('/hex/6221ad', ['hex', '6221ad']))).toMatch('{\"color\":\"6221ad\"}');
    router.delete('/hex/6221ad', ['hex', '6221ad']);
    expect(JSON.stringify(router.match('/hex/ffffff', ['hex', 'ffffff']))).toMatch('{\"color\":\"ffffff\"}');
    expect(JSON.stringify(router.match('/hex/ffffff', ['hex', 'ffffff']))).toMatch('{\"color\":\"ffffff\"}');
    expect(JSON.stringify(router.match('/hex/ffffff', ['hex', 'ffffff']))).toMatch('{\"color\":\"ffffff\"}');
    router.add('/hex/adad21', ['hex', 'adad21'], { color: 'adad21', });
    expect(JSON.stringify(router.match('/hex/adad21', ['hex', 'adad21']))).toMatch('{\"color\":\"adad21\"}');
    router.add('/hex/4a043e', ['hex', '4a043e'], { color: '4a043e', });
    expect(JSON.stringify(router.match('/hex/4a043e', ['hex', '4a043e']))).toMatch('{\"color\":\"4a043e\"}');
  });
});

describe('[Class] Router: Miscellaneous test cases;', () => {
  test('Router path should prevent letters and numbers from coexisting.', () => {
    const router = new Router({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
      interception: undefined,
      debug: false,
    });
    router.add('/chaos/letter', ['chaos', 'letter'], { type: 'letters', });
    expect(() => router.add('/chaos/1', ['chaos', '1'], { type: 'numbers', })).toThrow('[Error] Cluster is pure numeric type but the newly added is a pure letters.');
  });

  test('Router path should prevent numbers and letters from coexisting.', () => {
    const router = new Router({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
      interception: undefined,
      debug: false,
    });
    router.add('/chaos/1', ['chaos', '1'], { type: 'numbers', });
    expect(() => router.add('/chaos/letter', ['chaos', 'letter'], { type: 'letters', })).toThrow('[Error] Cluster is plain text type but the newly added type is a pure number.');
  });

  test('Router supports default parameters.', () => {
    const router = new Router({
      debug: false,
    });
    expect(typeof router.options).toMatch('object');
  });

  test('Router log level must be set correctly.', () => {
    const router = new Router({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 8,
      logInterval: 5,
      interception: undefined,
      debug: false,
    });
    router.add('/male/john', ['male', 'john'], { name: 'john', age: 22, });
    router.match('/male/john', ['male', 'john']);
    router.match('/male/john', ['male', 'john']);
    router.match('/male/john', ['male', 'john']);
    router.match('/male/john', ['male', 'john']);
    expect(() => router.match('/male/john', ['male', 'john'])).toThrow('[Error] LogLevel must in section [0, 7].');
  });

  test('Router is set to be hidden without error..', () => {
    const router = new Router({
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
    router.add('/male/john', ['male', 'john'], { name: 'john', age: 22, });
    router.match('/male/john', ['male', 'john']);
    router.match('/male/john', ['male', 'john']);
    router.match('/male/john', ['male', 'john']);
    router.match('/male/john', ['male', 'john']);
    expect(() => router.match('/male/john', ['male', 'john'])).toThrow('[Error] LogLevel must in section [0, 7].');
  });

  test('Router cannot use subclass methods.', () => {
    const router = new Router({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
      interception: undefined,
      hideError: true,
      debug: false,
    });
    expect(() => router.gain('/male/john')).toThrow('[Error] Only the router subclass that implements method getPathFromLocation can call gain method.');
    expect(() => router.attach('/male/john', { name: 'john', age: 22, })).toThrow('[Error] Only the router subclass that implements method getPathFromLocation can call attach method.');
    expect(() => router.exchange('/male/john', '/male/robert')).toThrow('[Error] Only the router subclass that implements method getPathFromLocation can call exchange method.');
    expect(() => router.ruin('/male/john')).toThrow('[Error] Only the router subclass that implements method getPathFromLocation can call ruin method.');
    expect(() => router.ruinAll(['/male/john', '/male/robert'])).toThrow('[Error] Only the router subclass that implements method getPathFromLocation can call ruinAll method.');
    expect(() => router.replace('/male/john', { name: 'robert', age: 18, })).toThrow('[Error] Only the router subclass that implements method getPathFromLocation can call replace method.');
    expect(() => router.revise('/male/john', { name: 'robert', age: 18, })).toThrow('[Error] Only the router subclass that implements method getPathFromLocation can call revise method.');
  });

  test('It should be normal for Router to produce local mixures from things.', () => {
    const router = new Router({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
      interception: undefined,
      hideError: true,
      debug: false,
    });
    router.add('/error', ['error'], { situation: 'error', level: 42 });
    router.match('/error', ['error']);
    router.match('/error', ['error']);
    router.match('/error', ['error']);
    router.match('/error', ['error']);
    router.add('/errorLocate', ['errorLocate'], { situation: 'errorLocate', level: 58, });
    router.add('/errorReason', ['errorReason'], { situation: 'errorReason', level:66, });
    router.add('/errorThrow', ['errorThrow'], { situation: 'errorThrow', level:29, });
    router.match('/error', ['error']);
    router.match('/error', ['error']);
    router.add('/errorDeal', ['errorDeal'], { situation: 'errorDeal', level: 65, });
    expect(JSON.stringify(router.match('/error', ['error']))).toMatch('{\"situation\":\"error\",\"level\":42}');
    expect(JSON.stringify(router.match('/errorLocate', ['errorLocate']))).toMatch('{\"situation\":\"errorLocate\",\"level\":58}');
    expect(JSON.stringify(router.match('/errorDeal', ['errorDeal']))).toMatch('{\"situation\":\"errorDeal\",\"level\":65}');
    expect(JSON.stringify(router.match('/errorThrow', ['errorThrow']))).toMatch('{\"situation\":\"errorThrow\",\"level\":29}');
    expect(JSON.stringify(router.match('/errorReason', ['errorReason']))).toMatch('{\"situation\":\"errorReason\",\"level\":66}');
  });

  test('Router should work fine to generate local mixture from the array.', () => {
    const router = new Router({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
      interception: undefined,
      hideError: true,
      debug: false,
    });
    router.add('/errorDeal', ['errorDeal'], { situation: 'errorDeal', level: 65, });
    router.add('/errorReason', ['errorReason'], { situation: 'errorReason', level:66, });
    router.match('/errorDeal', ['errorDeal']);
    router.add('/error', ['error'], { situation: 'error', level: 42 });
    router.match('/errorReason', ['Reason']);
    router.match('/errorDeal', ['errorDeal']);
    router.match('/errorDeal', ['errorDeal']);
    router.add('/errorThrow', ['errorThrow'], { situation: 'errorThrow', level:29, });
    router.add('/errorLocate', ['errorLocate'], { situation: 'errorLacate', level: 58, });
    router.match('/errorDeal', ['errorDeal']);
    router.match('/errorDeal', ['errorDeal']);
    router.delete('/error', ['error']);
    router.match('/errorDeal', ['errorDeal']);
    router.add('/error', ['error'], { situation: 'error', level: 42 });
    expect(JSON.stringify(router.match('/error', ['error']))).toMatch('{\"situation\":\"error\",\"level\":42}');
    expect(JSON.stringify(router.match('/errorDeal', ['errorDeal']))).toMatch('{\"situation\":\"errorDeal\",\"level\":65}');
    expect(JSON.stringify(router.match('/errorLocate', ['errorLocate']))).toMatch('{\"situation\":\"errorLacate\",\"level\":58}');
    expect(JSON.stringify(router.match('/errorReason', ['errorReason']))).toMatch('{\"situation\":\"errorReason\",\"level\":66}');
    router.delete('/errorThrow', ['errorThrow']);
    router.add('/errorThrow', ['errorThrow'], { situation: 'errorThrow', level:29, });
    expect(JSON.stringify(router.match('/errorThrow', ['errorThrow']))).toMatch('{\"situation\":\"errorThrow\",\"level\":29}');
    router.delete('/errorLocate', ['errorLocate']);
    expect(router.match('/errorLocate', ['errorLocate'])).toBe(undefined);
    expect(JSON.stringify(router.match('/error', ['error']))).toMatch('{\"situation\":\"error\",\"level\":42}');
    router.delete('/error', ['error']);
    expect(router.match('/error', ['error'])).toBe(undefined);
  });

  test('Router mixture can handle truncation.', () => {
    const router = new Router({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
      interception: 5,
      hideError: true,
      debug: false,
    });
    router.add('/error', ['error'], { situation: 'error', level: 42 });
    expect(JSON.stringify(router.match('/error', ['error']))).toMatch('{\"situation\":\"error\",\"level\":42}');
    expect(JSON.stringify(router.match('/error', ['error']))).toMatch('{\"situation\":\"error\",\"level\":42}');
    expect(JSON.stringify(router.match('/error', ['error']))).toMatch('{\"situation\":\"error\",\"level\":42}');
    expect(JSON.stringify(router.match('/error', ['error']))).toMatch('{\"situation\":\"error\",\"level\":42}');
    expect(JSON.stringify(router.match('/error', ['error']))).toMatch('{\"situation\":\"error\",\"level\":42}');
    router.update('/error', ['error'], { situation: 'errorReplace', level: 68, });
    expect(JSON.stringify(router.match('/error', ['error']))).toMatch('{\"situation\":\"errorReplace\",\"level\":68}');
    router.delete('/error', ['error']);
    router.add('/errorDeal', ['errorDeal'], { situation: 'errorDeal', level: 65, });
    router.match('/errorDeal', ['errorDeal']);
    router.match('/errorDeal', ['errorDeal']);
    router.add('/errorLocate', ['errorLocate'], { situation: 'errorLocate', level: 58, });
    router.match('/errorDeal', ['errorDeal']);
    router.match('/errorDeal', ['errorDeal']);
    router.add('/error', ['error'], { situation: 'error', level: 42 });
    router.add('/errorThrow', ['errorThrow'], { situation: 'errorThrow', level:29, });
    router.match('/errorDeal', ['errorDeal']);
    router.delete('/error', ['error']);
    router.add('/error', ['error'], { situation: 'error', level: 42 });
    router.update('/error', ['error'], { situation: 'errorReplace', level: 68, });
    router.update('/errorLocate', ['errorLocate'], { situation: 'errorLocate', level: 68, });
    expect(JSON.stringify(router.match('/errorLocate', ['errorLocate']))).toMatch('{\"situation\":\"errorLocate\",\"level\":68}');
    router.delete('/errorLocate', ['errorLocate']);
    expect(JSON.stringify(router.match('/error', ['error']))).toMatch('{\"situation\":\"errorReplace\",\"level\":68}');
    router.add('/errorLocate', ['errorLocate'], { situation: 'errorLocate', level: 58, });
    router.delete('/error', ['error']);
    router.add('/error', ['error'], { situation: 'error', level: 42 });
    expect(JSON.stringify(router.match('/error', ['error']))).toMatch('{\"situation\":\"error\",\"level\":42}');
    expect(JSON.stringify(router.match('/errorDeal', ['errorDeal']))).toMatch('{\"situation\":\"errorDeal\",\"level\":65}');
    expect(JSON.stringify(router.match('/errorLocate', ['errorLocate']))).toMatch('{\"situation\":\"errorLocate\",\"level\":58}');
    router.delete('/errorLocate', ['errorLocate']);
    expect(router.match('/errorLocate', ['errorLocate'])).toBe(undefined);
    expect(JSON.stringify(router.match('/error', ['error']))).toMatch('{\"situation\":\"error\",\"level\":42}');
    router.delete('/error', ['error']);
    expect(router.match('/error', ['error'])).toBe(undefined);
    router.add('/errorLocate', ['errorLocate'], { situation: 'errorLocate', level: 58, });
    router.add('/errorReason', ['errorReason'], { situation: 'errorReason', level:66, });
    router.delete('/errorThrow', ['errorThrow']);
    router.add('/errorThrow', ['errorThrow'], { situation: 'errorThrow', level:29, });
    router.add('/error', ['error'], { situation: 'error', level: 42 });
    expect(Array.isArray(router.root.hash[4][17][17][14][17].getBlend())).toBe(true);
  });

  test('Router can handle adding in truncated class.', () => {
    const router = new Router({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 7,
      logInterval: 5,
      interception: 5,
      hideError: true,
      debug: false,
    });
    router.add('/erro', ['erro'], { situation: 'erro', level: 52, });
    expect(JSON.stringify(router.match('/erro', ['erro']))).toMatch('{\"situation\":\"erro\",\"level\":52}');
    expect(JSON.stringify(router.match('/erro', ['erro']))).toMatch('{\"situation\":\"erro\",\"level\":52}');
    router.add('/er', ['er'], { situation: 'er', level: 68, });
    expect(JSON.stringify(router.match('/erro', ['erro']))).toMatch('{\"situation\":\"erro\",\"level\":52}');
    router.add('/err', ['ero'], { situation: 'err', level: 14, });
    expect(JSON.stringify(router.match('/erro', ['erro']))).toMatch('{\"situation\":\"erro\",\"level\":52}');
    expect(JSON.stringify(router.match('/erro', ['erro']))).toMatch('{\"situation\":\"erro\",\"level\":52}');
    router.add('/errorDeal', ['errorDeal'], { situation: 'errorDeal', level: 48, });
    router.add('/err', ['err'], { situation: 'err', level: 14, });
    expect(JSON.stringify(router.match('/erro', ['erro']))).toMatch('{\"situation\":\"erro\",\"level\":52}');
    expect(JSON.stringify(router.match('/err', ['err']))).toMatch('{\"situation\":\"err\",\"level\":14}');
    expect(JSON.stringify(router.match('/er', ['er']))).toMatch('{\"situation\":\"er\",\"level\":68}');
    expect(JSON.stringify(router.match('/errorDeal', ['errorDeal']))).toMatch('{\"situation\":\"errorDeal\",\"level\":48}');
  });
});
