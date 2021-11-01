const crypto = require("crypto");

const algorithm = 'aes-256-cbc';

exports.Hash = function (text) {
    return crypto.createHash('sha256').update(text).digest("hex").substring(0,32);
};

exports.Encrypt = function(plainText, password){
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, password, iv);
    let encrypted = cipher.update(plainText, "utf-8", "hex");
    encrypted += cipher.final("hex");

    return iv.toString("hex") + ":" + encrypted.toString("hex");
}

exports.Decrypt = function(cipherText, password){
    const cipherParts = cipherText.split(":");
    const iv = Buffer.from(cipherParts.shift(), "hex");
    cipherText = Buffer.from(cipherParts.join(":"), "hex");
    const decipher = crypto.createDecipheriv(algorithm, password, iv);

    const decrypted = decipher.update(cipherText);

    return Buffer.concat([decrypted, decipher.final()]).toString();
}