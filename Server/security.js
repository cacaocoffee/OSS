const crypto = require("crypto");

const algorithmFor2Way = 'aes-256-cbc';
const algorithmForHash = 'sha256';

exports.Hash = function (text) {
    return crypto.createHash(algorithmForHash).update(text).digest("hex");
};
exports.HashFor2Way = (text){
    return this.Hash(text).substring(0,32);
}
exports.Encrypt = function(plainText, password){
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithmFor2Way, password, iv);
    let encrypted = cipher.update(plainText, "utf-8", "hex");
    encrypted += cipher.final("hex");

    return iv.toString("hex") + ":" + encrypted.toString("hex");
}

exports.Decrypt = function(cipherText, password){
    const cipherParts = cipherText.split(":");
    const iv = Buffer.from(cipherParts.shift(), "hex");
    cipherText = Buffer.from(cipherParts.join(":"), "hex");
    const decipher = crypto.createDecipheriv(algorithmFor2Way, password, iv);

    const decrypted = decipher.update(cipherText);

    return Buffer.concat([decrypted, decipher.final()]).toString();
}