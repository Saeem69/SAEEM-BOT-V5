const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");

const BAD_WORDS = ["গালি১", "গালি২", "খারাপ শব্দ", "কুত্তা", "শালা"];
const DB_PATH = path.join(__dirname, "../antigali_data.json");

module.exports = {
    config: {
        name: "antigali",
        version: "2.0.0",
        role: 1,
        cooldown: 5,
        prefix: true,
        credit: "MOHAMMAD BADOL"
    },

    async onStart(api, event, args) {
        let data = {};
        if (fs.existsSync(DB_PATH)) {
            try { data = JSON.parse(fs.readFileSync(DB_PATH, "utf-8")); } catch (e) {}
        }
        const option = args[0] ? args[0].toLowerCase() : "";
        if (!["on", "off"].includes(option)) {
            return api.sendMessage("✅ ব্যবহার: /antigali on বা /antigali off", event.threadID);
        }
        data[event.threadID] = (option === "on");
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 4));
        api.sendMessage(`✅ Anti-Gali সিস্টেম এখন এই গ্রুপে: ${option.toUpperCase()}`, event.threadID);
    },

    async onChat(api, event) {
        if (!fs.existsSync(DB_PATH)) return;
        let data = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
        if (!data[event.threadID]) return;

        const message = event.body ? event.body.toLowerCase() : "";
        const isBad = BAD_WORDS.some(word => message.includes(word));

        if (isBad) {
            const cacheDir = path.join(__dirname, "../cache");
            if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
            const cachePath = path.join(cacheDir, `warn_${event.senderID}_${Date.now()}.png`);

            try {
                const userInfo = await api.getUserInfo(event.senderID);
                const userName = userInfo[event.senderID]?.name || "User";
                const avatarUrl = `https://graph.facebook.com/${event.senderID}/picture?width=720&height=720&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;

                // ছবি ডাউনলোড ও ক্যানভাস সেটআপ
                const avatarBuffer = (await axios.get(avatarUrl, { responseType: 'arraybuffer' })).data;
                const image = await loadImage(avatarBuffer);
                const canvas = createCanvas(image.width, image.height);
                const ctx = canvas.getContext('2d');

                // ছবি ড্র
                ctx.drawImage(image, 0, 0);

                // ওয়ার্নিং টেক্সট ড্র
                ctx.fillStyle = "red";
                ctx.strokeStyle = "white";
                ctx.lineWidth = 5;
                ctx.font = "bold 80px Arial";
                ctx.textAlign = "center";
                
                // টেক্সট ব্যাকগ্রাউন্ড ও শ্যাডো
                ctx.shadowColor = "black";
                ctx.shadowBlur = 10;
                ctx.strokeText("🔞 Warning 🚫", image.width / 2, image.height / 2);
                ctx.fillText("🔞 Warning 🚫", image.width / 2, image.height / 2);

                // ফাইল সেভ
                const buffer = canvas.toBuffer("image/png");
                fs.writeFileSync(cachePath, buffer);

                // মেসেজ পাঠানো
                await api.sendMessage({
                    body: `⚠️ ${userName}, অশালীন ভাষা ব্যবহার করা নিষিদ্ধ! এটি আপনার জন্য সতর্কতা।`,
                    attachment: fs.createReadStream(cachePath)
                }, event.threadID, event.messageID);

                // ৫ সেকেন্ড পর ডিলিট
                setTimeout(() => { if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath); }, 5000);

            } catch (err) {
                console.log("[AntiGali Error]", err);
            }
        }
    }
};
