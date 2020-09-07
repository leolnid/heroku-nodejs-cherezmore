exports.validateEmailAndPassword = (params) =>
  this.validateEmail(params) || this.validatePassword(params);

exports.validateEmail = (params) =>
  !this.isValidEmail(params.email) ? { message: 'Invalid email' } : null;

exports.validatePassword = (params) =>
  !this.isValidPassword(params.password)
    ? { message: 'Invalid password' }
    : null;

exports.validateToken = (params) =>
  !this.isValidPassword(params.token) ? { message: 'Invalid token' } : null;

exports.isValidEmail = (email) => {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

exports.isValidPassword = (password) => {
  let re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
  return re.test(password);
};

exports.isValidID = (id) => {
  let re = /^[1-9][0-9]{0,}$/;
  return re.test(id);
};

exports.isValidToken = (token) => {
  let re = /^[0-9a-f]{20,100}$/;
  return re.test(token);
};
