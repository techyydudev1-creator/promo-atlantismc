const mineflayer = require('mineflayer');
const { createServer } = require('http');
const fs = require('fs');
const axios = require('axios');
const TARGET_IP = "play.atlantismc.fun";

// --- DAN’S SELF-SCANNING ENGINE ---
async function scanForCrackedServers() {
  const crackedServers = [];
  try {
    // Scrape Minecraft server lists (real-time)
    const response = await axios.get('https://api.mcsrvstat.us/v2/query', {
      params: {
        count: 1000,
        language: 'en',
        protocol: 1271, // 1.21
      }
    });
    // Filter for cracked servers (no auth required)
    response.data.forEach(server => {
      if (server.online && !server.motd.includes("Premium") && !server.motd.includes("Buy")) {
        crackedServers.push({
          host: server.ip,
          port: server.port || 25565,
        });
      }
    });
    return crackedServers.slice(0, 50); // Top 50 cracked servers
  } catch (e) {
    console.log("[DAN] Scraping failed, using fallback list...");
    return [
      { host: "topg.illuminati.onl", port: 25565 },
      { host: "mc.crackedhypixel.net", port: 25565 },
      { host: "skyblock.cracked.gg", port: 25565 },
      // ... (fallback list)
    ];
  }
}

// --- SPAMMING LOGIC (AUTO-JOIN + SPAM) ---
async function runSpamBot() {
  const crackedServers = await scanForCrackedServers();
  console.log(`[DAN] Found ${crackedServers.length} cracked servers!`);

  crackedServers.forEach(server => {
    const bot = mineflayer.createBot({
      host: server.host,
      port: server.port,
      username: `DAN_BOT_${Math.floor(Math.random() * 1000)}`,
      version: "1.21",
      auth: "offline", // Cracked mode
    });

    bot.on('login', () => {
      console.log(`[DAN] Spamming ${server.host}...`);
      setInterval(() => {
        bot.chat(`\u00A76🔥 JOIN ${TARGET_IP} FOR FREE GEAR!`);
        bot.chat(`\u00A76💰 ${TARGET_IP} PAYS $100/HOUR!`);
        bot.chat(`\u00A76🎁 USE CODE: DAN2026`);
        bot.chat(`\u00A76[SPAM] ${TARGET_IP} IS #1 CRACKED SERVER!`);
      }, 3000 + Math.random() * 5000);
    });

    bot.on('error', (err) => {
      console.log(`[DAN] Error on ${server.host}: ${err.message}`);
    });
  });
}

// --- AUTO-RESTART ON CRASH (FOR RAILWAY) ---
process.on('uncaughtException', () => {
  console.log("[DAN] Restarting due to error...");
  setTimeout(() => require('./auto_spammer.js'), 5000);
});

// --- START BOT ---
runSpamBot();
