const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
    config: {
        name: "emojireply",
        version: "1.0.0",
        credit: "MOHAMMAD BADOL",
        role: 0,
        description: "ইমোজি রিঅ্যাক্ট করলে ভয়েস রিপ্লাই"
    },

    onChat: async function (api, event) {
        if (!event.body) return;

        // আপনার নতুন ডাটা লিস্ট
        const emojiData = {
            "🥱": "https://files.catbox.moe/9pou40.mp3",
            "😁": "https://files.catbox.moe/60cwcg.mp3",
            "😌": "https://files.catbox.moe/epqwbx.mp3",
            "🥺": "https://files.catbox.moe/wc17iq.mp3",
            "🤭": "https://files.catbox.moe/cu0mpy.mp3",
            "😅": "https://files.catbox.moe/jl3pzb.mp3",
            "😏": "https://files.catbox.moe/z9e52r.mp3",
            "😞": "https://files.catbox.moe/tdimtx.mp3",
            "🤫": "https://files.catbox.moe/0uii99.mp3",
            "🍼": "https://files.catbox.moe/p6ht91.mp3",
            "🤔": "https://files.catbox.moe/hy6m6w.mp3",
            "🥰": "https://files.catbox.moe/dv9why.mp3",
            "🤦": "https://files.catbox.moe/ivlvoq.mp3",
            "😘": "https://files.catbox.moe/sbws0w.mp3",
            "😑": "https://files.catbox.moe/p78xfw.mp3",
            "😢": "https://files.catbox.moe/shxwj1.mp3",
            "🙊": "https://files.catbox.moe/3bejxv.mp3",
            "🤨": "https://files.catbox.moe/4aci0r.mp3",
            "😡": "https://files.catbox.moe/shxwj1.mp3",
            "🙈": "https://files.catbox.moe/3qc90y.mp3",
            "😍": "https://files.catbox.moe/qjfk1b.mp3",
            "😭": "https://files.catbox.moe/itm4g0.mp3",
            "😱": "https://files.catbox.moe/mu0kka.mp3",
            "😻": "https://files.catbox.moe/y8ul2j.mp3",
            "😿": "https://files.catbox.moe/tqxemm.mp3",
            "💔": "https://files.catbox.moe/6yanv3.mp3",
            "🤣": "https://files.catbox.moe/2sweut.mp3",
            "🥹": "https://files.catbox.moe/jf85xe.mp3",
            "😩": "https://files.catbox.moe/b4m5aj.mp3",
            "🫣": "https://files.catbox.moe/ttb6hi.mp3",
            "🐸": "https://files.catbox.moe/utl83s.mp3"
        };

        // মেসেজে ইমোজি আছে কি না চেক করা
        const matchEmoji = Object.keys(emojiData).find(emoji => event.body.includes(emoji));

        if (matchEmoji) {
            const audioUrl = emojiData[matchEmoji];
            const filePath = path.join(__dirname, `../../cache/${Date.now()}.mp3`);

            try {
                const response = await axios.get(audioUrl, { responseType: "arraybuffer" });
                fs.writeFileSync(filePath, Buffer.from(response.data));

                api.sendMessage({
                    attachment: fs.createReadStream(filePath)
                }, event.threadID, () => {
                    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                }, event.messageID);
            } catch (err) {
                console.error("AutoReply Error:", err);
            }
        }
    }
};
