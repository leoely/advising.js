import { describe, expect, test, } from '@jest/globals';
import getDateString from '~/lib/getDateString';

describe('[Function] getDateString', () => {
  test('getDateString output string formate should correct.', () => {
    const dateString = getDateString(new Date(52434234423));
    expect(dateString).toMatch('1971-7-31');
  });
});
