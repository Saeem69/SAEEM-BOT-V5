const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
  name: "hack",
  aliases: ["cyberhack"],
  version: "4.0.0",
  credit: "MOHAMMAD BADOL",
  role: 0,
  prefix: true,
  cooldown: 5,
  description: "Advanced Fake Hacking Simulation",
  category: "fun"
};

module.exports.onStart = async function (api, event, args) {
  try {
    const {
      threadID,
      messageID,
      senderID,
      mentions,
      type,
      messageReply
    } = event;

    let targetID = senderID;

    if (mentions && Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0];
    }

    if (type === "message_reply" && messageReply) {
      targetID = messageReply.senderID;
    }

    // আপনার ছবির Direct Link
    const IMAGE_URL = "https://drive.google.com/uc?export=download&id=1DxAIX1MGBjeJDhbjK0QbNeGxUiEn33yu";

    // বোল্ড ফন্টে কনভার্ট করার ফাংশন (𝐀 𝐁 𝐂 𝐃...)
    function toBold(text) {
      const map = {
        "a": "𝐚", "b": "𝐛", "c": "𝐜", "d": "𝐝", "e": "𝐞", "f": "𝐟", "g": "𝐠", "h": "𝐡", "i": "𝐢", "j": "𝐣", "k": "𝐤", "l": "𝐥", "m": "𝐦", "n": "𝐧", "o": "𝐨", "p": "𝐩", "q": "𝐪", "r": "𝐫", "s": "𝐬", "t": "𝐭", "u": "𝐮", "v": "𝐯", "w": "𝐰", "x": "𝐱", "y": "𝐲", "z": "𝐳",
        "A": "𝐀", "B": "𝐁", "C": "𝐂", "D": "𝐃", "E": "𝐄", "F": "𝐅", "G": "𝐆", "H": "𝐇", "I": "𝐈", "J": "𝐉", "K": "𝐊", "L": "𝐋", "M": "𝐌", "N": "𝐍", "O": "𝐎", "P": "𝐏", "Q": "𝐐", "R": "𝐑", "S": "𝐒", "T": "𝐓", "U": "𝐔", "V": "𝐕", "W": "𝐖", "X": "𝐗", "Y": "𝐘", "Z": "𝐙",
        "0": "𝟎", "1": "𝟏", "2": "𝟐", "3": "𝟑", "4": "𝟒", "5": "𝟓", "6": "𝟔", "7": "𝟕", "8": "𝟖", "9": "𝟗"
      };
      return String(text).split('').map(char => map[char] || char).join('');
    }

    // Victim Information
    let victimName = "Unknown";
    let victimGender = "Unknown";
    let rawProfileLink = `https://facebook.com/${targetID}`; // এটি আসল লিংক হিসেবে থাকবে

    try {
      const userInfo = await api.getUserInfo(targetID);

      if (userInfo && userInfo[targetID]) {
        victimName = userInfo[targetID].name || "Unknown";

        if (userInfo[targetID].gender == 2)
          victimGender = "𝐌𝐚𝐥𝐞";
        else if (userInfo[targetID].gender == 1)
          victimGender = "𝐅𝐞𝐦𝐚𝐥𝐞";
      }
    } catch (e) {
      console.log(e);
    }

    // ফন্ট স্টাইল অ্যাপ্লাই করা
    const styledName = toBold(victimName);
    const styledUID = toBold(targetID);

    const steps = [
      "📡 Initializing saeem Cyber Engine...",
      "🌐 Connecting Secure Server...",
      "👤 Detecting Target...",
      "📲 Reading Facebook Profile...",
      "📂 Accessing Gallery...",
      "💬 Reading Messenger...",
      "📞 Syncing Contacts...",
      "🌍 Tracking Location...",
      "🔐 Bypassing Security...",
      "📡 Uploading Report...",
      "⚡ Finalizing...",
      "✅ Simulation Completed."
    ];

    let loadingMessage;

    api.sendMessage(steps[0], threadID, async (err, info) => {
      if (err) return;

      loadingMessage = info;

      for (let i = 1; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        try {
          await api.editMessage(
            `${steps[i]}\n\n██████████ ${Math.floor(((i + 1) / steps.length) * 100)}%`,
            loadingMessage.messageID
          );
        } catch (e) {}
      }

      await new Promise(resolve => setTimeout(resolve, 1200));

      const cacheDir = path.join(__dirname, "cache");
      await fs.ensureDir(cacheDir);

      const imagePath = path.join(
        cacheDir,
        `hack_${Date.now()}.jpg`
      );

      try {
        const response = await axios({
          url: IMAGE_URL,
          method: "GET",
          responseType: "stream"
        });

        const writer = fs.createWriteStream(imagePath);
        response.data.pipe(writer);

        writer.on("finish", async () => {
          try {
            await api.unsendMessage(loadingMessage.messageID);
          } catch (e) {}

          const result = `
💀 𝐒𝐀𝐄𝐄𝐌 𝐂𝐘𝐁𝐄𝐑 𝐄𝐍𝐆𝐈𝐍𝐄 💀
━━━━━━━━━━━━━━━━━━━━━

👤 𝐍𝐚𝐦𝐞 : ${styledName}
🆔 𝐔𝐈𝐃 : ${styledUID}
🚻 𝐆𝐞𝐧𝐝𝐞𝐫 : ${victimGender}
🔗 𝐏𝐫𝐨𝐟𝐢𝐥𝐞 𝐋𝐢𝐧𝐤 :
${rawProfileLink}

━━━━━━━━━━━━━━━━━━━━━

🛰️ 𝐂𝐄𝐍𝐓𝐑𝐀𝐋 𝐂𝐋𝐎𝐔𝐃 🧚 𝐇𝐎𝐒𝐓 𝐒𝐀𝐄𝐄𝐌-𝐅𝐑𝐀𝐌𝐄 ✅ 𝐒𝐄𝐑𝐕𝐄𝐑

━━━━━━━━━━━━━━━━━━━━━

📂 𝐆𝐚𝐥𝐥𝐞𝐫𝐲 𝐒𝐜𝐚𝐧 ✅
💬 𝐌𝐞𝐬𝐬𝐞𝐧𝐠𝐞𝐫 𝐒𝐜𝐚𝐧 ✅
📞 𝐂𝐨𝐧𝐭𝐚𝐜𝐭𝐬 𝐒𝐜𝐚𝐧 ✅
📸 𝐏𝐡𝐨𝐭𝐨𝐬 𝐒𝐜𝐚𝐧 ✅
🌍 𝐋𝐨𝐜𝐚𝐭𝐢𝐨𝐧 𝐒𝐜𝐚𝐧 ✅
📡 𝐈𝐏 𝐀𝐝𝐝𝐫𝐞𝐬𝐬 𝐒𝐜𝐚𝐧 ✅
🔐 𝐒𝐞𝐜𝐮𝐫𝐢𝐭𝐲 𝐒𝐜𝐚𝐧 ✅
☁ 𝐂𝐥𝐨𝐮𝐝 𝐔𝐩𝐥𝐨𝐚𝐝 ✅
⚡ 𝐒𝐞𝐬𝐬𝐢𝐨𝐧 𝐒𝐲𝐧𝐜 ✅
🛰 𝐃𝐞𝐯𝐢𝐜𝐞 𝐀𝐧𝐚𝐥𝐲𝐬𝐢𝐬 ✅

━━━━━━━━━━━━━━━━━━━━━

‎⚠️ [𝐈𝐌𝐏𝐎𝐑𝐓𝐀𝐍𝐓 𝐍𝐎𝐓𝐈𝐂𝐄]
‎𝐀𝐥𝐥 𝐦𝐞𝐭𝐚𝐝𝐚𝐭𝐚 𝐚𝐧𝐝 𝐬𝐲𝐬𝐭𝐞𝐦 𝐝𝐮𝐦𝐩 𝐟𝐢𝐥𝐞𝐬 𝐨𝐟 𝐭𝐡𝐢𝐬 𝐚𝐜𝐜𝐨𝐮𝐧𝐭 𝐡𝐚𝐯𝐞 𝐛𝐞𝐞𝐧 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐭𝐫𝐚𝐧𝐬𝐟𝐞𝐫𝐫𝐞𝐝 𝐭𝐨 𝐬𝐚𝐞𝐞𝐦 𝐬𝐡𝐞𝐢𝐤𝐡 𝐬𝐞𝐜𝐮𝐫𝐞𝐝 𝐡𝐨𝐬𝐭𝐢𝐧𝐠 𝐝𝐚𝐭𝐚𝐛𝐚𝐬𝐞.

‎🛑 [𝐖𝐀𝐑𝐍𝐈𝐍𝐆] অ্যাকাউন্টটি বর্তমানে ছাইম বসের স্কুইড সার্ভার 🖇️ এ রয়েছে। পরবর্তী ১০ মিনিটের মধ্যে ছাইম বসকে 😹একটা Gf অথবা তোমার গার্লফ্রেন্ড ☺️ ট্রিট না দিলে, 🫣সমস্ত গোপন চ্যাট হিস্ট্রি গ্রুপে লিক করে দেওয়া হবে! 😉

━━━━━━━━━━━━━━━━━━━━━
‎👤 𝐂𝐑𝐄𝐃𝐈𝐓 𝐁𝐘 𝐒𝐀𝐄𝐄𝐌-𝐁𝐎𝐓-𝐕𝟓`;

          api.sendMessage(
            {
              body: result,
              attachment: fs.createReadStream(imagePath)
            },
            threadID,
            () => {
              try {
                if (fs.existsSync(imagePath))
                  fs.unlinkSync(imagePath);
              } catch (e) {}
            },
            messageID
          );
        });

        writer.on("error", () => {
          api.sendMessage(
            "❌ Image Download Failed!",
            threadID,
            messageID
          );
        });
      } catch (err) {
        console.log(err);
        api.sendMessage(
          "❌ Failed To Load Image!",
          threadID,
          messageID
        );
      }
    });
  } catch (error) {
    console.error(error);
    api.sendMessage(
      `❌ SYSTEM ERROR\n\n${error.message}`,
      event.threadID,
      event.messageID
    );
  }
};
