const { db } = require('../data/db');

module.exports.allTickets = async function allTickets(ctx) {
  ctx.status = 200;
  ctx.body = {
    tickets: db,
  };
};
