const throwErr = (err, res) =>
  res.status(err.status || 500).json({ message: err.message });

const resMessage = (res, status, message) =>
  res.status(status).send({ message: message });

export { throwErr, resMessage };
