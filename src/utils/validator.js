exports.validateEmailAndPassword = (body) =>
  this.validateEmail(body) || this.validatePassword(body);

exports.validateEmail = (body) =>
  !this.isValidEmail(body.email) ? { message: 'Invalid email' } : null;

exports.validatePassword = (body) =>
  !this.isValidPassword(body.password) ? { message: 'Invalid password' } : null;

exports.isValidEmail = (email) => {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

exports.isValidPassword = (password) => {
  let re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
  return re.test(password);
};

exports.isValidID = (ID) => {
  let re = /^[1-9][0-9]{0,}/;
  return re.test(ID);
};
