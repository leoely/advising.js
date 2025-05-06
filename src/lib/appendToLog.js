function appendToLog(logContent) {
  fs.appendFileSync(path.join(logPath, dateString), logContent);
}
