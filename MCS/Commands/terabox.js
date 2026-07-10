const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "terabox",
    version: "1.0.0",
    role: 0,
    credit: "MOHAMMAD BADOL",
    description: "Random video from Terabox",
    prefix: true,
    cooldown: 5
};

module.exports.onStart = async function(api, event, args) {
    // পাথ চেক (আপনার ফোল্ডার স্ট্রাকচার অনুযায়ী)
    const jsonPath = path.join(__dirname, "B4D9L/terabox.json");
    
    // মেইন ফাইল থেকে প্যারামিটারগুলো সঠিকভাবে রিসিভ করার জন্য চেক
    // যদি api বা event না থাকে তবে ফাংশনটি কাজ করবে না
    if (!api || !event) {
        console.error("Critical Error: Missing API or Event object in terabox.js");
        return;
    }

    if (!fs.existsSync(jsonPath)) {
        return api.sendMessage("┏━━━━━━━━━━━━━━━┓\n┃ ⚠️  TERABOX.JSON ┃\n┗━━━━━━━━━━━━━━━┛\nFile not found in B4D9L folder!", event.threadID);
    }

    try {
        const jsonData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
        
        if (!Array.isArray(jsonData) || jsonData.length === 0) {
            return api.sendMessage("┏━━━━━━━━━━━━━━━┓\n┃ ❌  ERROR DATA ┃\n┗━━━━━━━━━━━━━━━┛\nJSON file is empty or invalid format!", event.threadID);
        }

        const video = jsonData[Math.floor(Math.random() * jsonData.length)];
        const cacheDir = path.join(__dirname, "../../cache");
        
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }
        
        const filePath = path.join(cacheDir, `terabox_${Date.now()}.mp4`);

        // ভিডিও ডাউনলোড
        const response = await axios.get(video.url, { responseType: "arraybuffer", timeout: 15000 });
        fs.writeFileSync(filePath, Buffer.from(response.data));

        // ভিডিও পাঠানো
        return api.sendMessage({
            body: `╔══════════════════╗\n` +
                  `║  🎬 SAEEM-BOT-V5  ║\n` +
                  `╚══════════════════╝\n` +
                  `🔹 Video ID: #${video.id}\n` +
                  `🔹 Status: Success`,
            attachment: fs.createReadStream(filePath)
        }, event.threadID, () => {
            try { 
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath); 
            } catch(e) {}
        });

    } catch (e) {
        console.error("Terabox Execution Error:", e);
        return api.sendMessage("┏━━━━━━━━━━━━━━━┓\n┃ ❌  EXECUTION ┃\n┗━━━━━━━━━━━━━━━┛\nFailed to send video!", event.threadID);
    }
};
