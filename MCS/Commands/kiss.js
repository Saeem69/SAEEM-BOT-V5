const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "kiss",
    aliases: ["k"],
    version: "5.0.0",
    credit: "MOHAMMAD BADOL",
    role: 0,
    prefix: true,
    cooldown: 5,
    description: "Anime Kiss Image Generator",
    category: "love"
};

async function getBaseURL() {
    try {
        const res = await axios.get(
            "https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json"
        );
        return res.data.mahmud;
    } catch {
        return null;
    }
}

module.exports.onStart = async function (api, event) {

    const { threadID, messageID, senderID, mentions } = event;

    const targetID = Object.keys(mentions)[0];

    if (!targetID) {
        return api.sendMessage(
            "💋 | একজনকে মেনশন করুন।\n\nExample:\n$kiss @user",
            threadID,
            messageID
        );
    }

    try {

        const senderInfo = await api.getUserInfo(senderID);
        const targetInfo = await api.getUserInfo(targetID);

        const senderName = senderInfo[senderID]?.name || "User";
        const targetName = targetInfo[targetID]?.name || "User";

        const baseURL = await getBaseURL();

        if (!baseURL) {
            return api.sendMessage(
                "❌ API Server বর্তমানে Offline.",
                threadID,
                messageID
            );
        }

        const response = await axios.post(
            `${baseURL}/api/kiss`,
            {
                senderID,
                targetID
            },
            {
                responseType: "arraybuffer"
            }
        );

        const imgPath = path.join(
            __dirname,
            `kiss_${Date.now()}.png`
        );

        fs.writeFileSync(imgPath, response.data);

        await api.sendMessage(
            {
                body:
`╭━━━━━━━━━━━━━━━━━━━╮
┃ 💋 𝐊𝐈𝐒𝐒 𝐒𝐔𝐂𝐂𝐄𝐒𝐒 💋 ┃
╰━━━━━━━━━━━━━━━━━━━╯

❤️ ${senderName}
💋 kissed
💖 ${targetName}

━━━━━━━━━━━━━━━━━━━
🤖 𝐒𝐀𝐄𝐄𝐌-𝐁𝐎𝐓-𝐕𝟓`,
                attachment: fs.createReadStream(imgPath)
            },
            threadID,
            () => {
                if (fs.existsSync(imgPath))
                    fs.unlinkSync(imgPath);
            },
            messageID
        );

    } catch (err) {
        console.log(err);

        api.sendMessage(
            "❌ Kiss Image Generate করতে সমস্যা হয়েছে!",
            threadID,
            messageID
        );
    }
};
