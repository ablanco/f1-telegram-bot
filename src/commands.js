// Copyright (c) 2022 Alejandro Blanco <alejandro.b.e@gmail.com>
// MIT License

import F1 from 'formula-one-js';
import dayjs from 'dayjs';

const drivers = (ctx) => {
    const { standings } = F1.requests();

    standings.getCurrentDriverStanding().then((standingList) => {
        // console.log(standingList);

        const response = standingList.map((driver) => {
            return `${driver.positionText} | ${driver.Driver.givenName} ${driver.Driver.familyName} - ${driver.points}`;
        });

        ctx.reply(response.join('\n'));
    });
};

const teams = (ctx) => {
    const { standings } = F1.requests();

    standings.getCurrentConstructorStanding().then((standingList) => {
        // console.log(standingList);

        const response = standingList.map((team) => {
            return `${team.positionText} | ${team.Constructor.name} - ${team.points}`;
        });

        ctx.reply(response.join('\n'));
    });
};

const calendar = (ctx) => {
    const { schedule } = F1.requests();

    schedule.getCurrentSchedule().then((scheduleList) => {
        // console.log(scheduleList);

        const response = scheduleList.map((weekend) => {
            return `${weekend.round} | ${weekend.raceName} - ${weekend.date} ${weekend.time}`;
        });

        ctx.reply(response.join('\n'));
    });
};

const next = (ctx) => {
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

        const response = [`${next.raceName}`];
        if (next.FirstPractice) {
            response.push(
                `- FP1: ${next.FirstPractice.date} | ${next.FirstPractice.time}`
            );
        }
        if (next.SecondPractice) {
            response.push(
                `- FP2: ${next.SecondPractice.date} | ${next.SecondPractice.time}`
            );
        }
        if (next.ThirdPractice) {
            response.push(
                `- FP3: ${next.ThirdPractice.date} | ${next.ThirdPractice.time}`
            );
        }
        if (next.Qualifying) {
            response.push(
                `- Qualy: ${next.Qualifying.date} | ${next.Qualifying.time}`
            );
        }
        if (next.Sprint) {
            response.push(
                `- Sprint: ${next.Sprint.date} | ${next.Sprint.time}`
            );
        }
        response.push(`- Race: ${next.date} | ${next.time}`);

        ctx.reply(response.join('\n'));
    });
};

export { drivers, teams, calendar, next };
