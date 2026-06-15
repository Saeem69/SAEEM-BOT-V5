module.exports.config = {
    name: "rules",
    version: "1.0.0",
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
        `╭──────────────❑\n` +
        `│ 📜 **TONNI BOT ব্যবহারের নিয়মাবলী**\n` +
        `╰──────────────❑\n\n` +
        `বটটি গ্রুপে সুন্দর ও নিরবচ্ছিন্নভাবে পরিচালনা করতে নিচের নিয়মগুলো মেনে চলুন:\n\n` +
        `🛑 **১. স্প্যামিং নিষিদ্ধ:**\n` +
        `অনবরত বা খুব দ্রুত কমান্ড ব্যবহার করবেন না। বটের সুরক্ষায় অটো-কুলডাউন এবং অ্যান্টি-স্প্যাম সিস্টেম অন আছে।\n\n` +
        `🚫 **২. অপব্যবহার ও গালিগালাজ:**\n` +
        `বটের কোনো কমান্ডের মাধ্যমে কাউকে হ্যারাস করা বা গ্রুপে অশালীন পরিবেশ তৈরি করা যাবে না।\n\n` +
        `🛠️ **৩. ওনার পারমিশন ও অ্যাপ্রুভাল:**\n` +
        `বট কিক খেলে বা গ্রুপ আন-অ্যাপ্রুভড হলে তা স্বয়ংক্রিয়ভাবে মেইন সার্ভার থেকে রিমুভ হয়ে যাবে। নতুন গ্রুপে অ্যাড করতে ওনারের অনুমতি প্রয়োজন।\n\n` +
        `⚠️ **৪. রিমোট ব্যান (Remote Ban):**\n` +
        `বটের নিয়ম ভঙ্গ করলে গলোবাল রিমোট ব্যান সিস্টেমের মাধ্যমে আপনাকে চিরতরে বট ব্যবহার থেকে ব্লক করা হতে পারে।\n\n` +
        `─❏ **ডেভলপার ইনফো:**\n` +
        `👑 **Owner:** SAEEM SHEIKH\n` +
        `⏰ **সময়:** ${time}\n\n` +
        `© Tonni Bot System • All Rights Reserved.`;

    try {
        return api.sendMessage(rulesMessage, threadID, messageID);
    } catch (error) {
        return api.sendMessage(`[ CMD ERROR ]: নিয়মাবলী লোড করতে সমস্যা হয়েছে।`, threadID, messageID);
    }
};
