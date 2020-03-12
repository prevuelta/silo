function padWithZero(no, zeros = 2) {
  return (new Array(zeros).fill("0").join("") + no).slice(-zeros);
}
export function formatDate(date) {
  return `${date.getFullYear()}-${padWithZero(
    date.getMonth() + 1
  )}-${padWithZero(date.getDate())}`;
}

export function formatDateTime(date) {
  return `${formatDate(date)}T${padWithZero(date.getHours())}:${padWithZero(
    date.getMinutes()
  )}:${padWithZero(date.getSeconds())}.${padWithZero(
    date.getMilliseconds(),
    3
  )}Z`;
}
