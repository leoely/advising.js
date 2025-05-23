import { describe, expect, test, } from '@jest/globals';
import Router from '~/class/Router';

describe('[Class] Router: Time complexity test cases;', () => {
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
    router.add('/male/john', { name: 'john', age: 22, });
    router.add('/male/robert', { name: 'robert', age: 18, });
    router.add('/male/david', { name: 'david', age: 40, });
    expect(JSON.stringify(router.match('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(router.root.count).toBe(17);
    expect(router.root.find('male').count).toBe(17);
    expect(router.root.find('male').find('john').count).toBe(5);
    router.delete('/male/david');
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
    router.add('/male/john', { name: 'john', age: 22, });
    router.add('/male/robert', { name: 'robert', age: 18, });
    router.add('/male/david', { name: 'david', age: 40, });
    expect(JSON.stringify(router.match('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    router.add('/male', ['john', 'robert', 'david']);
    expect(JSON.stringify(router.match('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male'))).toMatch('[\"john\",\"robert\",\"david\"]');
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
    router.add('/male', ['john', 'robert', 'david']);
    router.add('/male/john', { name: 'john', age: 22, });
    router.add('/male/robert', { name: 'robert', age: 18, });
    router.add('/male/david', { name: 'david', age: 40, });
    expect(JSON.stringify(router.match('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/male'))).toMatch('[\"john\",\"robert\",\"david\"]');
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
    router.add('/male/john', { name: 'john', age: 22, });
    router.add('/male/robert', { name: 'robert', age: 18, });
    router.add('/male/david', { name: 'david', age: 40, });
    router.add('/male', ['john', 'robert', 'david']);
    expect(JSON.stringify(router.match('/male'))).toMatch('[\"john\",\"robert\",\"david\"]');
    expect(JSON.stringify(router.match('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
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
    router.add('/male/programmer/john', { name: 'john', age: 22, });
    router.add('/male/programmer/robert', { name: 'robert', age: 18, });
    router.add('/male/programmer/david', { name: 'david', age: 40, });
    router.add('/male/programmer', ['john', 'robert', 'david']);
    expect(JSON.stringify(router.match('/male/programmer'))).toMatch('[\"john\",\"robert\",\"david\"]');
    expect(JSON.stringify(router.match('/male/programmer/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/programmer/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/programmer/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
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
    router.add('/country/unitedKingdom/london', { id: 1, name: 'london',});
    router.add('/country/unitedKingdom/england', { id: 2, name: 'england',});
    router.add('/country/unitedKingdom/liverpool', { id: 3, name: 'liveprool',  });
    router.add('/country/unitedKingdom/belfast', { id: 4, name: 'belfast', });
    router.add('/country', ['united kingdom']);
    expect(JSON.stringify(router.match('/country/unitedKingdom/london'))).toMatch('{\"id\":1,\"name\":\"london\"}');
    expect(JSON.stringify(router.match('/country/unitedKingdom/england'))).toMatch('{\"id\":2,\"name\":\"england\"}');
    expect(JSON.stringify(router.match('/country/unitedKingdom/liverpool'))).toMatch('{\"id\":3,\"name\":\"liveprool\"}');
    expect(JSON.stringify(router.match('/country/unitedKingdom/belfast'))).toMatch('{\"id\":4,\"name\":\"belfast\"}');
    expect(JSON.stringify(router.match('/country'))).toMatch('[\"united kingdom\"]');
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
    router.add('/male/john', { name: 'john', age: 22, });
    router.add('/male/robert', { name: 'robert', age: 18, });
    router.add('/male/david', { name: 'david', age: 40, });
    router.add('/citys/1', ['new york', 'london', 'tokyo']);
    router.add('/citys/2', ['pairs', 'beijing', 'los angeles']);
    expect(JSON.stringify(router.match('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    expect(JSON.stringify(router.match('/citys/1'))).toMatch('[\"new york\",\"london\",\"tokyo\"]');
    expect(JSON.stringify(router.match('/citys/2'))).toMatch('[\"pairs\",\"beijing\",\"los angeles\"]');
    expect(JSON.stringify(router.match('/citys/1'))).toMatch('[\"new york\",\"london\",\"tokyo\"]');
    expect(JSON.stringify(router.match('/citys/2'))).toMatch('[\"pairs\",\"beijing\",\"los angeles\"]');
    expect(JSON.stringify(router.match('/citys/1'))).toMatch('[\"new york\",\"london\",\"tokyo\"]');
    expect(JSON.stringify(router.match('/citys/2'))).toMatch('[\"pairs\",\"beijing\",\"los angeles\"]');
    expect(JSON.stringify(router.match('/citys/1'))).toMatch('[\"new york\",\"london\",\"tokyo\"]');
    expect(JSON.stringify(router.match('/citys/2'))).toMatch('[\"pairs\",\"beijing\",\"los angeles\"]');
    expect(JSON.stringify(router.match('/citys/1'))).toMatch('[\"new york\",\"london\",\"tokyo\"]');
    expect(JSON.stringify(router.match('/citys/2'))).toMatch('[\"pairs\",\"beijing\",\"los angeles\"]');
    expect(JSON.stringify(router.match('/citys/1'))).toMatch('[\"new york\",\"london\",\"tokyo\"]');
    expect(JSON.stringify(router.match('/citys/2'))).toMatch('[\"pairs\",\"beijing\",\"los angeles\"]');
    expect(JSON.stringify(router.match('/citys/1'))).toMatch('[\"new york\",\"london\",\"tokyo\"]');
    expect(JSON.stringify(router.match('/citys/2'))).toMatch('[\"pairs\",\"beijing\",\"los angeles\"]');
    expect(JSON.stringify(router.match('/citys/1'))).toMatch('[\"new york\",\"london\",\"tokyo\"]');
    expect(JSON.stringify(router.match('/citys/2'))).toMatch('[\"pairs\",\"beijing\",\"los angeles\"]');
    expect(JSON.stringify(router.match('/citys/1'))).toMatch('[\"new york\",\"london\",\"tokyo\"]');
    expect(JSON.stringify(router.match('/citys/2'))).toMatch('[\"pairs\",\"beijing\",\"los angeles\"]');
  });
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
    router.add('/male/john', { name: 'john', age: 22, });
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
    router.add('/male/programmer/john', { name: 'john', age: 22, });
    router.add('/male/hardwareEngineer/robert', { name: 'robert', age: 18, });
    expect(JSON.stringify(router.match('/male/programmer/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/programmer/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(typeof router.root.find('male').find('programmer').hash).toMatch('object');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
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
    router.add('/male/programmer/john', { name: 'john', age: 22, });
    router.add('/male/hardwareEngineer/robert', { name: 'robert', age: 18, });
    expect(JSON.stringify(router.match('/male/programmer/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/programmer/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(Array.isArray(router.root.find('male').find('programmer').hash)).toBe(true);
    expect(JSON.stringify(router.match('/male/hardwareEngineer/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
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
      debug: false,
    });
    router.add('/male/john', { name: 'john', age: 22, });
    router.add('/male/robert', { name: 'robert', age: 18, });
    router.add('/male/david', { name: 'david', age: 40, });
    expect(JSON.stringify(router.match('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    router.delete('/male/john');
    expect(router.root.count).toBe(2);
    router.delete('/male/robert');
    expect(router.root.count).toBe(1);
    expect(router.root.find('male').count).toBe(1);
    expect(() => router.match('/male/john')).toThrow('[Error] Router matching the url does not exist.');
    expect(() => router.match('/male/robert')).toThrow('[Error] Router matching the url does not exist.');
    router.delete('/male/david');
    expect(() => router.match('/male/david')).toThrow('[Error] Cluster hash is empty,please add a route first.');
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
      debug: false,
    });
    router.add('/male/john', { name: 'john', age: 22, });
    router.add('/male/robert', { name: 'robert', age: 18, });
    router.add('/male/david', { name: 'david', age: 40, });
    expect(JSON.stringify(router.match('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/david'))).toMatch('{\"name\":\"david\",\"age\":40}');
    router.deleteAll(['/male/john', '/male/robert', '/male/david']);
    expect(() => router.match('/male/john')).toThrow('[Error] Cluster hash is empty,please add a route first.');
    expect(() => router.match('/male/robert')).toThrow('[Error] Cluster hash is empty,please add a route first.');
    expect(() => router.match('/male/david')).toThrow('[Error] Cluster hash is empty,please add a route first.');
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
    router.add('/world/male', ['john', 'robert', 'david']);
    expect(JSON.stringify(router.match('/world/male'))).toMatch('[\"john\",\"robert\",\"david\"]');
    router.update('/world/male', ['jason', 'kevin', 'eric']);
    expect(router.root.count).toBe(0);
    expect(JSON.stringify(router.match('/world/male'))).toMatch('[\"jason\",\"kevin\",\"eric\"]');
    expect(() => router.update('/world/female', ['amani', 'tiffany', 'carolyn'])).toThrow('[Error] Router matching the url does not exist.');
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
    router.add('/male/john', { name: 'john', age: 22, });
    router.add('/male/robert', { name: 'robert', age: 18, });
    expect(JSON.stringify(router.match('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/robert'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    router.swap('/male/john', '/male/robert');
    expect(router.root.find('male').find('john').count).toBe(1);
    expect(router.root.find('male').find('robert').count).toBe(2);
    expect(router.root.find('male').count).toBe(3);
    expect(JSON.stringify(router.match('/male/john'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    expect(JSON.stringify(router.match('/male/robert'))).toMatch('{\"name\":\"john\",\"age\":22}');
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
    router.add('/male/john', { name: 'robert', age: 18, });
    expect(JSON.stringify(router.match('/male/john'))).toMatch('{\"name\":\"robert\",\"age\":18}');
    router.fix('/male/john', { name: 'john', age: 22, });
    expect(JSON.stringify(router.match('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
    expect(JSON.stringify(router.match('/male/john'))).toMatch('{\"name\":\"john\",\"age\":22}');
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
      debug: false,
    });
    router.add('/long/long', { type: 'long', });
    expect(JSON.stringify(router.match('/long/long'))).toMatch('{\"type\":\"long\"}');
    expect(JSON.stringify(router.match('/long/long'))).toMatch('{\"type\":\"long\"}');
    expect(JSON.stringify(router.match('/long/long'))).toMatch('{\"type\":\"long\"}');
    expect(JSON.stringify(router.match('/long/long'))).toMatch('{\"type\":\"long\"}');
    expect(JSON.stringify(router.match('/long/long'))).toMatch('{\"type\":\"long\"}');
    router.delete('/long/long');
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
      debug: false,
    });
    router.add('/book/Στοιχεῖα', { name: 'Στοιχεῖα', });
    router.add('/book/Das Kapital: Kritik der politischen Ökonomie', { name: 'Das Kapital: Kritik der politischen Ökonomie', });
    expect(JSON.stringify(router.match('/book/Das Kapital: Kritik der politischen Ökonomie'))).toMatch('{\"name\":\"Das Kapital: Kritik der politischen Ökonomie\"}');
    expect(JSON.stringify(router.match('/book/Στοιχεῖα'))).toMatch('{\"name\":\"Στοιχεῖα\"}');
    expect(router.root.find('book').status).toBe(7);
    router.delete('/book/Das Kapital: Kritik der politischen Ökonomie');
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
    router.add('/chaos/letter', { type: 'letters', });
    expect(() => router.add('/chaos/1', { type: 'numbers', })).toThrow('[Error] Cluster is pure numeric type but the newly added is a pure letters.');
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
    router.add('/chaos/1', { type: 'numbers', });
    expect(() => router.add('/chaos/letter', { type: 'letters', })).toThrow('[Error] Cluster is plain text type but the newly added type is a pure number.');
  });

  test('Router must be a string.', () => {
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
    expect(() => router.add(11111, { type: 'number', })).toThrow('[Error] Path type must be a string.');
    expect(() => router.add({}, { type: 'object', })).toThrow('[Error] Path type must be a string.');
    expect(() => router.add([], { type: 'array', })).toThrow('[Error] Path type must be a string.');
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
    router.add('/male/john', { name: 'john', age: 22, });
    router.match('/male/john');
    router.match('/male/john');
    router.match('/male/john');
    router.match('/male/john');
    expect(() => router.match('/male/john')).toThrow('[Error] LogLevel must in section [0, 7].');
  });

  test('Router root path cannot be manipulated.', () => {
    const router = new Router({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 4,
      logInterval: 5,
      interception: undefined,
      debug: false,
    });
    expect(() => router.add('/', { path: '/', })).toThrow('[Error] Unable to operate the root path.');
    expect(() => router.match('/')).toThrow('[Error] Unable to operate the root path.');
  });

  test('Router url should be parsed correctly.', () => {
    const router = new Router({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 4,
      logInterval: 5,
      interception: undefined,
      debug: false,
    });
    expect(() => router.add('fsadfasdfas', { type: 'letters', })).toThrow('[Error] Path should start with a slash.');
    expect(() => router.match('fasdfdsa')).toThrow('[Error] Path should start with a slash.');
  });

  test('Router content operation should be a reasonable value.', () => {
    const router = new Router({
      threshold: 0.5,
      number: 1,
      bond: 5,
      dutyCycle: 5,
      logLevel: 4,
      logInterval: 5,
      interception: undefined,
      debug: false,
    });
    expect(() => router.add('/male', undefined)).toThrow('[Error] Value should be reasonable value.');
    expect(() => router.add('/male', null)).toThrow('[Error] Value should be reasonable value.');
    expect(() => router.add('/male', NaN)).toThrow('[Error] Value should be reasonable value.');
  });
});
