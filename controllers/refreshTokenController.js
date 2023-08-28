const User = require("../model/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async(req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(401); // unauthorized
  }
  console.log(cookies.jwt);
  const refreshToken = cookies.jwt;

    // check if refreshToken already exists
    const foundUser = await User.findOne({ refreshToken}).exec();

  if (!foundUser) {
    res.sendStatus(403); // Forbidden
  }

  // evaluate the refresh token
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username) {
      return res.sendStatus(403); // Forbidden
    }
    const roles = Object.values(foundUser.roles);
    // create new access token
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    res.json({ accessToken });
  });
};

module.exports = {
  handleRefreshToken,
};
