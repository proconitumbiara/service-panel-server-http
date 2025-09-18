const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());

// Lista de clientes conectados (opcional, para logging)
wss.on('connection', (ws) => {
    console.log('Cliente WebSocket conectado');
});

// Endpoint para chamar cliente
app.post('/call', (req, res) => {
    const data = req.body;

    // Se for array, envie cada item para os clientes
    if (Array.isArray(data)) {
        data.forEach(item => {
            const { nome, guiche, chamadoEm } = item;
            const payload = JSON.stringify({ nome, guiche, chamadoEm });
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(payload);
                }
            });
        });
    } else {
        // Se for objeto único
        const { nome, guiche, setor } = data;
        const payload = JSON.stringify({ nome, guiche, setor });
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(payload);
            }
        });
    }

    res.json({ ok: true });
});

// Inicia o servidor
const PORT = 3001;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});