// Copyright (c) 2022 Alejandro Blanco <alejandro.b.e@gmail.com>
// MIT License

import F1 from 'formula-one-js';
import dayjs from 'dayjs';

import { formatDate, formatDateTime } from './utils.js';

const drivers = function (ctx) {
    const { standings } = F1.requests();

    standings.getCurrentDriverStanding().then((standingList) => {
        // console.log(standingList);

        const response = standingList.map((driver) => {
            return `${driver.positionText} | ${driver.Driver.givenName} ${driver.Driver.familyName} - ${driver.Driver.code} (<i>${driver.Driver.permanentNumber}</i>) - Points: ${driver.points}`;
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

    schedule.getCurrentSchedule().then((scheduleList) => {
        // console.log(scheduleList);

        const response = scheduleList.map((weekend) => {
            const datetime = formatDateTime(weekend.date, weekend.time);
            return `${weekend.round} | ${weekend.raceName}  ~~~ ${datetime}`;
        });

        ctx.reply(response.join('\n'));
    });
};

const next = function (ctx) {
    const { schedule } = F1.requests();
    const now = dayjs();

    schedule.getCurrentSchedule().then((scheduleList) => {
        let next = null;
        scheduleList.forEach((weekend) => {
            const raceDay = dayjs(weekend.date, 'YYYY-MM-DD');
            if (next === null && raceDay.isAfter(now)) {
                next = weekend;
            }
        });

        const response = [`<b>${next.raceName}</b>`];
        let datetime;
        if (next.FirstPractice) {
            datetime = formatDateTime(
                next.FirstPractice.date,
                next.FirstPractice.time
            );
            response.push(`- FP1: ${datetime}`);
        }
        if (next.SecondPractice) {
            datetime = formatDateTime(
                next.SecondPractice.date,
                next.SecondPractice.time
            );
            response.push(`- FP2: ${datetime}`);
        }
        if (next.ThirdPractice) {
            datetime = formatDateTime(
                next.ThirdPractice.date,
                next.ThirdPractice.time
            );
            response.push(`- FP3: ${datetime}`);
        }
        if (next.Qualifying) {
            datetime = formatDateTime(
                next.Qualifying.date,
                next.Qualifying.time
            );
            response.push(`- Qualy: ${datetime}`);
        }
        if (next.Sprint) {
            datetime = formatDateTime(next.Sprint.date, next.Sprint.time);
            response.push(`- Sprint: ${datetime}`);
        }
        datetime = formatDateTime(next.date, next.time);
        response.push(`- Race: ${datetime}`);

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

export { drivers, teams, calendar, next, lastQualy, lastRace };
