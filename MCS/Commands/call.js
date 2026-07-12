const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "call",
  version: "2.0.0",
  role: 0,
  credit: "MOHAMMAD BADOL",
  description: "Report to Bot Admin",
  category: "system",
  prefix: true,
  cooldown: 10
};

// 👑 Admin UID
const ADMIN_ID = "1566619561840044";

// 🖼️ Banner Image
const IMAGE_URL = "https://drive.google.com/uc?export=download&id=1sxhsTt-v8AmrYpu7zozUxPmVgMxES8FV";

function box(title, content) {
  return `
╔═══════════════════╗
║ ${title}
╠═══════════════════╣
${content.split("\n").map(line => `║ ${line}`).join("\n")}
╚═══════════════════╝`;
}

module.exports.onStart = async function (api, event, args) {

  const { threadID, messageID, senderID } = event;

  if (!args.length) {
    return api.sendMessage(
      box(
        "⚠️ REPORT SYSTEM",
`Please write your report.

📝 Example:
$call Bot is not working`
      ),
      threadID,
      messageID
    );
  }

  const reason = args.join(" ");

  const senderInfo = await api.getUserInfo(senderID);
  const senderName = senderInfo[senderID]?.name || "Unknown User";

  const threadInfo = await api.getThreadInfo(threadID);
  const threadName = threadInfo.threadName || "Unknown Group";

  const reportMsg = `
╔══════════════════╗
║  🚨 𝗡𝗘𝗪 𝗥𝗘𝗣𝗢𝗥𝗧 🚨
╠══════════════════╣
║ 👤 𝗨𝗦𝗘𝗥 𝗡𝗔𝗠𝗘 : 
║ ${senderName}
║
║ 🆔 𝗨𝗦𝗘𝗥 𝗜𝗗 : 
║ ${senderID}
║
║ 👥 𝗚𝗥𝗢𝗨𝗣 : 
║ ${threadName}
║
║ 🆔 𝗧𝗛𝗥𝗘𝗔𝗗 𝗜𝗗 : 
║ ${threadID}
║
╠═══════════════════╣
║ 📝 𝗥𝗘𝗣𝗢𝗥𝗧 : 
║ ${reason}
║
╠═══════════════════╣
║ 🤖 BOT    : SAEEM-BOT-V5
║ 👑 OWNER  : SAEEM SHEIKH
║ 📩 STATUS : NEW REPORT 
║RECEIVED
╚═══════════════════╝`;

  try {

    const cacheDir = path.join(__dirname, "../../cache");
    await fs.ensureDir(cacheDir);

    const imgPath = path.join(cacheDir, `call_${Date.now()}.jpg`);

    const res = await axios.get(IMAGE_URL, {
      responseType: "arraybuffer"
    });

    fs.writeFileSync(imgPath, Buffer.from(res.data));

  // Admin-এর জন্য আলাদা ব্যানার
    const adminImgPath = path.join(cacheDir, `admin_${Date.now()}.jpg`);
    fs.copyFileSync(imgPath, adminImgPath);

    // 📩 Admin Inbox
    await api.sendMessage(
      {
        body: reportMsg,
        attachment: fs.createReadStream(adminImgPath)
      },
      ADMIN_ID,
      () => {
        if (fs.existsSync(adminImgPath)) {
          fs.unlinkSync(adminImgPath);
        }
      }
    );

    // 👤 User Confirmation
    return api.sendMessage(
      {
        body: box(
        "REPORT SUCCESSFUL",
`🎉 Your report has been sent 
successfully.

━━━━━━━━━━━━━━━━━━━━

👤 User : ${senderName}

📝 Report : ${reason}

━━━━━━━━━━━━━━━━━━━━

📩 Status : Delivered
⏳ Please wait patiently.
The Bot Admin will contact you 
soon.

━━━━━━━━━━━━━━━━━━━━

🤖 BOT : SAEEM-BOT-V5
👑 OWNER : SAEEM SHEIKH

❤️ THANK YOU FOR USING 
SAEEM-BOT-V5`
        ),
        attachment: fs.createReadStream(imgPath)
      },
      threadID,
      () => {
        if (fs.existsSync(imgPath)) {
          fs.unlinkSync(imgPath);
        }
      },
      messageID
    );

  } catch (err) {

    console.log(err);

    return api.sendMessage(
      {
        body: box(
          "❌ REPORT FAILED",
`Unable to send your report.

━━━━━━━━━━━━━━━━━━━━

⚠️ Please try again later.

If the problem continues,
contact the Bot Owner.

━━━━━━━━━━━━━━━━━━━━

🤖 BOT : SAEEM-BOT-V5
👑 OWNER : SAEEM SHEIKH

💔 Status : Failed To Send Report`
        )
      },
      threadID,
      messageID
    );

  }

};
