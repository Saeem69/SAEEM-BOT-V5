const fontMaps = {
  "1": {
    name: "Bold",
    map: {
      ' ': ' ',
      'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
      'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
      '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
    }
  },
  "2": {
    name: "Sbd",
    map: {
      ' ': ' ',
      'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡', 'i': '𝐢', 'j': '𝐣', 'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩', 'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭', 'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳',
      'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙',
      '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
    }
  },
  "3": {
    name: "SansBold",
    map: {
      ' ': ' ',
      'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
      'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
      '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
    }
  },
  "4": {
    name: "SansBI",
    map: {
      ' ': ' ',
      'a': '𝙖', 'b': '𝙗', 'c': '𝙘', 'd': '𝙙', 'e': '𝙚', 'f': '𝙛', 'g': '𝙜', 'h': '𝙝', 'i': '𝙞', 'j': '𝙟', 'k': '𝙠', 'l': '𝙡', 'm': '𝙢', 'n': '𝙣', 'o': '𝙤', 'p': '𝙥', 'q': '𝙦', 'r': '𝙧', 's': '𝙨', 't': '𝙩', 'u': '𝙪', 'v': '𝙫', 'w': '𝙬', 'x': '𝙭', 'y': '𝙮', 'z': '𝙯',
      'A': '𝘼', 'B': '𝘽', 'C': '𝘾', 'D': '𝘿', 'E': '𝙀', 'F': '𝙁', 'G': '𝙂', 'H': '𝙃', 'I': '𝙄', 'J': '𝙅', 'K': '𝙆', 'L': '𝙇', 'M': '𝙈', 'N': '𝙉', 'O': '𝙊', 'P': '𝙋', 'Q': '𝙌', 'R': '𝙍', 'S': '𝙎', 'T': '𝙏', 'U': '𝙐', 'V': '𝙑', 'W': '𝙒', 'X': '𝙓', 'Y': '𝙔', 'Z': '𝙕',
      '0': '0', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9'
    }
  },
};

function box(title, content) {
  return `╭─[ ${title} ]─╮\n${content}\n╰───────────────╯`;
}

module.exports = {
  config: {
    name: 'font',
    aliases: ['f', 'style'],
    credit: 'MOHAMMAD BADOL',
    prefix: true,
    role: 0,
    cooldown: 2,
    description: 'Convert text and numbers using font numbers (1-4)'
  },

  onStart: async function (arg1, arg2, arg3) {
    // 🛡️ UNIVERSAL PARAMETER FIX
    let api, event, args;
    
    if (arg1 && arg1.api && arg1.event) {
      api = arg1.api;
      event = arg1.event;
      args = arg1.args;
    } else {
      api = arg1;
      event = arg2;
      args = arg3;
    }

    const threadID = event?.threadID;
    const messageID = event?.messageID;

    if (!threadID) {
      return console.error("🔴 [FONT CMD SYSTEM ERROR]: ইভেন্ট অবজেক্ট বা থ্রেড আইডি পাওয়া যায়নি।");
    }

    if (args[0]?.toLowerCase() === 'list') {
      const exampleText = 'Saeem 69';
      
      const availableFontsList = Object.keys(fontMaps).map((key) => {
        const fontMap = fontMaps[key];
        const sample = exampleText.split('')
          .map((char) => fontMap.map[char] || char)
          .join('');

        return `│ [ ${key} ] ${fontMap.name.padEnd(12)} ➜ ${sample}`;
      }).join('\n');

      return api.sendMessage(box("📋 𝐀𝐕𝐀𝐈𝐋𝐀𝐁𝐋𝐄 𝐅𝐎𝐍𝐓𝐒", availableFontsList), threadID, messageID);
    }

    if (!args || args.length < 2) {
      return api.sendMessage(box("❌ 𝐈𝐍𝐕𝐀𝐋𝐈𝐃 𝐔𝐒𝐀𝐆𝐄", 
        "│ Syntax: /font <number> <text>\n" +
        "│ Example: /font 1 SAEEM69\n" +
        "│ Use '/font list' to see all numbers"
      ), threadID, messageID);
    }

    const fontNumber = args[0];
    const inputText = args.slice(1).join(' ');

    if (!inputText.trim()) {
      return api.sendMessage(box("❌ 𝐄𝐌𝐏𝐓𝐘 𝐓𝐄𝐗𝐓", "│ Please provide some text after the font number."), threadID, messageID);
    }

    const chosenFont = fontMaps[fontNumber];

    if (!chosenFont) {
      const listNumbers = Object.keys(fontMaps).map((key) => `│ • Number [ ${key} ] = ${fontMaps[key].name}`).join('\n');
      return api.sendMessage(box("❌ 𝐍𝐔𝐌𝐁𝐄Ｒ 𝐍𝐎𝐓 𝐅𝐎𝐔𝐍𝐃", 
        `${listNumbers}\n│\n│ 💡 Tip: Use /font list`
      ), threadID, messageID);
    }

    const outputText = inputText.split('')
      .map((char) => chosenFont.map[char] || char)
      .join('');

    return api.sendMessage(outputText, threadID, messageID);
  }
};
