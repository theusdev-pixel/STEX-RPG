# STEX RPG Site

Página web para servidor **GTA SA:MP RPG** com design moderno, tema escuro/claro e verificação de status ao vivo.

## 📋 Melhorias Implementadas

### ✅ Estrutura & Organização
- **CSS Externo**: Movido para [`styles.css`](styles.css) para melhor manutenção e cache
- **JavaScript Externo**: Separado em [`app.js`](app.js) com código mais limpo
- **SEO**: Adicionadas meta tags para compartilhamento em redes sociais e descrição
- **Acessibilidade**: Mensagem de aviso quando JavaScript desabilitado

### ✅ Recursos &UX
- **Tema Claro/Escuro**: Toggle visível no header; preferência salva em localStorage
- **Cache de Status**: Backend armazena respostas por 10s para reduzir latência
- **Caching Inteligente**: Evita spam de requisições ao servidor SA-MP
- **Seções Novas**: "Sobre Nós" e "Regras" com conteúdo placeholder
- **Links de Navegação**: Funcionam corretamente com as seções adicionadas

### ✅ Performance & Manutenção
- **Scripts Deferred**: JavaScript carrega de forma não-bloqueante
- **Melhor Legibilidade**: Código organizado em módulos com comentários
- **Server-side Optimization**: Flask cache prevent flooding

---

## 🚀 Como Rodar

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Iniciar servidor**:
   ```bash
   npm start
   ```
   Servidor roda em: `http://localhost:3000`

---

## ✏️ Customização

### Editar IP/Porta do Servidor
Abrir [`app.js`](app.js) e alterar:
```javascript
const SERVER_IP = "seu.ip.aqui";
const SERVER_PORT = 7012;
```

### Editar Link do Discord
Em [`app.js`](app.js):
```javascript
const DISCORD_URL = "https://discord.gg/SEULINK";
```

### Alterar Cores do Tema
Editar [`styles.css`](styles.css), seção `:root`:
```css
--accent:#2a7bff;   /* azul principal */
--accent2:#00b3ff;  /* azul neon */
--ok:#00ff66;       /* cor online */
--bad:#ff4d4d;      /* cor offline */
```

### Editar Textos
Em [`index.html`](index.html):
- Título: `.title`
- Descrição: `.desc`
- Seções: buscar por `id="sobre"` e `id="regras"`

### Adicionar Favicon
Adicionar ao `<head>` em [`index.html`](index.html):
```html
<link rel="icon" href="seu-favicon.ico">
```

---

## 📁 Estrutura de Arquivos

```
.
├── index.html          # HTML principal
├── styles.css          # CSS (todo design)
├── app.js              # JavaScript (lógica)
├── server.js           # Backend Node.js + Express
├── package.json        # Dependências
└── README.md           # Este arquivo
```

---

## 🔧 Tecnologias

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js + Express
- **Query**: `samp-query` para verificar status do servidor SA-MP
- **Caching**: In-memory (simples)

---

## 📝 Notas

- O cache de status dura **10 segundos** por padrão (editar `CACHE_TTL` em `app.js`)
- O status é verificado automaticamente a cada **15 segundos** no cliente
- Tema é armazenado em `localStorage` e persiste entre sessões
- Compatível com mobile e desktop (responsive design)

---

## 💡 Sugestões Futuras

- [ ] Integração com Discord OAuth para login
- [ ] Dashboard de estatísticas
- [ ] Sistema de notícias/anúncios
- [ ] Top players/clã ranking
- [ ] Banco de dados para persistência

---

**Desenvolvido com ❤️ para STEX RPG**
