const fs = require("fs");
const path = require("path");
const axios = require("axios");
const moment = require("moment-timezone");

module.exports.config = {
 name: "namaz",
 version: "5.2.0",
 role: 0,
 credit: "MOHAMMAD BADOL",
 description: "Namaz time with video alert",
 category: "islamic",
 prefix: true,
 cooldown: 5
};

const PRAYER_TIMES = [
 { name: "à¦«à¦œà¦°", time: "04:15", emoji: "ðŸŒ…", desc: "à¦­à§‹à¦°à§‡à¦° à¦¨à¦¾à¦®à¦¾à¦œ" }, 
 { name: "à¦¯à§‹à¦¹à¦°", time: "13:00", emoji: "â˜€ï¸", desc: "à¦¦à§à¦ªà§à¦°à§‡à¦° à¦¨à¦¾à¦®à¦¾à¦œ" }, 
 { name: "à¦†à¦¸à¦°", time: "17:00", emoji: "ðŸŒ¤ï¸", desc: "à¦¬à¦¿à¦•à¦¾à¦²à§‡à¦° à¦¨à¦¾à¦®à¦¾à¦œ" }, 
 { name: "à¦®à¦¾à¦—à¦°à¦¿à¦¬", time: "19:10", emoji: "ðŸŒ†", desc: "à¦¸à¦¨à§à¦§à§à¦¯à¦¾à¦° à¦¨à¦¾à¦®à¦¾à¦œ" }, 
 { name: "à¦à¦¶à¦¾", time: "20:10", emoji: "ðŸŒ™", desc: "à¦°à¦¾à¦¤à§‡à¦° à¦¨à¦¾à¦®à¦¾à¦œ" } 
];

const BN_DIGITS = ["à§¦", "à§§", "à§¨", "à§©", "à§ª", "à§«", "à§¬", "à§­", "à§®", "à§¯"];
const BN_DAYS = ["à¦°à¦¬à¦¿à¦¬à¦¾à¦°", "à¦¸à§‹à¦®à¦¬à¦¾à¦°", "à¦®à¦™à§à¦—à¦²à¦¬à¦¾à¦°", "à¦¬à§à¦§à¦¬à¦¾à¦°", "à¦¬à§ƒà¦¹à¦¸à§à¦ªà¦¤à¦¿à¦¬à¦¾à¦°", "à¦¶à§à¦•à§à¦°à¦¬à¦¾à¦°", "à¦¶à¦¨à¦¿à¦¬à¦¾à¦°"];
const BN_MONTHS = ["à¦œà¦¾à¦¨à§à¦¯à¦¼à¦¾à¦°à¦¿", "à¦«à§‡à¦¬à§à¦°à§à¦¯à¦¼à¦¾à¦°à¦¿", "à¦®à¦¾à¦°à§à¦š", "à¦à¦ªà§à¦°à¦¿à¦²", "à¦®à§‡", "à¦œà§à¦¨", "à¦œà§à¦²à¦¾à¦‡", "à¦†à¦—à¦¸à§à¦Ÿ", "à¦¸à§‡à¦ªà§à¦Ÿà§‡à¦®à§à¦¬à¦°", "à¦…à¦•à§à¦Ÿà§‹à¦¬à¦°", "à¦¨à¦­à§‡à¦®à§à¦¬à¦°", "à¦¡à¦¿à¦¸à§‡à¦®à§à¦¬à¦°"];

// à¦—à§à¦—à¦² à¦¡à§à¦°à¦¾à¦‡à¦­à§‡à¦° à¦­à¦¿à¦¡à¦¿à¦“ à¦†à¦‡à¦¡à¦¿ à¦¥à§‡à¦•à§‡ à¦¡à¦¿à¦°à§‡à¦•à§à¦Ÿ à¦¡à¦¾à¦‰à¦¨à¦²à§‹à¦¡ à¦²à¦¿à¦‚à¦• à¦œà§‡à¦¨à¦¾à¦°à§‡à¦Ÿ
const VIDEO_URL = "https://docs.google.com/uc?export=download&id=1bqXZRJ9Ji2AinVh3t9ATFThVQrD4DZ35";
const CACHE_VIDEO_PATH = path.join(__dirname, "cache_namaz_video.mp4");

function toBanglaNum(n) {
 return String(n).replace(/[0-9]/g, d => BN_DIGITS[+d]);
}

function convertTo12Hour(time24) {
 const [hour, minute] = time24.split(":");
 let h = parseInt(hour);
 const ampm = h >= 12 ? "PM" : "AM";
 h = h % 12 || 12;
 return `${toBanglaNum(h)}:${toBanglaNum(minute)} ${ampm}`;
}

