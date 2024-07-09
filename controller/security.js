const crypto = require("crypto");

const ENCRYPTION_KEY =
  "348475dcff21a19a35b05a6a3b95b59f76a2a5d0f42c96dbe7828a30de171a28";
const iv = "1c5bb18bcdc7d9f71d987dd71666b756";

function encryptData(data, iv) {
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY, "hex"),
    Buffer.from(iv, "hex")
  );
  let encryptedData = cipher.update(data, "utf8", "hex");
  encryptedData += cipher.final("hex");
  return encryptedData;
}

function decryptData(encryptedData, iv) {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY, "hex"),
    Buffer.from(iv, "hex")
  );
  let decryptedData = decipher.update(encryptedData, "hex", "utf8");
  decryptedData += decipher.final("utf8");
  return decryptedData;
}

exports.crypte = (req, res) => {
  const { data } = req.params;
  if (!data) {
    return res.status(400).send("Données manquantes");
  }
  const encryptedData = encryptData(data, iv);
  res.status(200).send(encryptedData);
};

exports.decrypt = (req, res) => {
  const { data } = req.params;
  if (!data) {
    return res.status(400).send("Données manquantes");
  }
  const decryptedData = decryptData(data, iv);
  res.status(200).send(decryptedData);
};

exports.encryptionKey = (req, res) => {
  res.status(200).send(crypto.randomBytes(32).toString("hex"));
};

exports.iv = (req, res) => {
  res.status(200).send({ iv: crypto.randomBytes(16).toString("hex") });
};
