// Copyright (c) 2022 Alejandro Blanco <alejandro.b.e@gmail.com>
// MIT License

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

const formatDate = function (date) {
    return dayjs(date, 'YYYY-MM-DD').format('MMM D, YYYY');
};

const formatDateTime = function (date, time) {
    // console.log(`${date} ${time}`);
    return dayjs(`${date} ${time}`)
        .tz('Europe/Madrid')
        .format('MMM D, YYYY - HH:mm');
};

const renderWeekendCalendar = function (weekend) {
    const items = [`<b>${weekend.raceName}</b>`];
    let response, datetime;

    if (weekend.FirstPractice) {
        datetime = formatDateTime(
            weekend.FirstPractice.date,
            weekend.FirstPractice.time
        );
        items.push({
            label: `- FP1: ${datetime}`,
            date: weekend.FirstPractice.date,
            time: weekend.FirstPractice.time,
        });
    }
    if (weekend.SecondPractice) {
        datetime = formatDateTime(
            weekend.SecondPractice.date,
            weekend.SecondPractice.time
        );
        items.push({
            label: `- FP2: ${datetime}`,
            date: weekend.SecondPractice.date,
            time: weekend.SecondPractice.time,
        });
    }
    if (weekend.ThirdPractice) {
        datetime = formatDateTime(
            weekend.ThirdPractice.date,
            weekend.ThirdPractice.time
        );
        items.push({
            label: `- FP3: ${datetime}`,
            date: weekend.ThirdPractice.date,
            time: weekend.ThirdPractice.time,
        });
    }
    if (weekend.Qualifying) {
        datetime = formatDateTime(
            weekend.Qualifying.date,
            weekend.Qualifying.time
        );
        items.push({
            label: `- Qualy: ${datetime}`,
            date: weekend.Qualifying.date,
            time: weekend.Qualifying.time,
        });
    }
    if (weekend.Sprint) {
        datetime = formatDateTime(weekend.Sprint.date, weekend.Sprint.time);
        items.push({
            label: `- Sprint: ${datetime}`,
            date: weekend.Sprint.date,
            time: weekend.Sprint.time,
        });
    }
    datetime = formatDateTime(weekend.date, weekend.time);
    items.push({
        label: `- Race: ${datetime}`,
        date: weekend.date,
        time: weekend.time,
    });

    items.sort((a, b) => {
        const ad = dayjs(`${a.date} ${a.time}`),
            bd = dayjs(`${b.date} ${b.time}`);

        if (ad.isBefore(bd)) {
            return -1;
        } else if (ad.isAfter(bd)) {
            return 1;
        }
        return 0;
    });

    response = items.map((item) => {
        return item.label;
    });

    response.push('\n<i>Times are in CEST</i>');
    return response;
};

export { formatDate, formatDateTime, renderWeekendCalendar };
