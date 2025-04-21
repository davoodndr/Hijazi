
export const responseMessage = (status, success, message = "", data ) => {

  return {
    status,
    success,
    message,
    data
  }
}