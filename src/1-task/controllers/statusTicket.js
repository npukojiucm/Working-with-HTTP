const { db } = require('../data/db');

module.exports.patchTickets = async function patchTickets(ctx, next) {
  const { method, id } = ctx.query;

  const ticket = db.find((tick) => tick.id === id);
  // ticket['status'] = !state;

  if (method === 'editTicket') {
    const body = ctx.request.body;
    console.log(body);
    const { name, description } = body;

    ticket.name = name;
    ticket.description = description;

    ctx.status = 200;
    ctx.body = JSON.stringify(
      {
        statusCode: 200,
        status: 'Ok',
        tickets: [
          {
            id: ticket.id,
            name: ticket.name,
            description: ticket.description,
          },
        ],
      },
    );

    return;
  }

  let { state } = ctx.query;

  if (state === 'false') state = false;



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
              status: ticket['status'],
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
