import fs from 'fs';

export default function  checkLogPath(logPath) {
  if (logPath !== undefined) {
    if (!fs.existsSync(logPath)) {
      fs.mkdirSync(logPath, { recursive: true });
    }
  }
}
