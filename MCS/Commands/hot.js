module.exports = {
‎  config: {
‎    name: "hot",
‎    version: "1.0",
‎    author: "BADOL",
‎    countDown: 5,
‎    role: 0,
‎    shortDescription: "Random Hot Pic",
‎    longDescription: "Send a random hot style image",
‎    category: "Media",
‎    guide: "{pn}"
‎  },
‎
‎  onStart: async function ({ message }) {
‎    const images = [
‎      "https://i.postimg.cc/wTZJ1Yvb/images-1-29.jpg",
‎    
‎    "https://i.postimg.cc/ZRN79xP1/97420.jpg",
‎
‎    "https://i.postimg.cc/tCB54cQs/27712360-320x180.jpg",
‎
‎    "https://i.postimg.cc/Mp4myjGx/556-contact-01749889097.jpg",
‎
‎    "https://i.postimg.cc/rm2GHXWP/images-2022-08-16-T112453-202.jpg",
‎
‎    "https://i.postimg.cc/ZYcPwQqw/www-bangla-xxx-com.jpg",
‎
‎    "https://i.postimg.cc/SQvRQL1y/990-young.jpg",
‎
‎    "https://i.postimg.cc/FHQSb5tW/horny-booby-girl-moaning-hard-fingering-pussy.jpg",
‎
‎"https://i.postimg.cc/0NzwGp5n/Hot-Indian-lovers-standing-sex-MMS.jpg",
‎
‎"https://i.postimg.cc/02H5Yh6g/Hot-Desi-girl-striptease-nude-dance.jpg",
‎
‎"https://i.postimg.cc/CMQ9m044/naughty-Bhabhi-licking-own-nipples.jpg",
‎
‎"https://i.postimg.cc/RFjyCQhD/cute-girl-showing-her-big-round-boobs.jpg",
‎
‎"https://i.postimg.cc/VsqDbcV6/beautiful-Pakistani-girl-salwar-striptease-show.jpg",
‎
‎"https://i.postimg.cc/kXZ6J2vt/sexy-Girl-shows-boobs-and-pussy-many-clips-merged.jpg",
‎
‎"https://i.postimg.cc/XYkrws09/sexy-horny-girl-fingering-masturbating-with-bottle.jpg",
‎
‎"https://i.postimg.cc/g03mvQWD/10-272.jpg"
‎    ];
‎
‎    const random = images[Math.floor(Math.random() * images.length)];
‎
‎    return message.send({
‎      body: "🔥 Random Hot Style Pic",
‎      attachment: await global.utils.getStreamFromURL(random)
‎    });
‎  }
‎};
