const { db } = require('../data/db');

module.exports.statusTicket = async function statusTicket(ctx) {
  const { id, status } = ctx.request.body;

  const ticket = db.find((tick) => tick.id === id);
  ticket.status = !status;

  ctx.status = 204;
};
