// Copyright (c) 2022 Alejandro Blanco <alejandro.b.e@gmail.com>
// MIT License

import { Telegraf } from 'telegraf';
import Settings from './src/settings.js';
import {
    drivers,
    teams,
    calendar,
    current,
    next,
    lastQualy,
    lastRace,
} from './src/commands.js';

const bot = new Telegraf(Settings.token);

bot.command('drivers', drivers);
bot.command('teams', teams);
bot.command('calendar', calendar);
bot.command('current', current);
bot.command('next', next);
bot.command('lastqualy', lastQualy);
bot.command('lastrace', lastRace);

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
