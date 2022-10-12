const jwt = require("jsonwebtoken");
const secret = require("../config/env").jwt.key;

exports.encode = (id) => {
  let token = jwt.sign(
    {
      id: id,
      iat: new Date().getTime(),
    },
    secret
  );
  return token;
};

exports.decode = (token) => {
  let id;
  try {
    id = jwt.verify(token, secret);
    id = {
      flag: true,
      id: id.id,
    };
  } catch (error) {
    id = {
      flag: false,
    };
  }

  return id;
};

exports.encodeWithExpiry = (id) => {
  const token = jwt.sign(
    {
      id,
      iat: new Date().getTime(),
    },
    secret,
    { expiresIn: "1h" }
  );
  return token;
};
