"use strict";

const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports.config = {
    name: "random",
    aliases: ["rndvideo", "mixvideo"],
    version: "5.0.0",
    credit: "MOHAMMAD BADOL",
    role: 0,
    prefix: true,
    cooldown: 30,
    description: "Random Mixed Video",
    category: "random-video"
};

module.exports.onStart = async function (api, event) {

    try {

        const { threadID, messageID } = event;

        const cacheDir = path.join(__dirname, "cache");

        if (!fs.existsSync(cacheDir))
            fs.mkdirSync(cacheDir, { recursive: true });

        const videoPath = path.join(cacheDir, "random.mp4");

        const apiData = await axios.get(
            "https://raw.githubusercontent.com/shaonproject/Shaon/main/api.json"
        );

        const BASE_API = apiData.data.api;

        const videoList = [

            `${BASE_API}/video/status`,
            `${BASE_API}/video/sad`,
            `${BASE_API}/video/baby`,
            `${BASE_API}/video/love`,
            `${BASE_API}/video/ff`,
            `${BASE_API}/video/shairi`,
            `${BASE_API}/video/humaiyun`,
            `${BASE_API}/video/islam`,
            `${BASE_API}/video/anime`,
            `${BASE_API}/video/short`,
            `${BASE_API}/video/event`,
            `${BASE_API}/video/prefix`,
            `${BASE_API}/video/cpl`,
            `${BASE_API}/video/time`,
            `${BASE_API}/video/lofi`,
            `${BASE_API}/video/happy`

        ];

        const randomAPI =
            videoList[Math.floor(Math.random() * videoList.length)];

        const res = await axios.get(randomAPI);

            const videoURL = res.data.data;
        const totalVideo = res.data.count || "Unknown";
        const category = res.data.shaon || "Random";

        request(videoURL)
            .pipe(fs.createWriteStream(videoPath))
            .on("close", () => {

                api.sendMessage(
                    {
                        body:
`╭━━━━━━━━━━━━━━━━━━╮
┃ 🎬 𝐑𝐀𝐍𝐃𝐎𝐌 𝐕𝐈𝐃𝐄𝐎
╰━━━━━━━━━━━━━━━━━━╯

📂 𝐂𝐀𝐓𝐄𝐆𝐎𝐑𝐘 : ${category}
📹 𝐓𝐎𝐓𝐀𝐋 𝐕𝐈𝐃𝐄𝐎 : ${totalVideo}

✨ 𝐄𝐍𝐉𝐎𝐘 𝐘𝐎𝐔𝐑 𝐑𝐀𝐍𝐃𝐎𝐌 𝐕𝐈𝐃𝐄𝐎.
━━━━━━━━━━━━━━━━━━
𝄞⋆⃝🧚𝐒𝐀𝐄𝐄𝐌-𝐁𝐎𝐓-𝐕𝟓🧚‍⋆⃝𝄞`,
                        attachment: fs.createReadStream(videoPath)
                    },
                    threadID,
                    () => {
                        if (fs.existsSync(videoPath))
                            fs.unlinkSync(videoPath);
                    },
                    messageID
                );

            });

    } catch (err) {

        console.log("[RANDOM VIDEO ERROR]", err);

        return api.sendMessage(
`╭━━━━━━━━━━━━━━━━━━╮
┃ ❌ 𝐑𝐀𝐍𝐃𝐎𝐌 𝐄𝐑𝐑𝐎𝐑
╰━━━━━━━━━━━━━━━━━━╯

⚠️ ${err.message}

━━━━━━━━━━━━━━━━━━
𝄞⋆⃝🧚𝐒𝐀𝐄𝐄𝐌-𝐁𝐎𝐓-𝐕𝟓🧚‍⋆⃝𝄞`,
            event.threadID,
            event.messageID
        );

    }

};
