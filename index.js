const Discord = require('discord.js');
const lib = require('./lib');
const cfg = require('./config.json');

const bot = new Discord.Client();

bot.on('ready', () => {
  console.log('Hello world');
  bot.user.setGame(cfg.playing);
});

bot.on('message', async (message) => {
  if (
    (!message.content.startsWith(cfg.prefix) &&
      !message.content.toLowerCase().includes('butter') &&
      !message.content.toLowerCase().includes('purpose')) ||
    message.author.bot
  ) {
    return;
  }

  if (
    message.content.toLowerCase().includes('butter') ||
    message.content.toLowerCase().includes('purpose')
  ) {
    let msg = message.content.toLowerCase();
    let reply = '';

    if (message.isMentioned(bot.user)) {
      const full = msg.split(' ');
      full.forEach((s, i) => {
        // remove @mention before parsing
        if (s.includes('@')) {
          full.splice(i, 1);
        }
      });
      msg = full.join(' ');
      reply = `${message.author} `; // add @mention to response
    }

    if (msg.startsWith('you')) {
      const omg = [
        'http://i.imgur.com/GGOFQpv.gifv',
        `${bot.emojis.find('name', 'butterbot')} Oh my god...`,
      ];
      const rand = omg[Math.floor(Math.random() * omg.length)];
      await lib.sleep(1000);
      message.channel.send(`${reply}${rand}`);
    } else if (msg.startsWith('what')) {
      await lib.sleep(1000);
      if (msg.includes('my')) message.channel.send(`${reply}I am not programmed for friendship.`);
      if (msg.includes('your')) message.channel.send(`${reply}I don't know. What is my purpose?`);
    } else if (msg.includes('pass') || msg.includes('?')) {
      const gif = [
        'https://i.imgur.com/0CwnBuI.gifv',
        'https://i.imgur.com/LyMnpV0.gifv',
        '<:middle_finger:346802215630929922>',
        'No.',
      ];
      const rand = gif[Math.floor(Math.random() * gif.length)];
      await lib.sleep(500);
      if (rand.startsWith('http')) {
        message.channel.send(`${reply}${rand}`);
        await lib.sleep(6000);
        message.channel.send(`${reply}What is my purpose?`);
      } else {
        message.channel.send(`${reply}${rand}`);
      }
    }
  }

  if (message.content.startsWith(cfg.prefix)) {
    const full = message.content.toLowerCase().split(' ');
    const cmd = full[0].split('!');
    switch (cmd[1]) {
      case 'ping':
        message.channel.send('What is my purpose?');
        break;
      case 'price':
        lib.getPrice(full, message.channel);
        break;
      case 'game':
        if (message.member.hasPermission('ADMINISTRATOR')) {
          const quote = message.content.toLowerCase().split('"');
          if (typeof quote[1] === 'string' && /"/.test(full[1])) {
            const game = message.content.match(/"(.*?)"/)[1];
            bot.user.setGame(game);
            console.log(`Set bot game to ${game}`);
          } else {
            message.channel.send('Missing game name, don\'t forget to wrap game in "quotes".');
          }
        } else {
          message.channel.send('Administrator priveleges required.');
        }
        break;
      default:
        console.log(`Unknown command ${message.content.toLowerCase()}`);
    }
  }
});

bot.on('guildMemberAdd', (member) => {
  // assign role to new members
  console.log(`New member "${member.user.username}" has joined "${member.guild.name}"`);
  const role = member.guild.roles.find('name', 'DJ');
  member.addRole(role).catch(console.error);
  console.log(`"${member.user.username}" added to role:${role}`);
});

bot.login('process.env.token'); // heroku key
