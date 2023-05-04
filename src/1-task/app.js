/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const Koa = require('koa');
const cors = require('@koa/cors');
const Router = require('koa-router');

const { getTickets } = require('./controllers/getTickets');
const { putchTickets } = require('./controllers/putchTickets');

const app = new Koa();

app.use(cors());
app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const router = new Router();

router.get('/', getTickets);
router.patch('/', putchTickets);

app.use(router.routes());

module.exports = app;
