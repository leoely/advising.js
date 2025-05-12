import os from 'os';
import appendToLog from '~/lib/appendToLog';

export default function checkMemory(logPath, value, outputable) {
  let ans = true;
  const freemem = os.freemem();
  if (value === undefined) {
    if (freemem <= 0) {
      ans = false;
      appendToLog(
        logPath,
        ' || ████ ❗❗❗❗FREEMEN:' + freemem + ' & ████ REASON: Out fo memory ████ ||\n'
      );
      if (outputable instanceof Node) {
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
        appendToLog(
          logPath,
          ' || ████ ❗❗❗❗FREEMEN:' + freemem + ' & ████ REASON: Out fo memory ████ ||\n'
        );
        if (outputable instanceof Node) {
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
