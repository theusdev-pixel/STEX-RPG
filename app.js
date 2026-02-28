// configuration
const SERVER_IP = "181.215.45.74";
const SERVER_PORT = 7012;
const DISCORD_URL = "https://discord.gg/XJ6k5RyM";
const STATUS_URL = "/status?ip=" + encodeURIComponent(SERVER_IP) + "&port=" + encodeURIComponent(SERVER_PORT);

// cache for status (simple ttl)
const statusCache = {};
const CACHE_TTL = 10000; // ms

const toast = document.getElementById("toast");
const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");
const playersText = document.getElementById("playersText");
const maxText = document.getElementById("maxText");
const themeToggle = document.getElementById("themeToggle");

// init
function init(){
  document.getElementById("year").textContent = new Date().getFullYear();
  document.getElementById("discordBtn").href = DISCORD_URL;

  copyBtn.addEventListener("click", copyIP);
  copyBtn2.addEventListener("click", copyIP);
  refreshBtn.addEventListener("click", () => {
    fetchStatus(true);
    showToast("Atualizado!");
  });

  themeToggle.addEventListener("click", toggleTheme);
  applyStoredTheme();

  // Login/Account
  const accountBtn = document.getElementById("accountBtn");
  const loginModal = document.getElementById("loginModal");
  const modalClose = document.getElementById("modalClose");
  const loginFormElement = document.getElementById("loginFormElement");
  const logoutBtn = document.getElementById("logoutBtn");

  accountBtn.addEventListener("click", openLoginModal);
  modalClose.addEventListener("click", closeLoginModal);
  loginModal.addEventListener("click", (e) => {
    if (e.target === loginModal) closeLoginModal();
  });
  loginFormElement.addEventListener("submit", handleLogin);
  logoutBtn.addEventListener("click", handleLogout);

  checkAuthStatus();

  fetchStatus();
  setInterval(fetchStatus, 15000);
}

document.addEventListener("DOMContentLoaded", init);

function showToast(msg){
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 1200);
}

async function copyIP(){
  const full = SERVER_IP + ":" + SERVER_PORT;
  try{
    await navigator.clipboard.writeText(full);
    showToast("Copiado!");
  }catch(e){
    const ta = document.createElement("textarea");
    ta.value = full;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    showToast("Copiado!");
  }
}

function setOffline(){
  statusDot.classList.remove("ok");
  statusText.textContent = "OFFLINE";
  playersText.textContent = "Players: —";
  maxText.textContent = "Max: —";
}
function setOnline(players, maxPlayers){
  statusDot.classList.add("ok");
  statusText.textContent = "ONLINE";
  playersText.textContent = "Players: " + players;
  maxText.textContent = "Max: " + maxPlayers;
}

async function fetchStatus(force){
  statusText.textContent = "Verificando…";
  const cacheKey = SERVER_IP + ":" + SERVER_PORT;
  const now = Date.now();
  if(!force && statusCache[cacheKey] && (now - statusCache[cacheKey].ts < CACHE_TTL)){
    applyData(statusCache[cacheKey].data);
    return;
  }

  try{
    const r = await fetch(STATUS_URL, { cache: "no-store" });
    if(!r.ok) throw new Error("HTTP " + r.status);
    const data = await r.json();
    statusCache[cacheKey] = { ts: now, data };
    applyData(data);
  }catch(err){
    setOffline();
  }
}

function applyData(data){
  if(data && data.online){
    setOnline(Number(data.players ?? 0), Number(data.maxPlayers ?? 0));
  }else{
    setOffline();
  }
}

// theme helper
function toggleTheme(){
  const html = document.documentElement;
  const current = html.getAttribute("data-theme");
  const next = current === "light" ? "dark" : "light";
  html.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
}
function applyStoredTheme(){
  const stored = localStorage.getItem("theme");
  if(stored) document.documentElement.setAttribute("data-theme", stored);
}

// Login system
function openLoginModal(){
  document.getElementById("loginModal").classList.remove("hidden");
}

function closeLoginModal(){
  document.getElementById("loginModal").classList.add("hidden");
}

async function handleLogin(e){
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("errorMsg");

  if (!username || !password) {
    errorMsg.textContent = "Preencha usuário e senha";
    return;
  }

  try {
    const r = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await r.json();

    if (data.ok) {
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      errorMsg.textContent = "";
      updateUIAfterLogin(data.user);
      showToast("Login realizado!");
    } else {
      errorMsg.textContent = data.error || "Erro ao fazer login";
    }
  } catch (err) {
    errorMsg.textContent = "Erro de conexão";
  }
}

async function handleLogout(){
  const token = localStorage.getItem("authToken");
  if (token) {
    await fetch("/api/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    });
  }
  localStorage.removeItem("authToken");
  localStorage.removeItem("authUser");
  updateUIAfterLogout();
  closeLoginModal();
  showToast("Desconectado!");
}

function checkAuthStatus(){
  const token = localStorage.getItem("authToken");
  const user = localStorage.getItem("authUser");
  if (token && user) {
    updateUIAfterLogin(JSON.parse(user));
  } else {
    updateUIAfterLogout();
  }
}

function updateUIAfterLogin(user){
  document.getElementById("loginForm").classList.remove("show");
  document.getElementById("profileSection").classList.add("show");
  document.getElementById("profileNickname").textContent = user.nickname || user.username;
  
  const loginAt = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  document.getElementById("profileTime").textContent = loginAt;
}

function updateUIAfterLogout(){
  document.getElementById("loginForm").classList.add("show");
  document.getElementById("profileSection").classList.remove("show");
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
}
