const REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function checkEmail(email) {
  const isEmailValid = REGEX.test(email);
  return isEmailValid;
}

export default checkEmail;
