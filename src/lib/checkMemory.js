import os from 'os';
import appendToLog from '~/lib/appendToLog';

export default function checkMemory() {
  const freemem = os.freemem();
  if (freemem <= 0) {
    appendToLog(
      ' || ████ ❗❗❗❗FREEMEN:' + freemen + ' & ████ REASON: Out fo memory ████ ||\n'
    );
  }
}
