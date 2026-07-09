const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");

const DATA_PATH = path.join(__dirname, "B4D9L/gali.json");
const DB_PATH = path.join(__dirname, "B4D9L/antigali_db.json");

const getBadWordsPattern = () => {
  if (!fs.existsSync(DATA_PATH)) return null;
  const { unique_words } = fs.readJsonSync(DATA_PATH);
  const pattern = unique_words
    .map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');
  return new RegExp(`(?<!\\p{L})(${pattern})(?!\\p{L})`, 'iu');
};

module.exports = {
  config: {
    name: "antigali",
    aliases: ["nogali", "gali", "antibadword"],
    version: "2.5.0",
    role: 1,
    cooldown: 5,
    prefix: true,
    credit: "MOHAMMAD BADOL",
    description: "Group gali not allow & warning",
    usage: "$antigali [on/off]",
    category: "moderation"
  },
  
  async onStart(api, event, args) {
    const dbDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
    
    let db = fs.existsSync(DB_PATH) ? fs.readJsonSync(DB_PATH) : {};
    const option = args[0]?.toLowerCase();
    
    let loadingMsg = await api.sendMessage("🔄 [▒▒▒▒▒▒] 0%", event.threadID);
    
    const updateBar = async (percent, status) => {
      const filled = Math.floor(percent / 10);
      const bar = "█".repeat(filled) + "▒".repeat(10 - filled);
      try {
        await api.editMessage(`⚡ [${bar}] ${percent}% (${status})`, loadingMsg.messageID);
      } catch (e) {}
    };
    
    if (!["on", "off"].includes(option)) {
      await updateBar(100, "Error");
      await new Promise(r => setTimeout(r, 500));
      try { await api.unsendMessage(loadingMsg.messageID); } catch (e) {}
      return api.sendMessage("╭━─━─━❮ ⚠️ ❯━─━─━╮\n├‣ ব্যবহার: $antigali [on/off]\n├‣ Aliases: nogali, gali\n├━─━─━━──━─━─━\n├‣ SAEEM-BOT-V5 \n╰━──━─━─━━─━─━❍", event.threadID);
    }
    
    await updateBar(50, "Processing");
    await new Promise(r => setTimeout(r, 300));
    
    db[event.threadID] = (option === "on");
    fs.writeJsonSync(DB_PATH, db, { spaces: 2 });
    
    await updateBar(100, "Complete");
    await new Promise(r => setTimeout(r, 500));
    
    try { await api.unsendMessage(loadingMsg.messageID); } catch (e) {}
    
    const statusText = option === "on" ? "🟢 On Done" : "🔴 Off Done";
    api.sendMessage(`╭━─━─━❮ ✅ ❯━─━─━╮\n├‣ 🎉 SUCCESSFUL! 🎉\n├━─━─━━──━─━─━\n├‣ Anti-Gali System Now:\n├‣ ${statusText}\n├━─━─━━──━─━─━\n├‣ SAEEM-BOT-V5 \n╰━──━─━─━━─━─━❍`, event.threadID);
  },
  
  async onChat(api, event) {
    if (!fs.existsSync(DB_PATH)) return;
    let db = fs.readJsonSync(DB_PATH);
    if (!db[event.threadID] || !event.body) return;
    
    const badWordsRegex = getBadWordsPattern();
    if (!badWordsRegex) return;
    
    const match = event.body.match(badWordsRegex);
    if (match) {
      const detectedWord = match[0];
      const cacheDir = path.join(__dirname, "../../cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
      
      const cachePath = path.join(cacheDir, `warn_${event.senderID}_${Date.now()}.png`);
      const avatarUrl = `https://graph.facebook.com/${event.senderID}/picture?width=720&height=720&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;
      
      try {
        const imageBuffer = (await axios.get(avatarUrl, { responseType: 'arraybuffer' })).data;
        const image = await loadImage(imageBuffer);
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');
        
        ctx.drawImage(image, 0, 0);
        
        const centerX = image.width / 2;
        const centerY = image.height / 2;
        
        // লাইন ১: WARNING - বড় সাইজ
        ctx.fillStyle = "red";
        ctx.font = "bold 70px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 8;
        ctx.strokeText("🔞 WARNING 🚫", centerX, centerY - 60);
        ctx.fillText("🔞 WARNING 🚫", centerX, centerY - 60);
        
        // লাইন ২: SAEEM-BOT-V5 - ছোট সাইজ
        ctx.fillStyle = "white";
        ctx.font = "bold 60px Arial";
        ctx.lineWidth = 6;
        ctx.strokeText("SAEEM-BOT-V5", centerX, centerY + 80);
        ctx.fillText("SAEEM-BOT-V5", centerX, centerY + 80);
        
        fs.writeFileSync(cachePath, canvas.toBuffer());
        
        const userInfo = await api.getUserInfo(event.senderID);
        const userName = userInfo[event.senderID]?.name || "ব্যবহারকারী";
        
        await api.sendMessage({
          body: `╭─⚠️ [ WARNING ] ─╮\n│ অশালীন ভাষা নিষিদ্ধ!\n├‣ শব্দ: "${detectedWord}"\n╰───────────────╯\n👤 ব্যবহারকারী: ${userName}`,
          attachment: fs.createReadStream(cachePath)
        }, event.threadID, event.messageID);
        
        setTimeout(() => { if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath); }, 5000);
      } catch (err) {
        api.sendMessage(`⚠️ অশালীন ভাষা ব্যবহার নিষিদ্ধ!\nশব্দ: "${detectedWord}"`, event.threadID);
      }
    }
  }
};
