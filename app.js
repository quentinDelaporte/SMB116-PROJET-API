const express = require("express");
const app = express();

const fs = require("fs");
const path = require("path");

const security = require("./controller/security.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

require("dotenv").config();
const { RUNNING_PORT, RUNNING_IP } = process.env;

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(fileUpload());

app.get("/musique/file/:filename", (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(
    "C:/Users/quent/Desktop/API_BLIND_TEST/files/",
    filename
  );

  fs.stat(filepath, (err, stats) => {
    if (err) {
      console.error("File not found:", err);
      res.sendStatus(404);
      return;
    }

    const range = req.headers.range;
    if (!range) {
      const head = {
        "Content-Length": stats.size,
        "Content-Type": "audio/mpeg",
      };
      res.writeHead(200, head);
      fs.createReadStream(filepath).pipe(res);
      return;
    }

    const positions = range.replace(/bytes=/, "").split("-");
    const start = parseInt(positions[0], 10);
    const total = stats.size;
    const end = positions[1] ? parseInt(positions[1], 10) : total - 1;
    const chunksize = end - start + 1;

    const head = {
      "Content-Range": `bytes ${start}-${end}/${total}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "audio/mpeg",
    };

    res.writeHead(206, head);

    const stream = fs
      .createReadStream(filepath, { start, end })
      .on("open", () => {
        stream.pipe(res);
      })
      .on("error", (streamErr) => {
        res.end(streamErr);
      });
  });
});
app.use("/partie", require("./routes/partie.js"));
app.use("/score", require("./routes/score.js"));
app.use("/artiste", require("./routes/artiste.js"));
app.use("/categorie", require("./routes/categorie.js"));
app.use("/musique", require("./routes/musique.js"));
app.use("/utilisateur", require("./routes/utilisateur.js"));
app.use("/ami", require("./routes/ami.js"));
app.use("/message", require("./routes/message.js"));
app.listen(RUNNING_PORT, RUNNING_IP, () => {
  console.log("Listening for request");
});
