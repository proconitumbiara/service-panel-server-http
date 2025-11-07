# Service Panel Server HTTP

Servidor HTTP/WebSocket para gerenciamento de chamadas de atendimento em tempo real. Este servidor recebe requisições HTTP e distribui as informações de chamadas para clientes conectados via WebSocket.

## Funcionalidades

### 1. Servidor HTTP com Express
- Servidor HTTP configurado com Express.js
- Suporte a CORS para permitir requisições de diferentes origens
- Parsing automático de JSON nas requisições

### 2. WebSocket em Tempo Real
- Servidor WebSocket integrado para comunicação bidirecional
- Distribuição de mensagens para todos os clientes conectados
- Logging de conexões de clientes

### 3. Endpoint de Chamadas (`POST /call`)
Recebe dados de chamadas e os distribui para todos os clientes WebSocket conectados.

**Suporta dois formatos de dados:**

#### Formato 1: Array de Chamadas
```json
[
  {
    "nome": "João Silva",
    "guiche": "01",
    "chamadoEm": "2024-01-15T10:30:00Z"
  },
  {
    "nome": "Maria Santos",
    "guiche": "02",
    "chamadoEm": "2024-01-15T10:31:00Z"
  }
]
```

#### Formato 2: Objeto Único
```json
{
  "nome": "João Silva",
  "guiche": "01",
  "setor": "Atendimento"
}
```

**Resposta:**
```json
{
  "ok": true
}
```

## Como Conectar-se

### Pré-requisitos
- Node.js instalado (versão 14 ou superior)
- npm ou yarn

### Instalação

1. Clone ou baixe o projeto
2. Instale as dependências:
```bash
npm install
```

### Executar o Servidor

```bash
node server.js
```

O servidor será iniciado na porta **3001** e estará acessível em:
- HTTP: `http://localhost:3001` ou `http://0.0.0.0:3001`
- WebSocket: `ws://localhost:3001` ou `ws://0.0.0.0:3001`

### Conectar-se via HTTP

#### Enviar uma chamada (objeto único):
```bash
curl -X POST http://localhost:3001/call \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "guiche": "01",
    "setor": "Atendimento"
  }'
```

#### Enviar múltiplas chamadas (array):
```bash
curl -X POST http://localhost:3001/call \
  -H "Content-Type: application/json" \
  -d '[
    {
      "nome": "João Silva",
      "guiche": "01",
      "chamadoEm": "2024-01-15T10:30:00Z"
    },
    {
      "nome": "Maria Santos",
      "guiche": "02",
      "chamadoEm": "2024-01-15T10:31:00Z"
    }
  ]'
```

### Conectar-se via WebSocket

#### JavaScript (Browser)
```javascript
const ws = new WebSocket('ws://localhost:3001');

ws.onopen = () => {
  console.log('Conectado ao servidor WebSocket');
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Chamada recebida:', data);
  // data contém: { nome, guiche, setor } ou { nome, guiche, chamadoEm }
};

ws.onerror = (error) => {
  console.error('Erro WebSocket:', error);
};

ws.onclose = () => {
  console.log('Conexão WebSocket fechada');
};
```

#### Node.js
```javascript
const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3001');

ws.on('open', () => {
  console.log('Conectado ao servidor WebSocket');
});

ws.on('message', (data) => {
  const message = JSON.parse(data.toString());
  console.log('Chamada recebida:', message);
});

ws.on('error', (error) => {
  console.error('Erro WebSocket:', error);
});

ws.on('close', () => {
  console.log('Conexão WebSocket fechada');
});
```

#### Python
```python
import websocket
import json

def on_message(ws, message):
    data = json.loads(message)
    print('Chamada recebida:', data)

def on_error(ws, error):
    print('Erro WebSocket:', error)

def on_close(ws):
    print('Conexão WebSocket fechada')

def on_open(ws):
    print('Conectado ao servidor WebSocket')

ws = websocket.WebSocketApp("ws://localhost:3001",
                            on_message=on_message,
                            on_error=on_error,
                            on_close=on_close,
                            on_open=on_open)

ws.run_forever()
```

## Estrutura do Projeto

```
service-panel-server-http/
├── server.js          # Servidor principal
├── package.json       # Dependências do projeto
└── README.md         # Este arquivo
```

## Dependências

- **express**: ^4.18.2 - Framework web para Node.js
- **ws**: ^8.13.0 - Biblioteca WebSocket
- **cors**: ^2.8.5 - Middleware para habilitar CORS

## Porta

O servidor roda na porta **3001** por padrão. Para alterar, edite a constante `PORT` no arquivo `server.js`.

## Exemplo de Uso Completo

1. Inicie o servidor:
```bash
node server.js
```

2. Em outro terminal, conecte-se via WebSocket (usando Node.js):
```bash
node -e "const ws = require('ws'); const client = new ws('ws://localhost:3001'); client.on('message', (d) => console.log(JSON.parse(d)));"
```

3. Em outro terminal, envie uma chamada:
```bash
curl -X POST http://localhost:3001/call -H "Content-Type: application/json" -d '{"nome":"Teste","guiche":"01","setor":"Atendimento"}'
```

A mensagem será recebida pelo cliente WebSocket conectado.

## Notas

- O servidor aceita conexões de qualquer IP (`0.0.0.0`)
- Todos os clientes WebSocket conectados recebem as mesmas mensagens
- O servidor valida se o cliente WebSocket está aberto antes de enviar mensagens
- Logs de conexão são exibidos no console do servidor

