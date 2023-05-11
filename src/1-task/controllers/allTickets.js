const { db } = require('../data/db');

module.exports.getTickets = async function getTickets(ctx, next) {
  const { method } = ctx.query;

  switch (method) {
    case 'allTickets':

      ctx.status = 200;
      ctx.body = JSON.stringify(
        {
          status: 200,
          tickets: db,
        },
      );

      return;

    case 'ticketById':
      const { id } = ctx.query;

      const ticket = db.find((elm) => elm.id === id);

      ctx.status = 200;
      ctx.body = JSON.stringify(
        {
          statusCode: 200,
          status: 'Ok',
          tickets: ticket,
        },
      );

      return;
    default:
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
  }
};
