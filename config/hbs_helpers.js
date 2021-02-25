const moment = require('moment');

module.exports = {
    formatDate: function (date, format) {
        return moment(date).format(format);

    },
    truncate: function (str, len) {
        if (str.length > len && str.length > 0) {
            let new_str = str + ' ';
            new_str = str.substr(0, len);
            new_str = str.substr(0, new_str.lastIndexOf(' '));
            new_str = new_str.length > 0 ? new_str : str.substr(0, len);
            return new_str + ' ... ';
        }
        return str;
    },
    serialNumber: function (indexVal) {
        return parseInt(indexVal) + 1;
    },
    ifEquals: function (arg1, arg2, options) {
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    },
    ifNEquals: function (arg1, arg2, options) {
        return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
    }
}