// Copyright (c) 2022 Alejandro Blanco <alejandro.b.e@gmail.com>
// MIT License

import { Telegraf } from 'telegraf';
import Settings from './src/settings.js';
import {
    pilots,
    teams,
    tracks,
    ranking,
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
            '/drivers\n  Show this year drivers details',
            '/teams\n  Show this year teams details',
            '/tracks\n  Show this year tracks details',
            '/standings\n  Show current standings for both championships',
            '/calendar\n  Show this year race calendar',
            '/current\n  Show the schedule for a race weekend in progress',
            '/next\n  Show the schedule for next race weekend',
            '/lastqualy\n  Show the results of last weekend qualifying',
            '/lastrace\n  Show the results of last weekend race',
        ].join('\n')
    );
});

bot.command('drivers', pilots);
bot.command('teams', teams);
bot.command('tracks', tracks);
bot.command('standings', ranking);
bot.command('calendar', calendar);
bot.command('current', current);
bot.command('next', next);
bot.command('lastqualy', lastQualy);
bot.command('lastrace', lastRace);

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
