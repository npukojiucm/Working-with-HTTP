const { db } = require('../data/db');

module.exports.putchTickets = async function putchTickets(ctx, next) {
  const { method, id, state } = ctx.query;

  const ticket = db.find((tick) => tick.id === id);
  console.log(ticket);
  // ticket.status = !state;

  switch (method) {
    case 'ticketConfirm':

      ctx.status = 200;
      ctx.body = JSON.stringify(
        {
          statusCode: 200,
          status: 'Ok',
          tickets: [
            {
              id: ticket.id,
              status: ticket.status,
            },
          ],
        },
      );

      return;

    default:
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
  }
};
