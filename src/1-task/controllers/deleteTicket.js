const { db } = require('../data/db');

module.exports.deleteTicket = async function deleteTicket(ctx, next) {
  const { method, id } = ctx.query;

  switch (method) {
    case 'deleteTicket':
      const ticketIndex = db.findIndex((tick) => tick.id === id);
      db.splice(ticketIndex, 1);

      ctx.status = 200;
      ctx.body = JSON.stringify(
        {
          status: {
            code: 200,
            message: 'Ok',
          },
          tickets: [
            {
              id,
              status: 'Successfully deleted',
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
