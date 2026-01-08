const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public"));

// Configuração do upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

app.post("/upload", upload.single("image"), (req, res) => {
  res.json({ filename: "/uploads/" + req.file.filename });
});

app.listen(3000, () => {
  console.log("Server rodando na porta 3000");
});
