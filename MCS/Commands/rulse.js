const request = require("request");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "rules",
    version: "1.0.1",
    credit: "MOHAMMAD BADOL",
    role: 0,
    cooldown: 5,
    prefix: true,
    description: "বট ব্যবহারের নিয়মাবলী এবং শর্তসমূহ দেখুন।",
    category: "system"
};

module.exports.onStart = async function (api, event, args) {
    const { threadID, messageID } = event;
    const time = new Date().toLocaleString("bn-BD", { timeZone: "Asia/Dhaka" });

    const rulesMessage =
        `┏━━━━━━━━━━━━━━━━━━━┓\n` +
        ` 📜 𝐒𝐀𝐄𝐄𝐌-𝐁𝐎𝐓-𝐕𝟓 ব্যবহারের নিয়মাবলী📜\n` +
        `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
        `বটটি গ্রুপে সুন্দর ও নিরবচ্ছিন্নভাবে পরিচালনা করতে নিচের নিয়মগুলো মেনে চলুন:\n\n` +
        `‎🔹 [১] ভদ্রতা ও সম্মান:\n` +
        `গ্রুপের সবাই সবার সাথে খুব সুন্দর এবং ভদ্রতার সঙ্গে কথা বলবেন। কাউকে অসম্মান বা ছোট করে কোনো কথা বলা সম্পূর্ণ নিষিদ্ধ।\n\n` +
        `‎🔹 [২] নো স্প্যামিং (No Spam):\n` +
        `বটের ভুলভাল বা উল্টাপাল্টা কমান্ড ব্যবহার করে গ্রুপে স্প্যামিং করবেন না। বটের সব সঠিক কমান্ড দেখতে এবং ব্যবহার করতে সরাসরি টাইপ করুন: $help\n\n` +
        `‎🔹 [৩] অশ্লীলতা ও গালাগালি:\n` +
        `গ্রুপে কোনো প্রকার গালাগালি, নোংরা ভাষা বা অশ্লীলতা ছড়ানো যাবে না। গ্রুপকে সবসময় পরিচ্ছন্ন রাখুন।\n\n` +
        `‎⚠️ [৪] ওয়ার্নিং ও কিক পলিসি:\n` +
        `রুলসের বাইরে বা নিয়মের পরিপন্থী কোনো কাজ করলে আপনাকে ২ বার ওয়ার্নিং (Warning) দেওয়া হবে। ৩ বারের বার সরাসরি গ্রুপ থেকে কিক (Kick) দেওয়া হবে।\n\n` +
        `─❏ 𝐃𝐄𝐕𝐄𝐋𝐎𝐏𝐄𝐑 𝐈𝐍𝐅𝐎:\n` +
        `👤 𝐎𝐖𝐍𝐄𝐑: 𝐒𝐀𝐄𝐄𝐌 𝐒𝐇𝐄𝐈𝐊𝐇\n` +
        `⏰ 𝐓𝐈𝐌𝐄: ${time}\n\n` +
        `© 𝐓𝐇𝐀𝐍𝐊 𝐘𝐎𝐔 𝐅𝐎𝐑 𝐔𝐒𝐈𝐍𝐆 𝐒𝐀𝐄𝐄𝐌-𝐁𝐎𝐓-𝐕𝟓🌺`;

    // ফোল্ডার পাথ ফিক্স এবং অটো-ক্রিয়েশন প্রটেকশন
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
    }
    
    const imgPath = path.join(cacheDir, "rules.jpg");

    request(
        encodeURI("https://drive.google.com/uc?export=download&id=17918PfbKjxkQhUBOEqSy6WbRFYPa_6At")
    )
    .pipe(fs.createWriteStream(imgPath))
    .on("close", () => {
        api.sendMessage(
            {
                body: rulesMessage,
                attachment: fs.createReadStream(imgPath)
            },
            threadID,
            () => {
                try {
                    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
                } catch (e) {}
            },
            messageID
        );
    })
    .on("error", (err) => {
        // রিকোয়েস্ট ফেইল মারলে শুধু টেক্সট মেসেজ পাঠাবে
        api.sendMessage(rulesMessage, threadID, messageID);
    });
};
