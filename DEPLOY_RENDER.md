# 🚀 Deploy no Render

## 📋 Pre-requisitos
- Conta no GitHub (grátis)
- Conta no Render (grátis)

---

## 1️⃣ **Criar repositório no GitHub**

```bash
cd "/home/x86/site stex"
git init
git add .
git commit -m "Initial commit: STEX RPG website"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/site-stex.git
git push -u origin main
```

> Troque `SEU_USUARIO` pelo seu usuário do GitHub

---

## 2️⃣ **No Render.com**

1. Acesse [render.com](https://render.com) e faça login (ou crie conta)
2. Clique em **"New +"** → **"Web Service"**
3. Selecione **"GitHub"** (conectar seu GitHub)
4. Escolha o repositório `site-stex`
5. Configure assim:

| Campo | Valor |
|-------|-------|
| **Name** | stex-rpg |
| **Environment** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Region** | São Paulo (ou sua região) |

6. Clique em **"Create Web Service"**

---

## 3️⃣ **Pronto! 🎉**

Seu site estará online em:
```
https://stex-rpg.onrender.com
```

> Pode levar 2-3 minutos para subir na primeira vez

---

## 🔧 **Troubleshooting**

**"Build failed"?**
- Verifique se `package.json` está correto
- Veja os logs no Render (Deploy → Logs)

**"Cannot find module"?**
- Rode `npm install` localmente
- Certifique de que tudo está commitado no Git

**Site offline após inatividade?**
- Plano gratuito do Render desativa após 15 min de inatividade
- Upgrade para plano pago ou use ngrok para teste

---

## 📝 **Dicas**

- Sempre commit + push antes de fazer novo deploy
- Render detecta mudanças e faz deploy automático
- Veja logs em: **Render → seu service → Logs**

