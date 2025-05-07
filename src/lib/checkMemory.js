import os from 'os';
import appendToLog from '~/lib/appendToLog';

export default function checkMemory() {
  if (os.freemem() > 0) {
    return true;
  } else {
    appendToLog(
      getGTMDateString() + ' || ████ ❗❗❗❗ ⮕ [Memory]: Insuficient memory space. ████ ||\n'
    );
    return false;
  }
}
