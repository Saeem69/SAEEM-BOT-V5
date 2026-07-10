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
      "https://drive.google.com/uc?id=11EGibqXhuQyECaRnG7iCO_Ke_ldDWx1k",
      "https://drive.google.com/uc?id=155KW20eYEAHiK2LO0EtiYu5w5gKR3La3",
      "https://drive.google.com/uc?id=1BSrtJdFYzdCtoDedFH-6J4K6rH3MyPuj",
      "https://drive.google.com/uc?id=1TzIQC9w4BwOVs3kh8ZVkYRWBSLj14V3z",
      "https://drive.google.com/uc?id=1vtAcNumV19nDoNgfHP-y_i-Bo-B2Vo7G",
      "https://drive.google.com/uc?id=198DJ7IPrKDM1mDQDxE9n4yBBHfEnMn96",
      "https://drive.google.com/uc?id=1mx2O4RaeQ7vhGXyYX0Iyjm2_EVtf9hX8",
      "https://drive.google.com/uc?id=1j6h3gWqLjv99hJeNWKUAHA_H0LEmPqSg",
      "https://drive.google.com/uc?id=1lxghPstx3v0H5NE31GKjmYBb8r8RS9-2"
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
`╭━〔 🖤 𝗪𝗘𝗗𝗡𝗘𝗦𝗗𝗔𝗬 🖤 〕━╮
┃
┃ 🕸️ Stay Mysterious...
┃ ✨ Enjoy The Dark Aesthetic
┃ 🎬 Random Wednesday Video
┃
┣━━━━━━━━━━━━━━━━━━━━
┃ 👤 Requested By :
┃ ${event.senderID}
┃
┃ 🤖 CREDIT BY SAEEM-BOT-V5
┃
╰━━━━━━━━━━━━━━━━━━━╯`,
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