async function downloadVideo() {
 try {
 const response = await axios({
 method: "GET",
 url: VIDEO_URL,
 responseType: "stream",
 headers: {
 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36'
 }
 });
 const writer = fs.createWriteStream(CACHE_VIDEO_PATH);
 response.data.pipe(writer);
 return new Promise((resolve, reject) => {
 writer.on("finish", resolve);
 writer.on("error", reject);
 });
 } catch (e) {
 console.log("[NAMAZ] Video download failed: " + e.message);
 }
}

async function sendPrayerAlert(api, prayer) {
 const threads = global.data?.allThreadID || [];
 if (threads.length === 0) {
 console.log("[NAMAZ] No groups found");
 return;
 }

 const now = moment.tz("Asia/Dhaka");
 const banglaTime = convertTo12Hour(prayer.time);
 const date = toBanglaNum(now.format("DD")) + " " + BN_MONTHS[now.month()] + " " + toBanglaNum(now.format("YYYY"));
 const day = BN_DAYS[now.day()];

 const msgText = `â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—
â•‘ ðŸ•Œ à¦¨à¦¾à¦®à¦¾à¦œà§‡à¦° à¦¸à¦®à§Ÿ ðŸ•Œ â•‘
â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

${prayer.emoji} ${prayer.name} à¦à¦° à¦“à§Ÿà¦¾à¦•à§à¦¤ à¦¶à§à¦°à§ à¦¹à§Ÿà§‡à¦›à§‡
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”
â° à¦¸à¦®à§Ÿ: ${banglaTime}
ðŸ“… à¦¤à¦¾à¦°à¦¿à¦–: ${date}
ðŸ“† à¦¬à¦¾à¦°: ${day}
ðŸ“– ${prayer.desc}
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”

ðŸ¤² à¦¨à¦¾à¦®à¦¾à¦œ à¦†à¦¦à¦¾à§Ÿ à¦•à¦°à§à¦¨
ðŸ’š à¦†à¦²à§à¦²à¦¾à¦¹ à¦†à¦ªà¦¨à¦¾à¦° à¦‡à¦¬à¦¾à¦¦à¦¤ à¦•à¦¬à§à¦² à¦•à¦°à§à¦¨
ðŸ•‹ à¦œà¦¾à¦®à¦¾à¦¤à§‡ à¦¨à¦¾à¦®à¦¾à¦œ à¦ªà§œà¦¾à¦° à¦šà§‡à¦·à§à¦Ÿà¦¾ à¦•à¦°à§à¦¨

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
 à¦†à¦²à§à¦²à¦¾à¦¹ à¦¹à¦¾à¦«à§‡à¦œ
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•`;

 console.log(`[NAMAZ] Sending ${prayer.name} alert to ${threads.length} groups with video`);

 if (!fs.existsSync(CACHE_VIDEO_PATH)) {
 await downloadVideo();
 }

 let msgPayload = { body: msgText };
 if (fs.existsSync(CACHE_VIDEO_PATH) && fs.statSync(CACHE_VIDEO_PATH).size > 0) {
 msgPayload.attachment = fs.createReadStream(CACHE_VIDEO_PATH);
 }

 for (const tid of threads) {
 try {
 await api.sendMessage(msgPayload, tid);
 await new Promise(r => setTimeout(r, 2000));
 } catch (e) {
 console.log(`[NAMAZ] Failed ${tid}`);
 }
 }
}

function schedulePrayers(api) {
 const now = moment.tz("Asia/Dhaka");

 if (global.namazTimers) {
 global.namazTimers.forEach(t => clearTimeout(t));
 }
 global.namazTimers = [];

 for (const prayer of PRAYER_TIMES) {
 const [hour, minute] = prayer.time.split(":");
 let prayerTime = moment.tz("Asia/Dhaka").hour(parseInt(hour)).minute(parseInt(minute)).second(0);

 if (prayerTime.isBefore(now)) {
 prayerTime = prayerTime.add(1, "day");
 }

 const msUntil = prayerTime.diff(now);
 const banglaTime = convertTo12Hour(prayer.time);

 console.log(`[NAMAZ] ${prayer.name} scheduled at ${banglaTime}`);

 const timer = setTimeout(() => {
 sendPrayerAlert(api, prayer);
 const dailyTimer = setInterval(() => sendPrayerAlert(api, prayer), 86400000);
 global.namazTimers.push(dailyTimer);
 }, msUntil);

 global.namazTimers.push(timer);
 }
}

module.exports.onLoad = async function ({ api }) {
 if (!fs.existsSync(CACHE_VIDEO_PATH)) {
 downloadVideo();
 }
 
 schedulePrayers(api);
 const now = moment.tz("Asia/Dhaka");
 let nextMidnight = moment.tz("Asia/Dhaka").add(1, "day").startOf("day").add(1, "minute");
 const msUntilMidnight = nextMidnight.diff(now);

 setTimeout(() => {
 schedulePrayers(api);
 setInterval(() => schedulePrayers(api), 86400000);
 }, msUntilMidnight);

 console.log("[NAMAZ] All prayer times scheduled - Stylish Mode with Video");
};

