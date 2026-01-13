//for Password hashing and comparing hash password
const bcrypt = require('bcrypt');

const saltRounds = 10;

const hashPassword = async(password) => {
    return bcrypt.hash(password, saltRounds);
};

//comparing the plain password

const comparePassword = async(password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};

module.exports = {
    hashPassword,
    comparePassword,
};
