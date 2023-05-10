const { v4: uuid } = require('uuid');
const { db } = require('../data/db');
const { newDate } = require('../mappers/newDate');

module.exports.newTicket = async function newTicket(ctx, next) {
  const { method } = ctx.query;

  if (method === 'addTicket') {
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
    ctx.body = JSON.stringify(
      {
        statusCode: 200,
        status: 'Ok',
        ticket,
      },
    );

    return;
  }

  if (method === 'downloadFiles') {
    next();
  }

  // ctx.status = 500;
  // ctx.body = { error: 'Internal server error' };
};
