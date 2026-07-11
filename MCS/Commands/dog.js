const axios = require("axios");
const request = require("request");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "dog",
    aliases: ["dogpic", "puppy"],
    version: "1.0.0",
    credit: "MOHAMMAD BADOL",
    role: 0,
    prefix: false,
    cooldown: 3,
    description: "Random Dog Picture",
    category: "image"
  },

  onStart: async function (api, event) {
    const { threadID, messageID } = event;

    const cacheDir = path.join(__dirname, "cache");
    await fs.ensureDir(cacheDir);

    try {
      api.setMessageReaction("⏳", messageID, () => {}, true);

      const res = await axios.get("https://nekos.life/api/v2/img/woof");

      const imageUrl = res.data.url;
      const ext = imageUrl.split(".").pop().split("?")[0];
      const filePath = path.join(cacheDir, `dog_${Date.now()}.${ext}`);

      request(imageUrl)
        .pipe(fs.createWriteStream(filePath))
        .on("close", () => {

          api.setMessageReaction("🐶", messageID, () => {}, true);

          const caption = `
╭━━━━━━━━━━━━━━━━━━━╮
┃          🐶 𝗗𝗢𝗚 🐶
┣━━━━━━━━━━━━━━━━━━━┫
┃ 🦴 𝗥𝗮𝗻𝗱𝗼𝗺 𝗗𝗼𝗴 𝗣𝗶𝗰𝘁𝘂𝗿𝗲
┃ 📸 𝗛𝗗 𝗜𝗺𝗮𝗴𝗲
┣━━━━━━━━━━━━━━━━━━━┫
┃ 🤖 𝗕𝗢𝗧 : 𝗦𝗔𝗘𝗘𝗠-𝗕𝗢𝗧-𝗩𝟱
┃ 👑 𝗢𝗪𝗡𝗘𝗥 : 𝗦𝗔𝗘𝗘𝗠 𝗦𝗛𝗘𝗜𝗞𝗛
┣━━━━━━━━━━━━━━━━━━━┫
┃ ❤️ 𝗘𝗻𝗷𝗼𝘆 𝗬𝗼𝘂𝗿 𝗣𝗶𝗰𝘁𝘂𝗿𝗲
╰━━━━━━━━━━━━━━━━━━━╯`;

          api.sendMessage(
            {
              body: caption,
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
      console.log(err);

      api.setMessageReaction("❌", messageID, () => {}, true);

      api.sendMessage(
        "❌ Failed to fetch dog picture. Please try again later.",
        threadID,
        messageID
      );
    }
  }
};
