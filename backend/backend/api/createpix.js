import axios from "axios";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método não permitido" });
    }

    const { valor } = req.body;

    if (!valor) {
        return res.status(400).json({ error: "Valor não informado" });
    }

    try {
        const response = await axios.post(
            "https://api.evopay.cash/v1/pix/create",
            {
                value: Number(valor),
                description: "Doação Davizinho",
                payer_name: "Visitante",
                payer_document: "00000000000"
            },
            {
                headers: {
                    "API-Key": process.env.EVOPAY_API_KEY,
                    "Content-Type": "application/json"
                }
            }
        );

        return res.status(200).json({
            copiaecola: response.data?.pix_copia_cola ?? "",
            qrcode: response.data?.qr_code_image ?? ""
        });

    } catch (error) {
        console.error("Erro ao criar PIX:", error.response?.data || error.message);
        return res.status(500).json({ error: "Falha ao gerar PIX" });
    }
}
