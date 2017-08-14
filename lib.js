const got = require('got');
const cfg = require('./config.json');

exports.sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

exports.getPrice = (abbrv, channel) => {
  let pair = [];
  if (abbrv.length > 1 && abbrv[1].indexOf('/') > -1) {
    pair = abbrv[1].split('/');
  }
  if (abbrv.length > 1 && pair.length === 0) {
    got(`https://coinmarketcap-nexuist.rhcloud.com/api/${abbrv[1]}/price`, { json: true })
      .then((response) => {
        console.log(`API call for ${abbrv[1].toUpperCase()}`);
        const price = parseFloat(response.body.usd).toFixed(2);
        if (isNaN(price)) {
          channel.send('Requested coin does not exist or has not been added yet.');
        } else {
          channel.send(`\`\`${abbrv[1].toUpperCase()}: $${price}\`\``);
        }
      })
      .catch((error) => {
        console.log(error.response.body);
      });
  } else if (pair.length > 1 && !pair.includes('')) {
    got(`https://coinmarketcap-nexuist.rhcloud.com/api/${pair[0]}/price`, { json: true })
      .then((response) => {
        console.log(`API call for pair ${pair[0].toUpperCase()}/${pair[1].toUpperCase()}`);
        const price = parseFloat(response.body[pair[1]]).toFixed(8);
        if (isNaN(price)) {
          channel.send('Requested pair does not exist or is not in the top 100.');
        } else {
          channel.send(`\`\`${pair[0].toUpperCase()}: ${price} ${pair[1].toUpperCase()}\`\``);
        }
      })
      .catch((error) => {
        console.log(error.response.response.body);
      });
  } else {
    channel.send(`usage: ${cfg.prefix}price abbreviation/pair (BTC, ETH/BTC, GNT/ETH)`);
  }
};
