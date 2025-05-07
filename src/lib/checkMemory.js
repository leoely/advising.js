import os from 'os';
import appendToLog from '~/lib/appendToLog';

export default function checkMemory() {
  if (os.freemem() <= 0) {
    appendToLog(
      getGTMDateString() + ' || ████ ❗❗❗❗ ⮕ [Memory]: Insuficient memory space. ████ ||\n'
    );
  }
}
