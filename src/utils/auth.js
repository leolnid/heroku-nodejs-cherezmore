const jwt = require('jsonwebtoken');

const checkToken = (req, res, next) => {
  if (!req.headers.authorization)
    return res.status(401).json({ error: { message: 'Auth Failed.' } });

  let token = req.headers.authorization.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, {}, (err, decoded) => {
    if (err)
      return res.status(401).json({ error: { message: 'Auth Failed.' } });

    req.userData = decoded;
    return next();
  });
};

const hasPermission = (permission) => (req, res, next) => {
  if (!req.userData)
    return res.status(401).json({ error: { message: 'Auth Failed.' } });

  if (req.userData.permission < permission)
    return res.status(403).json({ error: { message: 'Acsess denied.' } });

  return next();
};

module.exports = { checkToken, hasPermission };
