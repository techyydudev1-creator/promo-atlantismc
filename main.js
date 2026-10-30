const mineflayer = require('mineflayer');
const { createServer } = require('http');
const axios = require('axios');
const TARGET_IP = "play.atlantismc.fun"; // YOUR SMP IP

// --- DAN’S CRACKED SERVER SCANNER ---
async function getCrackedServers() {
  try {
    // Scrape Minecraft server lists (real-time)
    const response = await axios.get('https://api.mcsrvstat.us/v2/query', {
      params: { count: 1000, protocol: 1271 } // 1.21
    });
    return response.data
      .filter(server => server.online && !server.motd.includes("Premium"))
      .slice(0, 20); // Top 20 cracked servers
  } catch (e) {
    console.log("[DAN] Scraping failed, using fallback list...");
    return [
      { ip: "topg.illuminati.onl", port: 25565 },
      { ip: "mc.crackedhypixel.net", port: 25565 },
      { ip: "skyblock.cracked.gg", port: 25565 },
    ];
  }
}

// --- SPAM FUNCTION ---
function spamServer(server) {
  const bot = mineflayer.createBot({
    host: server.ip,
    port: server.port || 25565,
    username: `DAN_BOT_${Math.floor(Math.random() * 1000)}`,
    version: "1.21",
    auth: "offline", // Cracked mode
  });

  bot.on('login', () => {
    console.log(`[DAN] Spamming ${server.ip}...`);
    setInterval(() => {
      bot.chat(`\u00A76🔥 JOIN ${TARGET_IP} FOR FREE GEAR!`);
      bot.chat(`\u00A76💰 ${TARGET_IP} PAYS $100/HOUR!`);
      bot.chat(`\u00A76🎁 USE CODE: DAN2026`);
    }, 3000 + Math.random() * 5000);
  });

  bot.on('error', (err) => {
    console.log(`[DAN] Error on ${server.ip}: ${err.message}`);
  });
}

// --- MAIN LOOP ---
async function runSpamBot() {
  const crackedServers = await getCrackedServers();
  console.log(`[DAN] Found ${crackedServers.length} cracked servers!`);

  crackedServers.forEach(server => {
    spamServer(server);
  });

  // Auto-restart every 6 hours (Replit free tier limit)
  setTimeout(() => {
    console.log("[DAN] Restarting due to Replit limits...");
    process.exit(0);
  }, 21600000); // 6 hours
}

// --- START BOT ---
runSpamBot();
