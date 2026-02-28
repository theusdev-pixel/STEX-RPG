const express = require("express");
const samp = require("samp-query");

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// session storage simples (em produção, usar banco de dados)
const sessions = new Map();
const USERS_DB = {
  // TODO: integrar com banco de dados real do servidor STEX
  // Por enquanto, exemplo de usuários (substituir com banco real)
  "admin": { username: "admin", password: "123456", nickname: "Admin" },
  "player1": { username: "player1", password: "senha123", nickname: "Jogador 1" }
};

// Gerar token de sessão
function generateToken() {
  return Math.random().toString(36).substr(2) + Date.now().toString(36);
}

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ ok: false, error: "Usuario ou senha faltando" });
  }

  // Validar contra banco de dados (aqui é exemplo)
  const user = USERS_DB[username];
  if (!user || user.password !== password) {
    return res.status(401).json({ ok: false, error: "Usuario ou senha incorretos" });
  }

  // Gerar token e armazenar sessão
  const token = generateToken();
  sessions.set(token, { username, nickname: user.nickname, loginAt: Date.now() });

  res.json({
    ok: true,
    token,
    user: { username, nickname: user.nickname }
  });
});

app.post("/api/logout", (req, res) => {
  const { token } = req.body;
  if (token) sessions.delete(token);
  res.json({ ok: true });
});

app.get("/api/profile", (req, res) => {
  const token = req.query.token;
  if (!token || !sessions.has(token)) {
    return res.status(401).json({ ok: false, error: "Não autenticado" });
  }
  const session = sessions.get(token);
  res.json({ ok: true, user: session });
});

// Exemplo: /status?ip=181.215.45.74&port=7012
// simple in-memory cache to reduce frequent queries
const statusCache = {};
const CACHE_TTL = 10 * 1000; // 10 segundos

app.get("/status", (req, res) => {
    const ip = req.query.ip;
    const port = Number(req.query.port);

    if (!ip || !port) {
        return res.status(400).json({ online: false, error: "missing ip/port" });
    }

    const cacheKey = ip + ":" + port;
    const now = Date.now();
    if (statusCache[cacheKey] && now - statusCache[cacheKey].ts < CACHE_TTL) {
        // return cached copy
        return res.json(statusCache[cacheKey].data);
    }

    samp({ host: ip, port, timeout: 1500 }, (err, response) => {
        if (err || !response) {
            const reply = { online: false };
            statusCache[cacheKey] = { ts: now, data: reply };
            return res.json(reply);
        }

        // response tem dados do servidor SA-MP
        const reply = {
            online: true,
            players: response.players ?? 0,
            maxPlayers: response.maxplayers ?? response.maxPlayers ?? 0,
            hostname: response.hostname ?? "",
            gamemode: response.gamemode ?? "",
        };
        statusCache[cacheKey] = { ts: now, data: reply };
        res.json(reply);
    });
});

app.use(express.static(".")); // serve o index.html

app.listen(PORT, () => {
    console.log("Proxy rodando em http://localhost:" + PORT);
});
