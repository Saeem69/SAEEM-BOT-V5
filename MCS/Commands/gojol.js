"use strict";

const fs = require("fs-extra");
const path = require("path");
const request = require("request");

module.exports.config = {
    name: "gojol",
    aliases: ["gazal", "islamic"],
    version: "5.0.0",
    credit: "MOHAMMAD BADOL",
    role: 0,
    prefix: true,
    cooldown: 5,
    description: "Random Islamic Gojol",
    category: "media"
};

module.exports.onStart = async function (api, event) {

    const { threadID, messageID } = event;

    try {

        const cacheDir = path.join(__dirname, "cache");

        if (!fs.existsSync(cacheDir))
            fs.mkdirSync(cacheDir, { recursive: true });

        const filePath = path.join(cacheDir, "gojol.mp3");

        const captions = [
            "🌸 ইসলামিক গজল\n🎧 Best Experience With Headphones",
            "🕌 সুন্দর একটি ইসলামিক গজল\n🤍 আল্লাহ আমাদের সবাইকে হেদায়েত দান করুন।",
            "🤲 Islamic Gojol\n💚 Listen & Feel Peace.",
            "☪️ হৃদয় ছুঁয়ে যাওয়া ইসলামিক গজল।"
        ];

        const body =
            captions[Math.floor(Math.random() * captions.length)];

        const links = [

"https://drive.google.com/uc?id=1xjyq3BrlW3bGrp8y7eedQSuddCbdvLMN",
"https://drive.google.com/uc?id=1ySwrEG6xVqPdY5BcBP8I3YFCUOX4jV9e",
"https://drive.google.com/uc?id=1xnht0PdBt9DnLGzW7GmJUTsTIJnxxByo",
"https://drive.google.com/uc?id=1yHB48N_wPJnU5uV18KMZOLNqo5NE7L4W",
"https://drive.google.com/uc?id=1xpwuubDL_ebjKJhujb-Ee-FikUF92oF6",
"https://drive.google.com/uc?id=1yK0A3lyIJoPRp6g3UjNrC31n0yLfc1Ht",
"https://drive.google.com/uc?id=1xrwhHLhsdKVAn_9umLfUysCt0S2v5QWe",
"https://drive.google.com/uc?id=1yKwewV-oYbn57lGnlACykSD-yt8fOsfT",
"https://drive.google.com/uc?id=1xulSi_qyJA47sF9rC9BUIPyBqh47t9Ls",
"https://drive.google.com/uc?id=1y-PIYYziv-m8QRwmMBWCTl2wzuH8NpYJ",
"https://drive.google.com/uc?id=1y0wV96m-notKVHnuNdF8xVCWiockSiME",
"https://drive.google.com/uc?id=1xxMQnp-9-4BoLrGpReps93JQv4k8WUOP"

        ];

        const random =
            links[Math.floor(Math.random() * links.length)];

        request(encodeURI(random))
            .pipe(fs.createWriteStream(filePath))
            .on("close", () => {
                api.sendMessage(
                    {
                        body:
`╭━━━━━━━━━━━━━━━━━━╮
┃ 🕌 𝐈𝐒𝐋𝐀𝐌𝐈𝐂 𝐆𝐎𝐉𝐎𝐋
╰━━━━━━━━━━━━━━━━━━╯

${body}

🎵 𝐑𝐀𝐍𝐃𝐎𝐌 𝐆𝐎𝐉𝐎𝐋 : ${links.length}

━━━━━━━━━━━━━━━━━━
𝄞⋆⃝🧚𝐒𝐀𝐄𝐄𝐌-𝐁𝐎𝐓-𝐕𝟓🧚‍⋆⃝𝄞`,
                        attachment: fs.createReadStream(filePath)
                    },
                    threadID,
                    () => {
                        if (fs.existsSync(filePath))
                            fs.unlinkSync(filePath);
                    },
                    messageID
                );

            });

    } catch (err) {

        console.log("[GOJOL ERROR]", err);

        return api.sendMessage(
`╭━━━━━━━━━━━━━━━━━━╮
┃ ❌ 𝐆𝐎𝐉𝐎𝐋 𝐄𝐑𝐑𝐎𝐑
╰━━━━━━━━━━━━━━━━━━╯

${err.message}

━━━━━━━━━━━━━━━━━━
𝄞⋆⃝🧚𝐒𝐀𝐄𝐄𝐌-𝐁𝐎𝐓-𝐕𝟓🧚‍⋆⃝𝄞`,
            threadID,
            messageID
        );

    }

};
