// Copyright (c) 2022 Alejandro Blanco <alejandro.b.e@gmail.com>
// MIT License

import dayjs from 'dayjs';

const formatDate = function (date) {
    return dayjs(date, 'YYYY-MM-DD').format('MMM D, YYYY');
};

const formatDateTime = function (date, time) {
    return dayjs(`${date} ${time}`).format('MMM D, YYYY - HH:mm');
};

export { formatDate, formatDateTime };
