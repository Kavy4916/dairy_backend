function logout(res) {
  res.cookie("token", null, {
    path: "/",
    httpOnly: true,
    secure: false,
    maxAge: -20,
    sameSite: "strict",
  });
  return res;
}

function getLocaleDate(offsetMinutes) {
  const date = new Date();
  let today = new Date(date-offsetMinutes*60000).toISOString().split("T")[0];
  return today;
}

function handleUnknownError(error, res){
  console.log(error);
  res = logout(res);
  res.status(200).send({
    code: 201,
    path: "/login",
    message: "Unknown error occured, try later!",
  });
}

function handleFetalError(res){
  res = logout(res);
    res
      .status(200)
      .send({ code: 201, message: "Bad Request!", path: "/login" });
}
  
export {logout, getLocaleDate, handleUnknownError, handleFetalError};