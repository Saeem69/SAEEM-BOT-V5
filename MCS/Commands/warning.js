const fs = require("fs");
const path = require("path");

const CONFIG_PATH = path.join(__dirname, "../../config.json");
const cacheFile = path.join(__dirname, "../../cache/warning_cache.json");

const loadConfig = () => JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
const saveConfig = (config) => fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 4), "utf-8");

const loadWarnings = () => (fs.existsSync(cacheFile) ? JSON.parse(fs.readFileSync(cacheFile, "utf-8")) : {});
const saveWarnings = (data) => fs.writeFileSync(cacheFile, JSON.stringify(data, null, 4), "utf-8");

const ALLOWED_REACTIONS = ["🙄", "🤡", "👺", "👹"];

module.exports = {
 config: {
 name: "warning",
 aliases: ["warn"],
 version: "4.0.0",
 credit: "MOHAMMAD BADOL",
 role: 1,
 cooldown: 3,
 prefix: true,
 description: "Advanced Reaction Warning & Ban System"
 },

 onReaction: async function (api, event) {
 const { threadID, userID, messageID, reaction } = event;
 if (!ALLOWED_REACTIONS.includes(reaction)) return;

 const threadInfo = await api.getThreadInfo(threadID);
 if (!threadInfo.adminIDs.map(a => a.id).includes(userID) && userID !== "100022291393952") return;

 const message = await api.getMessage(threadID, messageID);
 const targetID = message.senderID;
 if (targetID === api.getCurrentUserID() || targetID === "100022291393952") return;

 let warningData = loadWarnings();
 if (!warningData[threadID]) warningData[threadID] = {};
 if (!warningData[threadID][targetID]) warningData[threadID][targetID] = 0;

 warningData[threadID][targetID] += 1;
 let count = warningData[threadID][targetID];

 let name = "User";
 try { const info = await api.getUserInfo(targetID); if (info && info[targetID]) name = info[targetID].name; } catch (e) {}

 if (count >= 3) {
 let config = loadConfig();
 if (!config.ACCESS_CONTROL) config.ACCESS_CONTROL = {};
 if (!config.ACCESS_CONTROL.BANNED_USERS) config.ACCESS_CONTROL.BANNED_USERS = [];
 if (!config.ACCESS_CONTROL.BANNED_USERS.includes(targetID)) {
 config.ACCESS_CONTROL.BANNED_USERS.push(targetID);
 saveConfig(config);
 }
 api.sendMessage(`╭─── [ SAEEM-BOT-V5 ] ───❍\n│ 🚫 ${name}-কে ৩টি Warning দেওয়া হয়েছে!\n├── • • • • • • • • • • • • •\n│ ⚠️ আগের ২ বার সতর্ক করার পরেও\n│ আপনার বাল পাকনামি কমেনি!\n│ তাই সরাসরি বট থেকে Ban করা হলো।\n├── • • • • • • • • • • • • •\n│ ক্ষমা চেয়ে Unban হতে টাইপ করুন:\n│ $call ভাই আমার ভুল হয়েছে, এমন ভুল\n│ আর কখনো করবো না, আমাকে unban\n│ করুন প্লিজ 🙏\n╰─────────────────────❍`, threadID);
 delete warningData[threadID][targetID];
 } else {
 api.sendMessage(`╭─── [ SAEEM-BOT-V5 ] ───❍\n│ ⚠️ WARNING সিস্টেম ⚠️\n├── • • • • • • • • • • • • •\n│ 👤 টার্গেট: ${name}\n│ 📊 বর্তমান: ${count}/3\n├── • • • • • • • • • • • • •\n│ অতিরিক্ত বাল পাকনামির কারণে আপনাকে\n│ ${count}টি Warning দেয়া হলো।\n│ এখনো সময় আছে, ভালো হয়ে যান!\n╰─────────────────────❍`, threadID);
 }
 saveWarnings(warningData);
 },

 onStart: async function (api, event, args) {
 const { threadID, messageID } = event;
 const action = args[0]?.toLowerCase();
 let config = loadConfig();

 if (action === "list") {
 const warningData = loadWarnings();
 const threadWarns = warningData[threadID];
 if (!threadWarns || Object.keys(threadWarns).length === 0) return api.sendMessage("╭─── [ SAEEM-BOT-V5 ] ───❍\n│ ✅ কোনো Active Warning নেই।\n╰────────────────────❍", threadID, messageID);
 let msg = "╭─── [ ACTIVE WARNINGS ] ───❍\n";
 for (const uID in threadWarns) msg += `│ 👤 UID: ${uID} | Warn: ${threadWarns[uID]}/3\n`;
 return api.sendMessage(msg + "╰────────────────────❍", threadID, messageID);
 }

 if (action === "remove" || action === "unban") {
 const targetID = args[1] || (event.messageReply ? event.messageReply.senderID : null);
 if (!targetID) return api.sendMessage("❌ কাকে Unban করবেন? ID বা রিপ্লাই দিন।", threadID, messageID);
 if (config.ACCESS_CONTROL?.BANNED_USERS?.includes(targetID)) {
 config.ACCESS_CONTROL.BANNED_USERS = config.ACCESS_CONTROL.BANNED_USERS.filter(id => id !== targetID);
 saveConfig(config);
 return api.sendMessage(`✅ [ ${targetID} ] কে সফলভাবে Unban করা হয়েছে।`, threadID, messageID);
 }
 return api.sendMessage("❌ এই ইউজার ব্যান লিস্টে নেই।", threadID, messageID);
 }

 api.sendMessage("╭─── [ SAEEM-BOT-V5 ] ───❍\n│ 🤖 কমান্ডসমূহ:\n│ 📌 $warn list\n│ 📌 $warn remove [UID/Reply]\n╰─────────────────────❍", threadID, messageID);
 }
};
