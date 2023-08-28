const User = require("../model/User");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ msg: "Username and password are required" });
  }

  // check if username already exists
  const duplicate = await User.findOne({ username: username }).exec();
  console.log(duplicate);
  if (duplicate) {
    return res.status(409).json({ msg: "Username already exists" }); // conflict
  }
  try {
    // encyrpt the password
    const hashedPassword = await bcrypt.hash(String(password), 10);

    // store the new user in the database
    // create and store the user all at once using Mongoose
    const result = await User.create({
      username: username,
      password: hashedPassword,
    });
    console.log(result);
    res.status(201).json({ msg: `New user created` });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  handleNewUser,
};
