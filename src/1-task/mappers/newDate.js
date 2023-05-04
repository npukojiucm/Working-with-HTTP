module.exports.newDate = function newDate() {
  const date = new Date();
  const month = {
    0: '01',
    1: '02',
    2: '03',
    3: '04',
    4: '05',
    5: '06',
    6: '07',
    7: '08',
    8: '09',
    9: '10',
    10: '11',
    11: '12',
  };

  return `
    ${date.getDate()}.${month[date.getMonth()]}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}
  `
}
