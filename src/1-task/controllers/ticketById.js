const { db } = require('../data/db');

module.exports.ticketById = async function ticketById(ctx) {
  const { id } = ctx.query;

  const ticket = db.find((elm) => elm.id === id);

  ctx.status = 200;
  ctx.body = {
    ticket,
  };
};
