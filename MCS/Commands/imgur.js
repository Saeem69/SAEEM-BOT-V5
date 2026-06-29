"use strict";

const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
	config: {
		name: "imgur",
		aliases: ["imglink", "upload"],
		version: "5.1.0",
		credit: "MOHAMMAD BADOL",
		countDown: 5,
		role: 0,
		shortDescription: "Convert media files to Imgur links",
		longDescription: "Reply to any image, video, or GIF to upload it to Imgur and get the link.",
		category: "Utility",
		guide: "{p}imgur (reply to image/video)"
	},

	onStart: async function (api, event, args) {
		const threadID = event.threadID;
		const messageID = event.messageID;
		const attachment = event.messageReply?.attachments?.[0];

		if (!attachment) {
			return api.sendMessage(
				`┏━━━━━━━━━━━━━━━━━━━━┓
⚠️ 𝐈𝐌𝐆𝐔𝐑 𝐔𝐏𝐋𝐎𝐀𝐃 𝐄𝐑𝐑𝐎𝐑
┗━━━━━━━━━━━━━━━━━━━━┛

📢 Please reply to an image, video or GIF file.`,
				threadID,
				messageID
			);
		}

		const loadingInfo = await new Promise((resolve) => {
			api.sendMessage(
				"⏳ Uploading to Imgur... Please wait...",
				threadID,
				(err, info) => resolve(err ? null : info),
				messageID
			);
		});

		try {
			const apiUrl = `https://sagor-apis-nx.vercel.app/sagor/imgur?url=${encodeURIComponent(attachment.url)}`;
			const res = await axios.get(apiUrl);

			if (loadingInfo?.messageID) {
				try {
					await api.unsendMessage(loadingInfo.messageID);
				} catch {}
			}

			if (!res.data || res.data.status !== "success") {
				return api.sendMessage(
					"❌ Upload failed from API server.",
					threadID,
					messageID
				);
			}

			const d = res.data.data;

			// Banner Download
			const bannerURL =
				"https://drive.google.com/uc?export=download&id=1uy8rMIZtfSA-UIz7y7zy0lv3yPsb9cQB";

			const cacheDir = path.join(__dirname, "cache");
			await fs.ensureDir(cacheDir);

			const bannerPath = path.join(cacheDir, "imgur.jpg");

			const banner = await axios({
				url: bannerURL,
				method: "GET",
				responseType: "stream"
			});

			const writer = fs.createWriteStream(bannerPath);

			banner.data.pipe(writer);

			await new Promise((resolve, reject) => {
				writer.on("finish", resolve);
				writer.on("error", reject);
			});

			const outputMessage =
`╭━━━━━━━━━━━━━━━━━━━╮
🌐 𝐈𝐌𝐆𝐔𝐑 𝐔𝐏𝐋𝐎𝐀𝐃 𝐒𝐔𝐂𝐂𝐄𝐒𝐒
╰━━━━━━━━━━━━━━━━━━━╯

🔗 YOUR LINK
${d.link}

━━━━━━━━━━━━━━━━━━
👑 OWNER : SAEEM SHEIKH
🤖 BOT : SAEEM-BOT-V5
⚡ STATUS : SUCCESS ✅
━━━━━━━━━━━━━━━━━━`;

			return api.sendMessage(
				{
					body: outputMessage,
					attachment: fs.createReadStream(bannerPath)
				},
				threadID,
				() => {
					if (fs.existsSync(bannerPath))
						fs.unlinkSync(bannerPath);
				},
				messageID
			);

		} catch (err) {
			if (loadingInfo?.messageID) {
				try {
					await api.unsendMessage(loadingInfo.messageID);
				} catch {}
			}

			return api.sendMessage(
				`❌ Error: ${err.message}`,
				threadID,
				messageID
			);
		}
	},

	onReply: async function (api, event, cache) {
		return this.onStart(api, event, []);
	}
};
