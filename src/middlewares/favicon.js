const favicon = require("serve-favicon");
const path = require("path");

const loadFavicon = favicon(path.join(__dirname, "../public", "favicon.ico"));

module.exports = { loadFavicon };
