const throwErr = (err, res) =>
  res.status(err.status || 500).json({ message: err.message });

const resMessage = (res, status, message) =>
  res.status(status).json({ message: message });

module.exports = { throwErr, resMessage };
