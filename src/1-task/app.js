/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const cors = require('@koa/cors');
const Router = require('koa-router');

const multer = require('@koa/multer');

const upload = multer();

const { allTickets } = require('./controllers/allTickets');
const { ticketById } = require('./controllers/ticketById');
const { addTicket } = require('./controllers/addTicket');
const { statusTicket } = require('./controllers/statusTicket');
const { deleteTicket } = require('./controllers/deleteTicket');
const { editTicket } = require('./controllers/editTicket');

const app = new Koa();

app.use(cors());
app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const router = new Router({ prefix: '/api' });

router.get('/allTickets', allTickets);
router.get('/ticketById', ticketById);
router.post('/addTicket', upload.none(), addTicket);
router.patch('/statusTicket', statusTicket);
router.patch('/editTicket', upload.none(), editTicket);

router.delete('/deleteTicket', deleteTicket);

// Задание №3
router.post('/uploadFiles', upload.any(), async (ctx) => {
  const write = async (files) => {
    for (const file of files) {
      const writeableStream = fs.createWriteStream(
        path.join('public', 'img', file.fieldname),
      );
      writeableStream.end(file.buffer);
    }
  };
  await write(ctx.files);
  ctx.status = 204;
});
router.post('/deleteFile', async (ctx) => {
  const { file: fileName } = ctx.request.body;

  fs.unlinkSync(path.join(__dirname, 'public', 'img', fileName));

  ctx.status = 204;
});
router.get('/getImg', async (ctx) => {
  const server = 'http://localhost:3000/img/';
  const response = [];

  const files = fs.readdirSync('public/img/');
  files.forEach((file) => {
    const objFile = {
      name: file,
      src: server + file,
    };
    response.push(objFile);
  });

  ctx.status = 200;
  ctx.body = {
    files: response,
  };
});

app.use(router.routes());

module.exports = app;
