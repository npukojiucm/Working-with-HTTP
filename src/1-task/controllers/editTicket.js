const { db } = require('../data/db');

module.exports.editTicket = async function editTicket(ctx) {
  const { id } = ctx.query;
  const { name, description } = ctx.request.body;

  const ticket = db.find((tick) => tick.id === id);
  ticket.name = name;
  ticket.description = description;

  ctx.status = 204;
};
