"use strict";

const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "hug",
    aliases: ["embrace"],
    version: "5.0.0",
    credit: "MOHAMMAD BADOL",
    role: 0,
    prefix: true,
    cooldown: 5,
    description: "Anime Hug Image",
    category: "fun"
};

module.exports.onStart = async function (api, event) {

    const { threadID, messageID, mentions, messageReply } = event;

    const targetID =
        messageReply?.senderID ||
        Object.keys(mentions)[0];

    if (!targetID) {
        return api.sendMessage(
            "❌ কাউকে Mention অথবা Reply করুন।",
            threadID,
            messageID
        );
    }

    try {

        const res = await axios.get("https://nekos.best/api/v2/hug");

        const image = res.data.results[0].url;

        const cache = path.join(__dirname, "cache");

        if (!fs.existsSync(cache))
            fs.mkdirSync(cache, { recursive: true });

        const imgPath = path.join(cache, `hug_${Date.now()}.gif`);

        const img = await axios.get(image, {
            responseType: "arraybuffer"
        });

        fs.writeFileSync(imgPath, img.data);

        const captions = [
            "🤗 একটি উষ্ণ আলিঙ্গন তোমার জন্য ❤️",
            "🫂 Hug Delivered Successfully 💖",
            "🥰 ভালোবাসার একটি Hug নাও ❤️",
            "🌸 Sending Virtual Hug...",
            "💞 Stay Happy & Keep Smiling."
        ];

        const caption =
            captions[Math.floor(Math.random() * captions.length)];

        api.sendMessage(
            {
                body: caption,
                attachment: fs.createReadStream(imgPath)
            },
            threadID,
            () => fs.unlinkSync(imgPath),
            messageID
        );

    } catch (err) {

        console.log(err);

        api.sendMessage(
            "❌ Hug API বর্তমানে কাজ করছে না।",
            threadID,
            messageID
        );

    }

};
