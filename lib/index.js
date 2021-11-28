"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createLevel(level) {
  if (!level) {
    return 0;
  }
  level = level.toUpperCase();
  if (level === 'ERROR') {
    return 2;
  }
  if (level === 'INFO') {
    return 0;
  }
  if (level === 'WARN') {
    return 1;
  }
  if (level === 'DEBUG') {
    return -1;
  }
  if (level === 'PANIC') {
    return 3;
  }
  if (level === 'FATAL') {
    return 4;
  }
  if (level === 'TRACE') {
    return -2;
  }
  return 0;
}
exports.createLevel = createLevel;
function createMap(c) {
  if (!c) {
    return { msg: 'msg', time: 'time', level: 'level' };
  }
  var msg = (c.msg && c.msg.length > 0 ? c.msg : 'msg');
  var time = (c.time && c.time.length > 0 ? c.time : 'time');
  var level = (c.level && c.level.length > 0 ? c.level : 'level');
  return { msg: msg, time: time, level: level };
}
exports.createMap = createMap;
function log(level, getDate, conf, lg, msg, m) {
  setTimeout(function () {
    var _a;
    var obj = (_a = {},
      _a[conf.level] = level,
      _a[conf.time] = getDate(),
      _a[conf.msg] = msg,
      _a);
    if (m) {
      var keys = Object.keys(m);
      for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var k = keys_1[_i];
        obj[k] = m[k];
      }
    }
    lg(JSON.stringify(obj));
  }, 0);
}
exports.log = log;
function getTime() {
  var d = new Date();
  return d.toISOString();
}
exports.getTime = getTime;
var JSONLogger = /** @class */ (function () {
  function JSONLogger(level, conf, getDate, lg) {
    this.level = createLevel(level);
    this.map = createMap(conf);
    this.log = (lg ? lg : console.log);
    this.getTime = (getDate ? getDate : getTime);
    this.trace = this.trace.bind(this);
    this.debug = this.debug.bind(this);
    this.info = this.info.bind(this);
    this.warn = this.warn.bind(this);
    this.error = this.error.bind(this);
    this.panic = this.panic.bind(this);
    this.fatal = this.fatal.bind(this);
    this.isLevelEnabled = this.isLevelEnabled.bind(this);
    this.isTraceEnabled = this.isTraceEnabled.bind(this);
    this.isDebugEnabled = this.isDebugEnabled.bind(this);
    this.isInfoEnabled = this.isInfoEnabled.bind(this);
    this.isWarnEnabled = this.isWarnEnabled.bind(this);
    this.isErrorEnabled = this.isErrorEnabled.bind(this);
    this.isPanicEnabled = this.isPanicEnabled.bind(this);
    this.isFatalEnabled = this.isFatalEnabled.bind(this);
  }
  JSONLogger.prototype.trace = function (msg, m) {
    if (msg && msg.length > 0 && this.level >= -2) {
      log('trace', this.getTime, this.map, this.log, msg, m);
    }
  };
  JSONLogger.prototype.debug = function (msg, m) {
    if (msg && msg.length > 0 && this.level >= -1) {
      log('debug', this.getTime, this.map, this.log, msg, m);
    }
  };
  JSONLogger.prototype.info = function (msg, m) {
    if (msg && msg.length > 0 && this.level >= -1) {
      log('info', this.getTime, this.map, this.log, msg, m);
    }
  };
  JSONLogger.prototype.warn = function (msg, m) {
    if (msg && msg.length > 0 && this.level >= -1) {
      log('warn', this.getTime, this.map, this.log, msg, m);
    }
  };
  JSONLogger.prototype.error = function (msg, m) {
    if (msg && msg.length > 0 && this.level >= -1) {
      log('error', this.getTime, this.map, this.log, msg, m);
    }
  };
  JSONLogger.prototype.panic = function (msg, m) {
    if (msg && msg.length > 0 && this.level >= -1) {
      log('panic', this.getTime, this.map, this.log, msg, m);
    }
  };
  JSONLogger.prototype.fatal = function (msg, m) {
    if (msg && msg.length > 0 && this.level >= -1) {
      log('fatal', this.getTime, this.map, this.log, msg, m);
    }
  };
  JSONLogger.prototype.isLevelEnabled = function (level) {
    return (this.level >= level);
  };
  JSONLogger.prototype.isTraceEnabled = function () {
    return (this.level >= -2);
  };
  JSONLogger.prototype.isDebugEnabled = function () {
    return (this.level >= -1);
  };
  JSONLogger.prototype.isInfoEnabled = function () {
    return (this.level >= 0);
  };
  JSONLogger.prototype.isWarnEnabled = function () {
    return (this.level >= 1);
  };
  JSONLogger.prototype.isErrorEnabled = function () {
    return (this.level >= 2);
  };
  JSONLogger.prototype.isPanicEnabled = function () {
    return (this.level >= 3);
  };
  JSONLogger.prototype.isFatalEnabled = function () {
    return (this.level >= 4);
  };
  return JSONLogger;
}());
exports.JSONLogger = JSONLogger;
exports.SimpleLogger = JSONLogger;
