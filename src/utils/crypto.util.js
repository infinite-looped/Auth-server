//Token hashing and random token generation
const crypto = require("crypto");
//token generation
const generateRandomToken = () => {
    return crypto.randomBytes(32).toString("hex");
};
// hashing token before storing in DB

const hashToken = (token) => {
    return crypto.createHash("sha256").update(token).digest("hex");
};

module.exports = {
    generateRandomToken,
    hashToken,
};