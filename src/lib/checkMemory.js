import os from 'os';
import appendToLog from '~/lib/appendToLog';

export default function checkMemory(logPath, value) {
  let ans = true;
  const freemem = os.freemem();
  if (value === undefined) {
    if (freemem <= 0) {
      ans = false;
      appendToLog(
        logPath,
        ' || ████ ❗❗❗❗FREEMEN:' + freemem + ' & ████ REASON: Out fo memory ████ ||\n'
      );
    }
  } else {
    if (typeof value === 'number') {
      if (freemem < value) {
        ans = false;
        appendToLog(
          logPath,
          ' || ████ ❗❗❗❗FREEMEN:' + freemem + ' & ████ REASON: Out fo memory ████ ||\n'
        );
      }
    } else {
      throw new Error('[Error] To ensure sufficient memory,the value should be a numeric type.');
    }
  }
  return ans;
}
