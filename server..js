import express from "express";
import multer from "multer";
import pg from "pg";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Servir seu site
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// Upload para /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "_" + file.originalname)
});
const upload = multer({ storage });

// Banco
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

// Receber upload
app.post("/vender", upload.single("print"), async (req, res) => {
  const { discord } = req.body;
  const imagem = "/uploads/" + req.file.filename;

  await pool.query(
    "INSERT INTO vendas (discord, imagem) VALUES ($1, $2)",
    [discord, imagem]
  );

  res.json({ ok: true });
});

// Listar
app.get("/vendas", async (req, res) => {
  const result = await pool.query("SELECT * FROM vendas ORDER BY id DESC");
  res.json(result.rows);
});

// Iniciar
app.listen(process.env.PORT || 3000, () => console.log("Servidor ativo"));
