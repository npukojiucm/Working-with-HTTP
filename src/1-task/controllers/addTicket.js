const { v4: uuid } = require('uuid');
const { db } = require('../data/db');
const { newDate } = require('../mappers/newDate');

module.exports.addTicket = async function addTicket(ctx) {
  const { name, description } = ctx.request.body;

  const ticket = {
    id: uuid(),
    name,
    description,
    status: false,
    created: newDate(),
  };

  db.push(ticket);

  ctx.status = 200;
  ctx.body = {
    ticket,
  };
};
