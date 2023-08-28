
const User = require("../model/User");

const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fsPromises = require("fs").promises;
const path = require("path");

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ msg: "Username and password are required" });
  }


  // check if username already exists
  const foundUser = await User.findOne({ username: username }).exec();
  console.log(foundUser);
  if (!foundUser) {
    res.sendStatus(401); // unauthorized
  }
  try {
    const match = await bycrypt.compare(
      String(password),
      String(foundUser.password)
    );
    if (match) {
      // create JWTs
      const roles = Object.values(foundUser.roles);
      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
            roles: roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "180s" }
      );
      const refreshToken = jwt.sign(
        {
          username: foundUser.username,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
       
      foundUser.refreshToken = refreshToken;
      const result = await foundUser.save();
      console.log(result);      
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        // secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.json({ accessToken });
    } else {
      res.sendStatus(401); // unauthorized
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  handleLogin,
};
