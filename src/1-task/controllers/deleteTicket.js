const { db } = require('../data/db');

module.exports.deleteTicket = async function deleteTicket(ctx) {
  const { id } = ctx.query;

  const ticketIndex = db.findIndex((tick) => tick.id === id);
  db.splice(ticketIndex, 1);

  ctx.status = 204;
};
