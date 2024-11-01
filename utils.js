function logout(res) {
  res.cookie("token", null, {
    path: "/",
    httpOnly: true,
    secure: true,
    maxAge: -20,
    sameSite: "None",
  });
  return res;
}

function getLocaleDate(offset) {
  const date = new Date();
  const localDate = new Date(date.getTime()-offset*60000).toISOString().split("T")[0];
  return localDate;
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