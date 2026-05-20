import os from 'os';
import {
  logOutOfMemory,
} from 'manner.js/server';
import Outputable from '~/class/Outputable';

export default function checkMemory(logPath, value, outputable, temporaryMemorySwitch, callback) {
  let ans = true;
  let freemem = os.freemem();
  if (temporaryMemorySwitch === true) {
    freemem = 0;
  }
  if (value === undefined) {
    if (freemem <= 0) {
      ans = false;
      logOutOfMemory(logPath, freemem);
      if (typeof callback === 'function') {
        callback();
      }
      if (outputable instanceof Outputable) {
        const node = outputable;
        const {
          options: {
            debug,
          },
        } = node;
        if (debug === true) {
          node.debugDetail('(+) bold; red: * !! (+) blue; bold: * Memory (+) bold; dim: * out of memory. &');
        }
      }
    }
  } else {
    if (typeof value === 'number') {
      if (freemem < value) {
        ans = false;
        logOutOfMemory(logPath, freemem);
        if (typeof callback === 'function') {
          callback();
        }
        if (outputable instanceof Outputable) {
          const node = outputable;
          const {
            options: {
              debug,
            },
          } = node;
          if (debug === true) {
            node.debugDetail('(+) bold; red: * !! (+) blue; bold: * Memory (+) bold; dim: * out of memory. &');
          }
        }
      }
    } else {
      throw new Error('[Error] To ensure sufficient memory,the value should be a numeric type.');
    }
  }
  return ans;
}
