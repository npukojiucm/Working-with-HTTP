module.exports.saveFile = async function saveFile(ctx, next) {
  // const { method } = ctx.query;

  console.log('ctx.request.files', ctx.request.files);
  console.log('ctx.files', ctx.files);
  console.log('ctx.request.body', ctx.request.body);
  ctx.body = 'done';
};
