const { v4: uuid } = require('uuid');
const { newDate } = require('../mappers/newDate');

module.exports.db = [
  {
    id: uuid(),
    name: 'Починить принтер',
    description: 'Зажевыет бумагу, оставляет следы краски',
    status: true,
    created: newDate(),
  },
  {
    id: uuid(),
    name: 'Починить принтер',
    description: 'Зажевыет бумагу, оставляет следы краски',
    status: false,
    created: newDate(),
  },
  {
    id: uuid(),
    name: 'Починить принтер',
    description: 'Зажевыет бумагу, оставляет следы краски',
    status: false,
    created: newDate(),
  },
];
