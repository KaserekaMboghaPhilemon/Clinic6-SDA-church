export default function logger(req, res, next) {
  const start = process.hrtime.bigint();
  const { method, originalUrl } = req;

  res.on('finish', () => {
    const durationNs = Number(process.hrtime.bigint() - start);
    const durationMs = (durationNs / 1e6).toFixed(2);
    const status = res.statusCode;
    console.log(`[${new Date().toISOString()}] ${method} ${originalUrl} ${status} - ${durationMs} ms`);
  });

  next();
}
