const { createCanvas, loadImage } = require('canvas');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

const BG_URL = "https://drive.google.com/uc?export=view&id=16igx5CTH129wvcoE2HI7uwFrcW6MexoM";

module.exports.config = {
    name: "wish",
    version: "5.1",
    credit: "MOHAMMAD BADOL",
    cooldown: 10,
    role: 0,
    prefix: true,
    description: "Beautiful Birthday Wish Banner with Username on Image",
    category: "fun",
    usages: "[reply/mention]",
    aliases: ["happybirthday", "hbd", "wishme"]
};

module.exports.onStart = async function (api, event, args) {
    const { threadID, messageID, senderID } = event;

    const birthdayMessages = [
        "🎉 শুভ জন্মদিন! 🎂 আজ তোমার বিশেষ দিনটি অনেক অনেক আনন্দ এবং খুশিতে ভরে উঠুক। তুমি জীবনে অনেক অনেক বড় হও এবং তোমার সব স্বপ্ন পূরণ হোক। আল্লাহ তোমাকে সুস্থ ও দীর্ঘজীবী করুন। 🎈✨💖",
        "🌟 হ্যাপি বার্থডে! 🥳 আজকের এই দিনে পৃথিবী তোমার মতো একজন মিষ্টি মানুষ পেয়েছে। তোমার প্রতিটি দিন কাটুক হাসিতে, ভালোবাসায় এবং সাফল্যে। তুমি অনেক অনেক সুখী হও! 🍰💫🌈",
        "🎊 শুভ জন্মদিন! 🎈 তোমার এই বিশেষ দিনে জানাই অনেক অনেক ভালোবাসা ও শুভেচ্ছা। জীবনটা যেন তোমার কাছে আরও রঙিন হয়ে ওঠে, আজকের দিনটি যেন তোমার স্মৃতির পাতায় সব সময় উজ্জ্বল হয়ে থাকে! 🌸💎🥂",
        "🎂 হ্যাপি বার্থডে প্রিয়! 🎁 আজ তোমার জীবনের সবচেয়ে খুশির দিন। তোমার মনে যা যা ইচ্ছা আছে, আশা করি সব খুব দ্রুত সত্যি হবে। সবসময় এমন হাসিখুশি থেকো! 🌷💫🌻",
        "✨ শুভ জন্মদিন! 🥂 আজকের এই দিনে জানাই একরাশ শুভেচ্ছা ও ভালোবাসা। জীবন হোক অসীম আনন্দময়, দুঃখগুলো সব দূর হয়ে আসুক সুখের জোয়ার। ভালো থেকো সব সময়! 🎀💖🎊"
    ];
    const randomMsg = birthdayMessages[Math.floor(Math.random() * birthdayMessages.length)];

    let targetId = senderID;
    if (Object.keys(event.mentions).length > 0) targetId = Object.keys(event.mentions)[0];
    else if (event.messageReply) targetId = event.messageReply.senderID;

    let targetName = "User";
    try {
        const t = await api.getUserInfo(targetId);
        targetName = t[targetId]?.name || "User";
    } catch (e) {}

    const waitMsg = await api.sendMessage("⏳ Generating your Birthday wish banner...", threadID, messageID);

    try {
        const bgResponse = await axios.get(BG_URL, { responseType: 'arraybuffer' });
        const bgImg = await loadImage(Buffer.from(bgResponse.data));
        
        const canvas = createCanvas(1000, 667);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(bgImg, 0, 0, 1000, 667);

        const getProfilePic = async (userId) => {
            return `https://graph.facebook.com/${userId}/picture?width=720&height=720&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;
        };

        const posX = 226;
        const posY = 290;
        const sizeR = 200;

        const response = await axios.get(await getProfilePic(targetId), { responseType: 'arraybuffer' });
        const img = await loadImage(Buffer.from(response.data));
        
        ctx.save();
        ctx.beginPath();
        ctx.arc(posX, posY, sizeR, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, posX - sizeR, posY - sizeR, sizeR * 2, sizeR * 2);
        ctx.restore();

        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.font = "bold 32px Arial";
        
        ctx.fillText(targetName, posX, posY + sizeR + 60);

        const outPath = path.join(__dirname, `wish_${targetId}.png`);
        fs.writeFileSync(outPath, canvas.toBuffer('image/png'));

        await api.unsendMessage(waitMsg.messageID).catch(() => {});
        
        const outputMessage = `┏━━━『 SAEEM-BOT-V5 』━━┓\n` +
                              ` 👤 BIRTHDAY PERSON: ${targetName}\n\n` +
                              ` 💬 ${randomMsg}\n\n` +
                              ` 💌 POWERED BY: SAEEM-BOT-V5\n` +
                              `┗━━━━━━━━━━━━━━━━━━━┛`;

        await api.sendMessage({
            body: outputMessage,
            attachment: fs.createReadStream(outPath)
        }, threadID, messageID);

        fs.unlinkSync(outPath);
    } catch (e) {
        console.error(e);
        await api.unsendMessage(waitMsg.messageID).catch(() => {});
        return api.sendMessage("┏━『 SAEEM-BOT-V5 』━┓\n 〉Error: Could not generate wish!\n┗━━━━━━━━━━━━━━━━━┛", threadID, messageID);
    }
};
