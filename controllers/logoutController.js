const User = require("../model/User");

const handleUserLogOut = async (req, res) => {
  // On client side, also delete the accessToken.

  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204); // success, no content
  }
  const refreshToken = cookies.jwt;
  // Is refreshToken in the database?
  const foundUser = await User.findOne({ refreshToken }).exec();

  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }

  // remove the refresh token from the database

  foundUser.refreshToken = "";
  const result = await foundUser.save();
  console.log(`${result} : "User has been logged out"`);
  
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.sendStatus(204);
};

module.exports = {
  handleUserLogOut,
};
