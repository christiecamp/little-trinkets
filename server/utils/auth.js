const jwt = require('jsonwebtoken');

const secret = 'mysecretssshhhhhhh';
const expiration = '2h';

module.exports = {
  authMiddleware: function ({ req }) {
    //token may be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    //split token into an array and return actual token
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return req;
    }

    //try to verify and decode token
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
    }

    return req;
  },
  //function for our authenticated routes
  signToken: function ({ firstName, email, _id }) {
    //create token
    const payload = { firstName, email, _id };
    //return token
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
