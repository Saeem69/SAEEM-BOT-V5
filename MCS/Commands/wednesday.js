const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "wednesday",
    aliases: ["wed"],
    version: "1.0.0",
    credit: "MOHAMMAD BADOL",
    role: 0,
    prefix: false,
    cooldown: 5,
    description: "Random Wednesday Video",
    category: "video"
  },

  onStart: async function (api, event) {

    const { threadID, messageID } = event;

    // ==========================
    // 🎥 Wednesday Video Links
    // ==========================

    const videos = [
      "https://drive.google.com/uc?id=11EGibqXhuQyECaRnG7iCO_Ke_ldDWx1k"
    ];

    const VIDEO_URL =
      videos[Math.floor(Math.random() * videos.length)];

    const cache = path.join(__dirname, "cache");
    await fs.ensureDir(cache);

    const filePath = path.join(
      cache,
      `wednesday_${Date.now()}.mp4`
    );

    try {

      api.setMessageReaction("⏳", messageID, () => {}, true);

      const response = await axios({
        url: VIDEO_URL,
        method: "GET",
        responseType: "stream"
      });

      const writer = fs.createWriteStream(filePath);

      response.data.pipe(writer);

      writer.on("finish", () => {

        api.setMessageReaction("🖤", messageID, () => {}, true);

        api.sendMessage(
          {
            body:
`╭━━━━━━━━━━━━━━━━━━━━━━╮
┃      🖤 𝗪𝗘𝗗𝗡𝗘𝗦𝗗𝗔𝗬 🖤
╰━━━━━━━━━━━━━━━━━━━━━━╯

🎬 𝗥𝗮𝗻𝗱𝗼𝗺 𝗪𝗲𝗱𝗻𝗲𝘀𝗱𝗮𝘆 𝗩𝗶𝗱𝗲𝗼

━━━━━━━━━━━━━━━━━━

🕷️ Dark • Gothic • Mystery

🌙 Keep Calm...
🖤 Stay Different...
✨ Enjoy The Video...

━━━━━━━━━━━━━━━━━━

🤖 Powered By
💀 SAEEM-BOT-V5

👑 Owner : SAEEM SHEIKH 

━━━━━━━━━━━━━━━━━━
❤️ Thanks For Using My Bot ❤️`,
            attachment: fs.createReadStream(filePath)
          },
          threadID,
          () => {
            fs.remove(filePath);
          },
          messageID
        );

      });

      writer.on("error", () => {

        api.setMessageReaction("❌", messageID, () => {}, true);

        api.sendMessage(
          "❌ Failed To Download Video.",
          threadID,
          messageID
        );

      });

    } catch (err) {

      console.log(err);

      api.setMessageReaction("❌", messageID, () => {}, true);

      api.sendMessage(
        "❌ Unable To Load Video.",
        threadID,
        messageID
      );

    }

  }

};
