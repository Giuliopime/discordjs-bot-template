const beautify = require('beautify.log').default;
const { name } = require('../../config/bot-config.json');

function formatText(text) {
   return text.replace('BOTNAME', name);
}

module.exports = {
   info(text) {
      const prefix = '{fgGreen}[BOTNAME - INFO] {reset}';
      beautify.log(formatText(prefix + text));
   },

   warn(text) {
      const prefix = '{fgYellow}[BOTNAME - WARN] {reset}';
      beautify.log(formatText(prefix + text));
   },

   error(text) {
      const prefix = '{fgRed}[BOTNAME - ERROR] {reset}';
      beautify.log(formatText(prefix + text));
   },
};
