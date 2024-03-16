const bcrypt = require("bcrypt");

const hashedPassword = async (password) => {
  const passwordHash = await bcrypt.hash(password, 10);

  return passwordHash;
};

module.exports = hashedPassword;
