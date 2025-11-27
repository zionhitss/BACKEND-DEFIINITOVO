import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ROTA PARA GERAR PIX
app.post("/gerar", async (req, res) => {
  try {
    const { valor } = req.body;

    if (!valor) {
      return res.status(400).json({ error: "Valor não informado" });
    }

    const response = await axios.post(
      "https://api.evopay.cash/v1/pix",
      {
        amount: Number(valor),
        description: "Doação via Vakinha"
      },
      {
        headers: {
          "API-Key": process.env.EVOPAY_TOKEN
        }
      }
    );

    res.json({
      copiaecola: response.data?.payload || "",
      qrcode: response.data?.qrcode || ""
    });

  } catch (error) {
    console.error("Erro no backend:", error.response?.data || error.message);
    res.status(500).json({ error: "Falha ao gerar Pix" });
  }
});

// PORTA AUTOMÁTICA DO RAILWAY
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor rodando na porta", PORT));
