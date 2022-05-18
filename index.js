// Copyright (c) 2022 Alejandro Blanco <alejandro.b.e@gmail.com>
// MIT License

import { Telegraf } from 'telegraf';
import Settings from './src/settings.js';
import {
    drivers,
    teams,
    calendar,
    next,
    lastQualy,
    lastRace,
} from './src/commands.js';

const bot = new Telegraf(Settings.token);

bot.command('drivers', drivers);
bot.command('teams', teams);
bot.command('calendar', calendar);
bot.command('next', next);
bot.command('lastqualy', lastQualy);
bot.command('lastrace', lastRace);

// bot.on('callback_query', (ctx) => {
//     // Explicit usage
//     ctx.telegram.answerCbQuery(ctx.callbackQuery.id);

//     // Using context shortcut
//     ctx.answerCbQuery();
// });

// bot.on('inline_query', (ctx) => {
//     const result = [];
//     // Explicit usage
//     ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, result);

//     // Using context shortcut
//     ctx.answerInlineQuery(result);
// });

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
