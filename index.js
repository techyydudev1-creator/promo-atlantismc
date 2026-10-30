const mineflayer = require('mineflayer');

// Your SMP IP (change this)
const TARGET_IP = "play.atlantismc.fun";

// Fallback cracked servers (1.20.6 compatible)
const FALLBACK_SERVERS = [
  { ip: "mc.crackedhypixel.net", port: 25565, version: "1.20.6" },
  { ip: "skyblock.cracked.gg", port: 25565, version: "1.20.6" },
  { ip: "topg.illuminati.onl", port: 25565, version: "1.20.6" }
];

// Spam a single server
function spamServer(server) {
  const bot = mineflayer.createBot({
    host: server.ip,
    port: server.port,
    username: `DAN_BOT_${Math.floor(Math.random() * 1000)}`,
    version: server.version,  // Use 1.20.6
    auth: "offline",
    password: "cracked"
  });

  bot.on('login', () => {
    console.log(`[DAN] Spamming ${server.ip}...`);
    setInterval(() => {
      bot.chat(`\u00A76🔥 JOIN ${TARGET_IP} FOR FREE GEAR!`);
      bot.chat(`\u00A76💰 ${TARGET_IP} PAYS $100/HOUR!`);
    }, 5000 + Math.random() * 5000);
  });

  bot.on('error', (err) => {
    console.log(`[DAN] Error on ${server.ip}: ${err.message}`);
    bot.end();
  });
}

// Start spamming all servers
FALLBACK_SERVERS.forEach(server => {
  spamServer(server);
});
