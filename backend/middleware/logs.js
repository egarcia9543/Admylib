const fs = require('fs');

exports.activityLog = (filename, logData) => {
    fs.appendFile(filename, logData, (err) => {
        if (err) throw err;
        console.log('Log saved');
    });
};
