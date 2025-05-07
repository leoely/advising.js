import fs from 'fs';
import path from 'path';
import getDateString from '~/lib/getDateString';

export default function appendToLog(logPath, content) {
  const dateString = getDateString();
  fs.appendFileSync(
    path.join(logPath, dateString), content
  );
}
