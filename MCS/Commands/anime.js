const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "anime",
  aliases: ["animevideo", "anivideo"],
  version: "1.1.0",
  credit: "MOHAMMAD BADOL",
  role: 0,
  prefix: false,
  cooldown: 5,
  description: "Random Anime Video",
  category: "video"
};

module.exports.onStart = async function (api, event, args) {

  const { threadID, messageID } = event;

  if (api.setMessageReaction) {
    api.setMessageReaction("⏳", messageID, () => {}, true);
  }

  const videos = [
    "https://drive.google.com/uc?export=download&id=18-qJqj0yJOe1DnqtKCtt2BA6aL4Lsu1V",
    "https://drive.google.com/uc?export=download&id=18_dfqfqJ7Izv_V39udjqHIhL9VNXJ9g8",
    "https://drive.google.com/uc?export=download&id=1AtMec3fO0qsocLBjbbAealc18pZeC8-3",
    "https://drive.google.com/uc?export=download&id=194QHUiobsj_4gWEnC1vJxQUMZjDz1J97",
    "https://drive.google.com/uc?export=download&id=18f4u2I-yIu6k1oZwurqJqfUlX9m13Yfi",
    "https://drive.google.com/uc?export=download&id=18phpGz_zhEGCOqouvqjrlvN7fOwxPO1S",
    "https://drive.google.com/uc?export=download&id=18SDweGtqRP07XHAZ78mLAJkTo1xg8xyO",
    "https://drive.google.com/uc?export=download&id=19RC6Qb5nfhTsQf3DRswH43jeJbNujk4w",
    "https://drive.google.com/uc?export=download&id=18Uj2jMSvnLcrt_CEt-6aAHcAchp9BZDr",
    "https://drive.google.com/uc?export=download&id=1A6ZnUeVgg_4Tcdk1zUiC7kPurAuCC1G8",
    "https://drive.google.com/uc?export=download&id=17Iz2LT8PksDU_J0oe_7vjxhSZ94rDCB-",
    "https://drive.google.com/uc?export=download&id=17GwnxijuRcwillJdh3j6V1zMwDQYW7sh",
    "https://drive.google.com/uc?export=download&id=18NTG35pSgG62HjcwYStMyqFKyLZZr44-",
    "https://drive.google.com/uc?export=download&id=17sXmHH3SuHjo3vK7WNlhDurfSUYhujpK",
    "https://drive.google.com/uc?export=download&id=18L_R_6WNGHUJecWPfIuTMPNxq-V1EAcQ",
    "https://drive.google.com/uc?export=download&id=18CMe0QbZQMHxVSuFpy6iAKtZ7ln5sBMh",
    "https://drive.google.com/uc?export=download&id=17kgktlBZxMlfY2tDOyhbWAXy9VT7v1hs",
    "https://drive.google.com/uc?export=download&id=17n7w5omJRNZz5Rt-D8Aa_1dy6jvZmObA",
    "https://drive.google.com/uc?export=download&id=17iLYInZF3fvnaPxIrghmZkesoFmTBMgP",
    "https://drive.google.com/uc?export=download&id=1B8eBVs6yEtwjtGqtROznYSR9P4kbVLYV",
    "https://drive.google.com/uc?export=download&id=1ADJiq0rVkJqI2b8CGaaiOW6EOC7gYl0d",
    "https://drive.google.com/uc?export=download&id=1ADjoiJt8uyfuGU9fSTP8CS5WNBRs7Yl3",
    "https://drive.google.com/uc?export=download&id=17VXDfR9FCQadHDaTgxCfZY__GtCGigDc",
    "https://drive.google.com/uc?export=download&id=19ZbhvqxQ9C9wi_ix9ghtrjggDNmbxda5",
    "https://drive.google.com/uc?export=download&id=1BLirFfDf1NOvVygV4Y9Vs5YjzsgubR4G",
    "https://drive.google.com/uc?export=download&id=1BBl0ZNDknIOldhXwnSoaYnSjJOFcbHfh",
    "https://drive.google.com/uc?export=download&id=1BGTYnjqwoLyFcbSgtYL3lHnUeg2Titg8",
    "https://drive.google.com/uc?export=download&id=188tNbHkrWHEV83Yi4oar4WmMFt6pr9xi",
    "https://drive.google.com/uc?export=download&id=17ciTd5xEe9LTg9qpmmv6XdFtuR-Zf0vA",
    "https://drive.google.com/uc?export=download&id=18pg1AphOv5hXdFBnQ7ZCcBzV6sFWDZ7N",
    "https://drive.google.com/uc?export=download&id=19WfOG5qDAeXwJq7Vhkhbix62VYTLXfzR",
    "https://drive.google.com/uc?export=download&id=17x_PrTSg12y-JFrG6ncERdQPjcWviFiM",
    "https://drive.google.com/uc?export=download&id=18NB5pdSAr4A5kL0hE5uJGZgZxxvLmCYm",
    "https://drive.google.com/uc?export=download&id=18iJTgtTuZsAtZ3dX7MYxTNM_HaFI4j0T",
    "https://drive.google.com/uc?export=download&id=1AIk2R8okqECAofSlFwhQXgGtWsqvv-TV",
    "https://drive.google.com/uc?export=download&id=195z7g6QzRELQmcmUE9ENT7E8-1DjvvXk",
    "https://drive.google.com/uc?export=download&id=1ATQuJ6Wkxy4UlbrmRY-0peyDqJ4pSgmX",
    "https://drive.google.com/uc?export=download&id=17KukJVRpSDTjVHdUgETAeM234BueSk4S",
    "https://drive.google.com/uc?export=download&id=1777G3gps_igQxFXVmJYFXs_DzCNB672s",
    "https://drive.google.com/uc?export=download&id=1ANjcA1xmzF8w6ilYYStgk4woCs4ntof6",
    "https://drive.google.com/uc?export=download&id=18-Np_hMb5qhmhgtzzKDD9Ntm_p8Gi2aD",
    "https://drive.google.com/uc?export=download&id=1Azc5n_6sRadjtwCgJcKgtOZxN2c77gdG"
  ];

  const VIDEO_URL = videos[Math.floor(Math.random() * videos.length)];

  const cacheDir = path.join(__dirname, "cache");
  await fs.ensureDir(cacheDir);

  const filePath = path.join(cacheDir, `anime_${Date.now()}.mp4`);

  try {

    const response = await axios({
      url: VIDEO_URL,
      method: "GET",
      responseType: "stream",
      timeout: 120000
    });

    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    writer.on("finish", async () => {

      if (api.setMessageReaction) {
        api.setMessageReaction("🌸", messageID, () => {}, true);
      }

      api.sendMessage(
        {
          body:
`╔═══════════════════╗
 🌸 『 𝗔𝗡𝗜𝗠𝗘 𝗩𝗜𝗗𝗘𝗢 』 🌸
╚═══════════════════╝

┏━━━━━━━━━━━━━━━━━━━┓
┃ 🎬 𝗥𝗔𝗡𝗗𝗢𝗠 𝗔𝗡𝗜𝗠𝗘 𝗩𝗜𝗗𝗘𝗢
┃
┃ 💖 𝗦𝘁𝗮𝘁𝘂𝘀 : Successfully Loaded
┃ 📺 𝗤𝘂𝗮𝗹𝗶𝘁𝘆 : HD 1080P
┃ 🎭 𝗧𝘆𝗽𝗲 : Random Anime Clip
┃ ⚡ 𝗦𝗲𝗿𝘃𝗲𝗿 : Online
┃
┣━━━━━━━━━━━━━━━━━━━┫
┃ 🌸 Enjoy Your Anime Moment
┃ 🍿 Sit Back & Watch
┃ ✨ Have Fun!
┗━━━━━━━━━━━━━━━━━━━┛

╔═══════════════════╗
┃ 🤖 𝗦𝗔𝗘𝗘𝗠-𝗕𝗢𝗧-𝗩𝟱
┃ 👑 𝗢𝘄𝗻𝗲𝗿 : SAEEM SHEIKH 
┃ ❤️ Thanks For Using My Bot
╚═══════════════════╝`,
          attachment: fs.createReadStream(filePath)
        },
        threadID,
        () => {
          try {
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          } catch (e) {
            console.log(e);
          }
        },
        messageID
      );

    });

    writer.on("error", () => {

      if (api.setMessageReaction) {
        api.setMessageReaction("❌", messageID, () => {}, true);
      }

      api.sendMessage(
        "❌ Failed To Download Anime Video.",
        threadID,
        messageID
      );

    });

  } catch (err) {

    console.log(err);

    if (api.setMessageReaction) {
      api.setMessageReaction("❌", messageID, () => {}, true);
    }

    api.sendMessage(
      "❌ Unable To Load Anime Video.",
      threadID,
      messageID
    );

  }

};
