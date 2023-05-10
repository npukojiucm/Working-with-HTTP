/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const cors = require('@koa/cors');
const Router = require('koa-router');

const multer = require('@koa/multer');

const upload = multer();

const { getTickets } = require('./controllers/getTickets');
const { patchTickets } = require('./controllers/patchTickets');
const { deleteTicket } = require('./controllers/deleteTicket');
const { newTicket } = require('./controllers/newTicket');
const { saveFile } = require('./controllers/saveFile');

const app = new Koa();

app.use(cors());
app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const router = new Router({ prefix: '/api' });

router.get('/', getTickets);


router.patch('/', patchTickets);
router.delete('/', deleteTicket);

router.post('/', newTicket);



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
router.post('/deleteFile', async (ctx, next) => {
  const { file: fileName } = ctx.request.body;

  fs.unlinkSync(path.join(__dirname, 'public', 'img', fileName));

  ctx.status = 204;
});
router.get('/getImg', async (ctx, next) => {
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
