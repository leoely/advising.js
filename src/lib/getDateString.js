export default function getDateString() {
  const date = new Date();
  return [date.getFullYear(), date.getMonth(), date.getDate()].join('-');
}
