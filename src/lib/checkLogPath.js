import fs from 'fs';

export default function  checkLogPath(logPath) {
  if (typeof logPath !== undefined) {
    if (!fs.existsSync(logPath)) {
      fs.mkdirSync(logPath, { recursive: true });
    }
  }
}
