module.exports.config = {
  name: "adminmention",
  version: "3.0.0",
  role: 0,
  credit: "MOHAMMAD BADOL",
  description: "Admin মেনশন দিলে অটো ফানি রিপ্লাই",
  category: "system",
  prefix: false,
  cooldown: 5
};

// 🔥 এখানে তোমার Admin ID গুলা বসাও
const adminIDs = [
  "100022291393952",
  ""
];

module.exports.onChat = async function (api, event) {
  const { threadID, messageID, senderID, mentions } = event;
  
  // বট নিজে মেসেজ দিলে ইগনোর
  if (senderID == api.getCurrentUserID()) return;
  
  // মেনশন না থাকলে ইগনোর
  if (!mentions || Object.keys(mentions).length === 0) return;

  // Admin মেনশন চেক করো
  const mentionedAdmin = Object.keys(mentions).find(id => adminIDs.includes(id));
  if (!mentionedAdmin) return;

  // একই মেসেজে বার বার রিপ্লাই আটকাও
  if (global.adminMentioned === messageID) return;
  global.adminMentioned = messageID;

  const funnyReplies = [
    "┌───────────────┐\n│ 🤫 BUSY 🤫 │\n└───────────────┘\nওনি এখন বিজি আছেন\nঅপ্রয়োজনে ডাকবেন না",
    "┌───────────────┐\n│ 😴 SLEEP 😴 │\n└───────────────┘\nবস এখন ঘুমোচ্ছেন\nপরে ট্রাই করেন",
    "┌───────────────┐\n│ 🍔 EATING 🍔 │\n└───────────────┘\nবস এখন নাস্তায় বিজি\nডিস্টার্ব করবেন না",
    "┌───────────────┐\n│ 🚀 SPACE 🚀 │\n└───────────────┘\nবস মঙ্গল গ্রহে গেছেন\nঅভিযানে বিজি",
    "┌───────────────┐\n│ 💸 BKASH 💸 │\n└───────────────┘\nবসকে ডাকতে ১ টাকা\nবিকাশ করুন আগে",
    "┌───────────────┐\n│ 🚫 BLOCK 🚫 │\n└───────────────┘\nবেশি ডাকলে ব্লক\nসাবধান হয়ে যান",
    "┌───────────────┐\n│ 💕 LOVE 💕 │\n└───────────────┘\nবস GF এর সাথে বিজি\nডিস্টার্ব করবেন না",
    "┌───────────────┐\n│ 🛁 BATH 🛁 │\n└───────────────┘\nবস বাথরুমে গান গায়\nবের হলে বলবোনি",
    "┌───────────────┐\n│ 😘 KISS 😘 │\n└───────────────┘\nবস ছুটিতে বস কে ডাকতে\nআমাকে একটা কিস দেন",
    "┌───────────────┐\n│ 😎 CUTE 😎 │\n└───────────────┘\nবস কিউটদের সাথে\nচ্যাট করছেন এখন",
    "┌───────────────┐\n│ 📄 QUEUE 📄 │\n└───────────────┘\nআপনার মেনশন জমা\nসিরিয়াল আসলে পাবেন",
    "┌───────────────┐\n│ 🧐 POWER 🧐 │\n└───────────────┘\nআইডি যার পাওয়ার তার\nমেনশন দিলেই কি হয়?"
  ];

  const randomMsg = funnyReplies[Math.floor(Math.random() * funnyReplies.length)];
  
  console.log(`[ADMINMENTION] Triggered by ${senderID} for admin ${mentionedAdmin}`);
  
  return api.sendMessage(randomMsg, threadID, messageID);
};

module.exports.onStart = async function () {};
