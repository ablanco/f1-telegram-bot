// Copyright (c) 2022 Alejandro Blanco <alejandro.b.e@gmail.com>
// MIT License

import F1 from 'formula-one-js';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js';

import { formatDate, formatDateTime, renderWeekendCalendar } from './utils.js';

dayjs.extend(isSameOrAfter);

const drivers = function (ctx) {
    const { standings } = F1.requests();

    standings.getCurrentDriverStanding().then((standingList) => {
        // console.log(standingList);

        const response = standingList.map((driver) => {
            return `${driver.positionText} | ${driver.Driver.givenName} ${driver.Driver.familyName} - ${driver.Driver.code} (<i>${driver.Driver.permanentNumber}</i>)\n     - Points: ${driver.points}`;
        });

        ctx.replyWithHTML(response.join('\n'));
    });
};

const teams = function (ctx) {
    const { standings } = F1.requests();

    standings.getCurrentConstructorStanding().then((standingList) => {
        // console.log(standingList);

        const response = standingList.map((team) => {
            return `${team.positionText} | ${team.Constructor.name} - Points: ${team.points}`;
        });

        ctx.reply(response.join('\n'));
    });
};

const calendar = function (ctx) {
    const { schedule } = F1.requests();
    const now = dayjs();
    let found = false;

    schedule.getCurrentSchedule().then((scheduleList) => {
        // console.log(scheduleList);

        const response = scheduleList.map((weekend) => {
            const raceDay = dayjs(weekend.date, 'YYYY-MM-DD');
            const datetime = formatDateTime(weekend.date, weekend.time);
            let bold = false;
            let result = '';

            if (!found && raceDay.isSameOrAfter(now, 'day')) {
                found = true;
                bold = true;
                result = '<b>';
            }
            result += `${weekend.round} | ${weekend.raceName}\n     - ${datetime}`;
            if (bold) {
                result += '</b>';
            }
            return result;
        });
        response.push('\n<i>Times are in CEST</i>');

        ctx.replyWithHTML(response.join('\n'));
    });
};

const current = function (ctx) {
    const { schedule } = F1.requests();
    const now = dayjs();

    if (now.day() > 0 && now.day() < 5) {
        // 0 is Sunday, 6 is Saturday
        ctx.reply('Today is not a race weekend');
        return;
    }

    schedule.getCurrentSchedule().then((scheduleList) => {
        let current = null;
        scheduleList.forEach((weekend) => {
            const raceDay = dayjs(weekend.date, 'YYYY-MM-DD');
            if (current === null && raceDay.isSameOrAfter(now, 'day')) {
                current = weekend;
            }
        });

        if (current) {
            const response = renderWeekendCalendar(current);
            ctx.replyWithHTML(response.join('\n'));
        } else {
            ctx.reply('Today is not a race weekend');
        }
    });
};

const next = function (ctx) {
    const { schedule } = F1.requests();
    let now = dayjs();

    if (now.day() === 0 || now.day() > 4) {
        // 0 is Sunday, 6 is Saturday
        now = now.add(3, 'day'); // Avoid current race weekend
    }

    schedule.getCurrentSchedule().then((scheduleList) => {
        let next = null;
        scheduleList.forEach((weekend) => {
            const raceDay = dayjs(weekend.date, 'YYYY-MM-DD');
            if (next === null && raceDay.isAfter(now)) {
                next = weekend;
            }
        });

        const response = renderWeekendCalendar(next);
        ctx.replyWithHTML(response.join('\n'));
    });
};

const lastQualy = function (ctx) {
    const { qualifyings, results } = F1.requests();

    results.getLatestRaceResults().then((resultList) => {
        qualifyings
            .getQualifyingsByYearRace(resultList.season, resultList.round)
            .then((qualifyingList) => {
                // console.log(qualifyingList);

                let response = [
                    `<b>${qualifyingList.raceName}</b> - ${formatDate(
                        qualifyingList.date
                    )}`,
                ];
                response = response.concat(
                    qualifyingList.QualifyingResults.map((result) => {
                        let lap = 'No lap';
                        if (result.Q3) {
                            lap = `Q3: ${result.Q3}`;
                        } else if (result.Q2) {
                            lap = `Q2: ${result.Q2}`;
                        } else if (result.Q1) {
                            lap = `Q1: ${result.Q1}`;
                        }
                        return `${result.position} | ${result.Driver.code} (<i>${result.number}</i>) - ${lap}`;
                    })
                );

                ctx.replyWithHTML(response.join('\n'));
            });
    });
};

const lastRace = function (ctx) {
    const { results } = F1.requests();

    results.getLatestRaceResults().then((resultList) => {
        // console.log(resultList);

        let response = [
            `<b>${resultList.raceName}</b> - ${formatDate(resultList.date)}`,
        ];
        response = response.concat(
            resultList.Results.map((result) => {
                return `${result.position} | ${result.Driver.code} (<i>${result.number}</i>) - ${result.status}`;
            })
        );

        ctx.replyWithHTML(response.join('\n'));
    });
};

export { drivers, teams, calendar, current, next, lastQualy, lastRace };
