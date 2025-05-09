export default function checkContent(content) {
  if (content === undefined || content === null || Number.isNaN(content)) {
    throw Error('[Error] Value should be reasonable value.');
  }
}

