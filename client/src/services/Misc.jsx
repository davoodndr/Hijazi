export function isEmailValid(email) {
  // Regular expression for basic email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}