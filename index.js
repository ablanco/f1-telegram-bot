// Copyright (c) 2022 Alejandro Blanco <alejandro.b.e@gmail.com>
// MIT License

import { Telegraf } from 'telegraf';
import Settings from './src/settings.js';
import {
    drivers,
    teams,
    tracks,
    standings,
    calendar,
    current,
    next,
    lastQualy,
    lastRace,
} from './src/commands.js';

const bot = new Telegraf(Settings.token);

bot.command('help', function (ctx) {
    ctx.replyWithHTML(
        [
            '<pre>drivers</pre>\n  Show this year drivers details',
            '<pre>teams</pre>\n  Show this year teams details',
            '<pre>tracks</pre>\n  Show this year tracks details',
            '<pre>standings</pre>\n  Show current standings for both championships',
            '<pre>calendar</pre>\n  Show this year race calendar',
            '<pre>current</pre>\n  Show the schedule for a race weekend in progress',
            '<pre>next</pre>\n  Show the schedule for next race weekend',
            '<pre>lastqualy</pre>\n  Show the results of last weekend qualifying',
            '<pre>lastrace</pre>\n  Show the results of last weekend race',
        ].join('\n')
    );
});

bot.command('drivers', drivers);
bot.command('teams', teams);
bot.command('tracks', tracks);
bot.command('standings', standings);
bot.command('calendar', calendar);
bot.command('current', current);
bot.command('next', next);
bot.command('lastqualy', lastQualy);
bot.command('lastrace', lastRace);

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
