import fs from 'fs';
import path from 'path';
import getDateString from '~/lib/getDateString';
import getGTMNowString from '~/lib/getGTMNowString';

export default function appendToLog(logPath, content) {
  const dateString = getDateString();
  fs.appendFileSync(
    path.join(logPath, dateString), getGTMNowString() + content
  );
}
