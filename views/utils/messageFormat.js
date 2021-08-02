const moment = require('moment');


// receives 2 arguments and merge it into object and returns back.
const messageFormat = (username, text) => {
    return {
        username,
        text,
        time: moment().format('h:mm a')
    }
}

module.exports = messageFormat;