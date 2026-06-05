import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

// Middleware for parsing requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const KLIVOPAY_API_KEY = process.env.KLIVOPAY_API_KEY || "4ALjYaKsAY8qKO2tYDvvwzXZbWxresY4uSWOxtNVhdp47O9Vec6DJZIwOh1X";
const OFFER_HASH = "s9w0xdvnpa";

// API call to proxy KlivoPay transaction creation
app.post("/api/pay", async (req, res) => {
  try {
    const { amount, payment_method, name, email, phone, cpf, installments } = req.body;

    // Validate fields
    if (!amount || !payment_method || !name || !email || !phone || !cpf) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes" });
    }

    // Map payment methods: client uses 'pix', 'card', 'boleto'
    // KlivoPay expects: 'pix', 'credit_card', 'billet'
    let mappedPaymentMethod = "pix";
    if (payment_method === "card") {
      mappedPaymentMethod = "credit_card";
    } else if (payment_method === "boleto") {
      mappedPaymentMethod = "billet";
    }

    // Format fields as required by KlivoPay (phone and document must be only digits)
    const formattedPhone = phone.replace(/\D/g, "");
    const formattedCpf = cpf.replace(/\D/g, "");

    // Structure KlivoPay payload
    const klivopayPayload: any = {
      api_token: KLIVOPAY_API_KEY,
      amount: Math.round(amount), // in cents
      offer_hash: OFFER_HASH,
      payment_method: mappedPaymentMethod,
      customer: {
        name,
        email,
        phone_number: formattedPhone,
        document: formattedCpf
      },
      cart: [
        {
          name: "Jogo de Panelas Style Cook 10 Peças",
          quantity: 1,
          unit_price: Math.round(amount)
        }
      ]
    };

    if (mappedPaymentMethod === "credit_card" && installments) {
      klivopayPayload.installments = parseInt(installments, 10);
    }

    console.log("Enviando transação para KlivoPay:", {
      ...klivopayPayload,
      api_token: "***"
    });

    const response = await fetch("https://api.klivopay.com.br/api/public/v1/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(klivopayPayload)
    });

    const responseText = await response.text();
    console.log(`Klivopay response status ${response.status}:`, responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      return res.status(500).json({ error: "Resposta inválida recebida da API de pagamento" });
    }

    if (!response.ok || !data.success) {
      return res.status(response.status || 400).json({
        error: data.message || "Erro ao processar transação na KlivoPay"
      });
    }

    // Success response
    return res.status(201).json(data);
  } catch (error: any) {
    console.error("Erro no processamento da transação:", error);
    return res.status(500).json({ error: error.message || "Erro interno do servidor" });
  }
});

// GET query to lookup transaction status
app.get("/api/pay/status/:hash", async (req, res) => {
  try {
    const { hash } = req.params;
    if (!hash) {
      return res.status(400).json({ error: "Hash da transação é obrigatório" });
    }

    const response = await fetch(`https://api.klivopay.com.br/api/public/v1/transactions/${hash}?api_token=${KLIVOPAY_API_KEY}`);
    const responseText = await response.text();

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      return res.status(500).json({ error: "Resposta de status inválida da API" });
    }

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.message || "Não foi possível resgatar o status da transação"
      });
    }

    return res.json(data);
  } catch (error: any) {
    console.error("Erro ao consultar status da transação:", error);
    return res.status(500).json({ error: error.message || "Erro interno do servidor" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
