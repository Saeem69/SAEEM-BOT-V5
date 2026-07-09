const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "sizuka",
  aliases: ["waifu", "neko"],
  version: "2.0.0",
  credit: "MOHAMMAD BADOL",
  role: 0,
  prefix: true,
  cooldown: 5,
  description: "Random sizuka Images",
  category: "sizuka"
};

module.exports.onStart = async function (api, event, args) {

  const category = (args[0] || "waifu").toLowerCase();

  const validCategories = [
    "waifu",
    "neko",
    "hug",
    "kiss",
    "pat",
    "poke",
    "slap",
    "tickle",
    "kick",
    "cuddle",
    "feed",
    "smile",
    "wave",
    "wink",
    "highfive",
    "handhold",
    "bite",
    "nom",
    "yeet",
    "blush",
    "happy",
    "cry",
    "dance"
  ];

  if (!validCategories.includes(category)) {
    return api.sendMessage(
`╭──〔 ❌ INVALID CATEGORY 〕──╮
│ Available:
│ ${validCategories.join(", ")}
╰──────────────────────────╯`,
      event.threadID,
      event.messageID
    );
  }

  api.setMessageReaction("⏳", event.messageID, () => {}, true);

  try {

    const res = await axios.get(
      `https://nekos.best/api/v2/${category}`,
      {
        timeout: 30000
      }
    );

    if (!res.data.results || !res.data.results.length) {
      throw new Error("No image received.");
    }

    const imageUrl = res.data.results[0].url;

    const cache = path.join(__dirname, "cache");
    await fs.ensureDir(cache);

    const imgPath = path.join(cache, `${category}_${Date.now()}.jpg`);

    const img = await axios({
      url: imageUrl,
      method: "GET",
      responseType: "stream"
    });

    const writer = fs.createWriteStream(imgPath);

    img.data.pipe(writer);

    writer.on("finish", () => {

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      api.sendMessage(
        {
          body:
`╭━━〔 𝗦𝗔𝗘𝗘𝗠-𝗕𝗢𝗧-𝗩𝟱 〕━━╮

🖼 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆 : ${category}

✨ 𝗥𝗮𝗻𝗱𝗼𝗺 𝗦𝗶𝘇𝘂𝗸𝗮 𝗜𝗺𝗮𝗴𝗲

👤 𝗖𝗥𝗘𝗗𝗜𝗧 𝗕𝗬 𝗦𝗔𝗘𝗘𝗠-𝗕𝗢𝗧-𝗩𝟱

╰━━━━━━━━━━━━━━━━━━━╯`,
          attachment: fs.createReadStream(imgPath)
        },
        event.threadID,
        () => {
          if (fs.existsSync(imgPath))
            fs.unlinkSync(imgPath);
        },
        event.messageID
      );

    });

    writer.on("error", () => {
      api.setMessageReaction("❌", event.messageID, () => {}, true);

      api.sendMessage(
        "❌ Failed To Download Image.",
        event.threadID,
        event.messageID
      );
    });

  } catch (err) {

    console.log(err.response?.data || err.message);

    api.setMessageReaction("❌", event.messageID, () => {}, true);

    api.sendMessage(
`╭──〔 ❌ ERROR 〕──╮
│ Failed To Fetch Sizuka Image.
│
│ ${err.message}
╰────────────────╯`,
      event.threadID,
      event.messageID
    );

  }

};
