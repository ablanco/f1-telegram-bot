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
    const response = [`<b>${weekend.raceName}</b>`];
    let datetime;
    if (weekend.FirstPractice) {
        datetime = formatDateTime(
            weekend.FirstPractice.date,
            weekend.FirstPractice.time
        );
        response.push(`- FP1: ${datetime}`);
    }
    if (weekend.SecondPractice) {
        datetime = formatDateTime(
            weekend.SecondPractice.date,
            weekend.SecondPractice.time
        );
        response.push(`- FP2: ${datetime}`);
    }
    if (weekend.ThirdPractice) {
        datetime = formatDateTime(
            weekend.ThirdPractice.date,
            weekend.ThirdPractice.time
        );
        response.push(`- FP3: ${datetime}`);
    }
    if (weekend.Qualifying) {
        datetime = formatDateTime(
            weekend.Qualifying.date,
            weekend.Qualifying.time
        );
        response.push(`- Qualy: ${datetime}`);
    }
    if (weekend.Sprint) {
        datetime = formatDateTime(weekend.Sprint.date, weekend.Sprint.time);
        response.push(`- Sprint: ${datetime}`);
    }
    datetime = formatDateTime(weekend.date, weekend.time);
    response.push(`- Race: ${datetime}`);
    response.push('\n<i>Times are in CEST</i>');

    return response;
};

export { formatDate, formatDateTime, renderWeekendCalendar };
