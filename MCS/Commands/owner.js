"use strict";

const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "owner",
    aliases: ["owner", "developer"],
    version: "5.0.0",
    credit: "MOHAMMAD BADOL",
    role: 0,
    prefix: true,
    cooldown: 5,
    description: "Show Bot Owner Information",
    category: "system"
};

module.exports.onStart = async function (api, event) {

    const { threadID, messageID } = event;

    try {

        const cacheDir = path.join(__dirname, "cache");

        if (!fs.existsSync(cacheDir))
            fs.mkdirSync(cacheDir, { recursive: true });

        const imgPath = path.join(cacheDir, "admin.png");

        const img = await axios.get(
            "https://graph.facebook.com/100022291393952/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662",
            { responseType: "arraybuffer" }
        );

        fs.writeFileSync(imgPath, img.data);

        api.sendMessage(
            {
                body: `╭━━━━━━━━━━━━━━━━━━━╮
┃     𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗧𝗜𝗢𝗡
╰━━━━━━━━━━━━━━━━━━━╯

👤 𝗔𝗗𝗠𝗜𝗡 : 𝗦𝗔𝗘𝗘𝗠 𝗦𝗛𝗘𝗜𝗞𝗛
🏠 𝗔𝗗𝗗𝗥𝗘𝗦𝗦 : 𝗕𝗔𝗡𝗚𝗟𝗔𝗗𝗘𝗦𝗛

━━━━━━━━━━━━━━━━━━━━
📞 𝗖𝗢𝗡𝗧𝗔𝗖𝗧 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗧𝗜𝗢𝗡
━━━━━━━━━━━━━━━━━━━━

🌐 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞 :
https://www.facebook.com/share/18bJMPizgD/

💬 𝗠𝗔𝗦𝗦𝗔𝗚𝗘𝗥 :
https://m.me/saeem.sheikh2.0

━━━━━━━━━━━━━━━━━━━━
💙 𝗧𝗛𝗔𝗡𝗞𝗦 𝗙𝗢𝗥 𝗨𝗦𝗜𝗡𝗚 
𝗦𝗔𝗘𝗘𝗠-𝗕𝗢𝗧-𝗩𝟱`,
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
            `❌ ADMIN COMMAND ERROR\n\n${err.message}`,
            threadID,
            messageID
        );
    }
};