module.exports.onStart = async function (api, event, args) {
 const { threadID, messageID, senderID } = event;
 const config = require("../../config.json");
 const prefix = config.BOT_INFO.PREFIX;
 const isAdmin = config.ADMIN_SYSTEM.ADMINS.includes(senderID);

 if (args[0] === "stop") {
 if (!isAdmin) return api.sendMessage("âŒ à¦¶à§à¦§à§ Admin à¦à¦‡ à¦•à¦®à¦¾à¦¨à§à¦¡ à¦‡à¦‰à¦œ à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à¦¬à§‡", threadID, messageID);
 if (global.namazTimers) {
 global.namazTimers.forEach(t => clearTimeout(t));
 global.namazTimers = [];
 }
 return api.sendMessage(`â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—
â•‘ âš ï¸ à¦¸à¦¿à¦¸à§à¦Ÿà§‡à¦® à¦¬à¦¨à§à¦§ â•‘
â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

à¦¨à¦¾à¦®à¦¾à¦œà§‡à¦° à¦°à¦¿à¦®à¦¾à¦‡à¦¨à§à¦¡à¦¾à¦° à¦¬à¦¨à§à¦§ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤
à¦šà¦¾à¦²à§ à¦•à¦°à¦¤à§‡ à¦Ÿà¦¾à¦‡à¦ª à¦•à¦°à§à¦¨: ${prefix}namaz start`, threadID, messageID);
 }

 if (args[0] === "start") {
 if (!isAdmin) return api.sendMessage("âŒ à¦¶à§à¦§à§ Admin à¦à¦‡ à¦•à¦®à¦¾à¦¨à§à¦¡ à¦‡à¦‰à¦œ à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à¦¬à§‡", threadID, messageID);
 schedulePrayers(api);
 return api.sendMessage(`â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—
â•‘ âœ… à¦¸à¦¿à¦¸à§à¦Ÿà§‡à¦® à¦šà¦¾à¦²à§ â•‘
â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

à¦¨à¦¾à¦®à¦¾à¦œà§‡à¦° à¦°à¦¿à¦®à¦¾à¦‡à¦¨à§à¦¡à¦¾à¦° à¦šà¦¾à¦²à§ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤
à¦ªà§à¦°à¦¤à¦¿ à¦“à§Ÿà¦¾à¦•à§à¦¤à§‡ à¦…à¦Ÿà§‹ à¦®à§‡à¦¸à§‡à¦œ à¦ªà¦¾à¦¬à§‡à¦¨à¥¤`, threadID, messageID);
 }

 const now = moment.tz("Asia/Dhaka");
 const date = toBanglaNum(now.format("DD")) + " " + BN_MONTHS[now.month()] + " " + toBanglaNum(now.format("YYYY"));
 const day = BN_DAYS[now.day()];

 let list = `â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—
â•‘ ðŸ•Œ à¦¨à¦¾à¦®à¦¾à¦œà§‡à¦° à¦¸à¦®à§Ÿà¦¸à§‚à¦šà§€ ðŸ•Œ â•‘
â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

ðŸ“ à¦¸à§à¦¥à¦¾à¦¨: à¦¬à¦¾à¦‚à¦²à¦¾à¦¦à§‡à¦¶
ðŸ“… à¦¤à¦¾à¦°à¦¿à¦–: ${date}
ðŸ“† à¦¬à¦¾à¦°: ${day}
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”

`;

 for (const prayer of PRAYER_TIMES) {
 list += `${prayer.emoji} ${prayer.name.padEnd(8, ' ')}: ${convertTo12Hour(prayer.time)}\n â””â”€ ${prayer.desc}\n\n`;
 }

 list += `â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”
âœ… à¦¬à¦Ÿ à¦ªà§à¦°à¦¤à¦¿ à¦“à§Ÿà¦¾à¦•à§à¦¤à§‡ à¦…à¦Ÿà§‹ à¦°à¦¿à¦®à¦¾à¦‡à¦¨à§à¦¡à¦¾à¦° à¦ªà¦¾à¦ à¦¾à¦¬à§‡
ðŸ’¡ à¦¬à¦¨à§à¦§ à¦•à¦°à¦¤à§‡: ${prefix}namaz stop

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
 ðŸ¤² à¦†à¦²à§à¦²à¦¾à¦¹ à¦¹à¦¾à¦«à§‡à¦œ ðŸ¤²
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•`;

 if (!fs.existsSync(CACHE_VIDEO_PATH)) {
 await downloadVideo();
 }

 let finalPayload = { body: list };
 if (fs.existsSync(CACHE_VIDEO_PATH) && fs.statSync(CACHE_VIDEO_PATH).size > 0) {
 finalPayload.attachment = fs.createReadStream(CACHE_VIDEO_PATH);
 }

 return api.sendMessage(finalPayload, threadID, messageID);
};
