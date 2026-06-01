// notices.js - সব নোটিশ মেসেজ এখানে
module.exports = {
    COOLDOWN: (time) => `┌───────────────┐
│ ⏰ COOLDOWN ⏰ │
└───────────────┘
আর ${time} সেকেন্ড অপেক্ষা করো`,

    PREFIX: (cmd, prefix) => `┌───────────────┐
│ ⚠️ PREFIX ⚠️ │
└───────────────┘
এই কমান্ডে Prefix লাগবে
${prefix}${cmd}`,

    BANNED_USER: `┌───────────────┐
│ 🚫 BANNED 🚫 │
└───────────────┘
তুমি বট থেকে ব্যান
কমান্ড ইউজ করতে পারবা না`,

    BANNED_THREAD: `┌───────────────┐
│ 🚫 BANNED 🚫 │
└───────────────┘
এই গ্রুপ বট থেকে ব্যান`,

    ACCESS_DENIED: `━━━━━━━━━━━━━━━━━━━━━━
 ❌ ACCESS DENIED
━━━━━━━━━━━━━━━━━━━━━━

This is an Admin-only command. You do not have permission to use it.
━━━━━━━━━━━━━━━━━━━━━━`,

    NOT_FOUND: (cmd, suggestion) => {
        if (suggestion) {
            return `┌───────────────┐
│ ❌ NOT FOUND ❌ │
└───────────────┘
/${cmd} নামে কোনো কমান্ড নেই

আপনি কি /${suggestion} খুঁজছেন? 🤔`;
        }
        return `┌───────────────┐
│ ❌ NOT FOUND ❌ │
└───────────────┘
/${cmd} নামে কোনো কমান্ড নেই

/help লিখে সব কমান্ড দেখুন`;
    }
};
