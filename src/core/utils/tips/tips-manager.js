const { tips } = require('./tips.json');

module.exports = {
   getRandomTip() {
      return tips[Math.floor(Math.random() * tips.length)];
   },
};
