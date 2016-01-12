"use strict";
var moment = require('moment');
var path = require('path');
var winston = require('winston');
var directory = require('../lib/directory');

var customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
    trace: 4
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'cyan',
    trace: 'cyan'
  }
};

// create the logger
var logger = new (winston.Logger)({
  level: 'trace',
  levels: customLevels.levels,
  handleExceptions: false,
  colors: customLevels.colors,
  transports: [
    // setup console logging
    new (winston.transports.Console)({
      level: 'debug',
      levels: customLevels.levels,
      handleExceptions: false,
      colorize: true,
      timestamp: function() {
        return moment().format();
      }
    })
  ]
});

logger.addHomeLogs = (home) => {
  logger.add(winston.transports.File, {
    level: 'info',
    levels: customLevels.levels,
    handleExceptions: false,
    colorize: true,
    tailable: true,
    maxsize: 50 * 1024 * 1024, // 50 MB
    maxFiles: 3,
    //zippedArchive: true,
    json: false,
    filename: path.join(home, 'ucoin.log'),
    timestamp: function() {
      return moment().format();
    }
  });
};

logger.mute = () => {
  logger.remove(winston.transports.Console);
};

/**
* Convenience function to get logger directly
*/
module.exports = () => logger;
