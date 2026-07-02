const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

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

module.exports.config = {
    name: "kiss2",
    aliases: ["k2"],
    version: "5.0.0",
    credit: "MOHAMMAD BADOL",
    role: 0,
    prefix: true,
    cooldown: 5,
    description: "Anime Kiss Effect",
    category: "love"
};

module.exports.onStart = async function (api, event, args) {

    const {
        threadID,
        messageID,
        messageReply,
        mentions,
        senderID
    } = event;

    let targetID;

    if (messageReply) {
        targetID = messageReply.senderID;
    } else if (Object.keys(mentions).length) {
        targetID = Object.keys(mentions)[0];
    } else if (args[0]) {
        targetID = args[0];
    }

    if (!targetID) {
        return api.sendMessage(
`╭━━━━━━━━━━━━━━━━━━━╮
┃ 💋 𝐊𝐈𝐒𝐒𝟐 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 💋 ┃
╰━━━━━━━━━━━━━━━━━━━╯

📌 Usage:

• $kiss2 @mention
• Reply + $kiss2
• $kiss2 UID

━━━━━━━━━━━━━━━━━━━
🤖 𝐒𝐀𝐄𝐄𝐌-𝐁𝐎𝐓-𝐕𝟓`,
            threadID,
            messageID
        );
    }

    try {

        const senderInfo = await api.getUserInfo(senderID);
        const targetInfo = await api.getUserInfo(targetID);

        const senderName =
            senderInfo[senderID]?.name || "User";

        const targetName =
            targetInfo[targetID]?.name || "User";

        const baseURL = await getBaseURL();

        if (!baseURL) {
            return api.sendMessage(
                "❌ API Server Offline.",
                threadID,
                messageID
            );
        }

        const url =
            `${baseURL}/api/dig?type=kiss&user=${senderID}&user2=${targetID}`;

        const response = await axios.get(url, {
            responseType: "arraybuffer"
        });

        const imgPath = path.join(
            __dirname,
            `kiss2_${Date.now()}.png`
        );

        fs.writeFileSync(imgPath, response.data);

        await api.sendMessage(
            {
                body:
`╭━━━━━━━━━━━━━━━━━━━╮
┃ 💋 𝐊𝐈𝐒𝐒 𝐄𝐅𝐅𝐄𝐂𝐓 💋 ┃
╰━━━━━━━━━━━━━━━━━━━╯

❤️ ${senderName}

💋 Kissed

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
            `╭━━━━━━━━━━━━━━━━━━━╮
┃ ❌ 𝐄𝐑𝐑𝐎𝐑 ❌ ┃
╰━━━━━━━━━━━━━━━━━━━╯

Kiss Effect Generate Failed!

━━━━━━━━━━━━━━━━━━━
🤖 𝐒𝐀𝐄𝐄𝐌-𝐁𝐎𝐓-𝐕𝟓`,
            threadID,
            messageID
        );
    }
};
