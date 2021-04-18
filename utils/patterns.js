const throwErr = (err, res) =>
  res.status(err.status || 500).send({ message: err.message });

const resMessage = (res, status, message) =>
  res.status(status).send({ message: message });

const resSend = (res, status, data) => res.status(status).send(data);

export { throwErr, resMessage, resSend };
