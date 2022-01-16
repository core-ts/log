"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.name = {
  trace: 'trace',
  debug: 'debug',
  info: 'info',
  warn: 'warn',
  error: 'error',
  panic: 'panic',
  fatal: 'fatal'
};
exports.NAME = {
  trace: 'TRACE',
  debug: 'DEBUG',
  info: 'INFO',
  warn: 'WARN',
  error: 'ERROR',
  panic: 'PANIC',
  fatal: 'FATAL'
};
exports.map = {
  TRACE: -2,
  DEBUG: -1,
  INFO: 0,
  WARN: 1,
  ERROR: 2,
  PANIC: 3,
  FATAL: 4
};
function createLevel(level) {
  if (!level) {
    return 0;
  }
  var lv = exports.map[level.toUpperCase()];
  return (lv !== undefined ? lv : 0);
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
function log(level, getDate, conf, lg, msg, c, m) {
  setTimeout(function () {
    var g = {};
    g[conf.level] = level;
    g[conf.time] = getDate();
    if (c) {
      var keys = Object.keys(c);
      for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var k = keys_1[_i];
        g[k] = c[k];
      }
    }
    g[conf.msg] = msg;
    if (m) {
      var keys = Object.keys(m);
      for (var _a = 0, keys_2 = keys; _a < keys_2.length; _a++) {
        var k = keys_2[_a];
        g[k] = m[k];
      }
    }
    lg(JSON.stringify(g));
  }, 0);
}
exports.log = log;
function getTime() {
  var d = new Date();
  return d.toISOString();
}
exports.getTime = getTime;
function createLogger(c, getDate, n, er, lg) {
  return new L(c.level, c.map, c.constants, getDate, n, er, lg);
}
exports.createLogger = createLogger;
var L = (function () {
  function L(level, conf, c, getDate, n, er, lg) {
    this.name = (n ? n : exports.name);
    this.level = createLevel(level);
    this.map = createMap(conf);
    this.constants = c;
    this.log = (lg ? lg : console.log);
    this.err = (er ? er : console.error);
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
  L.prototype.trace = function (msg, m) {
    if (msg && msg.length > 0 && this.level <= -2) {
      log(this.name.trace, this.getTime, this.map, this.log, msg, this.constants, m);
    }
  };
  L.prototype.debug = function (msg, m) {
    if (msg && msg.length > 0 && this.level <= -1) {
      log(this.name.debug, this.getTime, this.map, this.log, msg, this.constants, m);
    }
  };
  L.prototype.info = function (msg, m) {
    if (msg && msg.length > 0 && this.level <= 0) {
      log(this.name.info, this.getTime, this.map, this.log, msg, this.constants, m);
    }
  };
  L.prototype.warn = function (msg, m) {
    if (msg && msg.length > 0 && this.level <= 1) {
      log(this.name.warn, this.getTime, this.map, this.log, msg, this.constants, m);
    }
  };
  L.prototype.error = function (msg, m) {
    if (msg && msg.length > 0 && this.level <= 2) {
      log(this.name.error, this.getTime, this.map, this.err, msg, this.constants, m);
    }
  };
  L.prototype.panic = function (msg, m) {
    if (msg && msg.length > 0 && this.level <= 3) {
      log(this.name.panic, this.getTime, this.map, this.err, msg, this.constants, m);
    }
  };
  L.prototype.fatal = function (msg, m) {
    if (msg && msg.length > 0 && this.level <= 4) {
      log(this.name.fatal, this.getTime, this.map, this.err, msg, this.constants, m);
    }
  };
  L.prototype.isLevelEnabled = function (level) {
    return (this.level <= level);
  };
  L.prototype.isTraceEnabled = function () {
    return (this.level <= -2);
  };
  L.prototype.isDebugEnabled = function () {
    return (this.level <= -1);
  };
  L.prototype.isInfoEnabled = function () {
    return (this.level <= 0);
  };
  L.prototype.isWarnEnabled = function () {
    return (this.level <= 1);
  };
  L.prototype.isErrorEnabled = function () {
    return (this.level <= 2);
  };
  L.prototype.isPanicEnabled = function () {
    return (this.level <= 3);
  };
  L.prototype.isFatalEnabled = function () {
    return (this.level <= 4);
  };
  return L;
}());
exports.L = L;
exports.JSONLogger = L;
exports.SimpleLogger = L;
var LogController = (function () {
  function LogController(logger, mp) {
    this.logger = logger;
    this.map = (mp ? mp : exports.map);
    this.config = this.config.bind(this);
  }
  LogController.prototype.config = function (req, res) {
    var _this = this;
    getBody(req).then(function (body) {
      var obj = JSON.parse(body);
      console.log(obj);
      if (!obj || obj === '') {
        res.writeHead(400).end('The request body cannot be empty');
      }
      if (!_this.logger) {
        res.writeHead(503).end('Logger is not available');
      }
      if (typeof obj.level === 'string' && obj.level.length > 0) {
        if (!_this.map) {
          res.writeHead(503).end('Map is not available');
        }
      }
      var changed = update(_this.logger, obj, _this.map);
      if (changed) {
        res.writeHead(200).end('true');
      }
      else {
        res.writeHead(204).end('false');
      }
    });
  };
  return LogController;
}());
exports.LogController = LogController;
exports.LogHandler = LogController;
function getBody(req) {
  return new Promise(function (resolve, reject) {
    try {
      var body_1 = '';
      req.on('data', function (chunk) {
        body_1 += chunk.toString();
      });
      req.on('end', function () {
        resolve(body_1);
      });
    }
    catch (err) {
      reject(err);
    }
  });
}
exports.getBody = getBody;
function update(logger, obj, mp) {
  var changed = false;
  if (typeof obj.level === 'string' && obj.level.length > 0) {
    var lv = mp[obj.level.toUpperCase()];
    if (lv !== undefined) {
      logger.level = lv;
      changed = true;
    }
  }
  if (obj.map) {
    if (typeof obj.map.level === 'string' && obj.map.level.length > 0) {
      logger.map.level = obj.map.level;
      changed = true;
    }
    if (typeof obj.map.time === 'string' && obj.map.time.length > 0) {
      logger.map.time = obj.map.time;
      changed = true;
    }
    if (typeof obj.map.msg === 'string' && obj.map.msg.length > 0) {
      logger.map.msg = obj.map.msg;
      changed = true;
    }
  }
  if (obj.constants !== undefined && typeof obj.constants === 'object') {
    var ks = Object.keys(obj.constants);
    if (ks.length > 0) {
      logger.constants = obj.constants;
    }
    else {
      logger.constants = undefined;
    }
    changed = true;
  }
  if (obj.name) {
    if (typeof obj.name.trace === 'string'
      && typeof obj.name.debug === 'string'
      && typeof obj.name.info === 'string'
      && typeof obj.name.warn === 'string'
      && typeof obj.name.error === 'string'
      && typeof obj.name.panic === 'string'
      && typeof obj.name.fatal === 'string') {
      logger.name = obj.name;
      changed = true;
    }
  }
  return changed;
}
exports.update = update;
exports.updateLog = update;
exports.change = update;
exports.changeLog = update;
