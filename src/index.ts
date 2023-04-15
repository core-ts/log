import * as http from 'http';

export interface NumberMap {
  [key: string]: number;
}
export interface SimpleMap {
  [key: string]: string|number|boolean|Date;
}
export interface LogMap {
  time: string;
  level: string;
  msg: string;
}
export interface LogMapConfig {
  time?: string;
  level?: string;
  msg?: string;
}
export interface Config {
  level?: string;
  map?: LogMapConfig;
  constants?: SimpleMap;
  name?: Name;
}
export type LogConf = Config;
export interface LogConfig {
  log: Config;
}
export interface Name {
  trace: string;
  debug: string;
  info: string;
  warn: string;
  error: string;
  panic: string;
  fatal: string;
}
export const name: Name = {
  trace: 'trace',
  debug: 'debug',
  info: 'info',
  warn: 'warn',
  error: 'error',
  panic: 'panic',
  fatal: 'fatal'
};
export const NAME: Name = {
  trace: 'TRACE',
  debug: 'DEBUG',
  info: 'INFO',
  warn: 'WARN',
  error: 'ERROR',
  panic: 'PANIC',
  fatal: 'FATAL'
};
export interface Logger {
  name: Name;
  level: number;
  map: LogMap;
  constants?: SimpleMap;
  trace(msg: string, m?: SimpleMap, ctx?: any): void;
  debug(msg: string, m?: SimpleMap, ctx?: any): void;
  info(msg: string, m?: SimpleMap, ctx?: any): void;
  warn(msg: string, m?: SimpleMap, ctx?: any): void;
  error(msg: string, m?: SimpleMap, ctx?: any): void;
  panic(msg: string, m?: SimpleMap, ctx?: any): void;
  fatal(msg: string, m?: SimpleMap, ctx?: any): void;
  isLevelEnabled(level: number): boolean;
  isTraceEnabled(): boolean;
  isDebugEnabled(): boolean;
  isInfoEnabled(): boolean;
  isWarnEnabled(): boolean;
  isErrorEnabled(): boolean;
  isPanicEnabled(): boolean;
  isFatalEnabled(): boolean;
}
export const map: NumberMap = {
  TRACE: -2,
  DEBUG: -1,
  INFO: 0,
  WARN: 1,
  ERROR: 2,
  PANIC: 3,
  FATAL: 4
};
export function createLevel(level?: string) {
  if (!level) {
    return 0;
  }
  const lv = map[level.toUpperCase()];
  return (lv !== undefined ? lv : 0);
}
export function createMap(c?: LogMapConfig): LogMap {
  if (!c) {
    return {msg: 'msg', time: 'time', level: 'level'};
  }
  const msg = (c.msg && c.msg.length > 0 ? c.msg : 'msg');
  const time = (c.time && c.time.length > 0 ? c.time : 'time');
  const level = (c.level && c.level.length > 0 ? c.level : 'level');
  return {msg, time, level};
}
export function log(level: string, getDate: () => string, conf: LogMap, lg: (msg: string) => void, msg: string, c?: SimpleMap, m?: SimpleMap): void {
  setTimeout(() => {
    const g: SimpleMap = {};
    g[conf.level] = level;
    g[conf.time] = getDate();
    if (c) {
      const keys = Object.keys(c);
      for (const k of keys) {
        g[k] = c[k];
      }
    }
    g[conf.msg] = msg;
    if (m) {
      const keys = Object.keys(m);
      for (const k of keys) {
        g[k] = m[k];
      }
    }
    lg(JSON.stringify(g));
  }, 0);
}
export function getTime(): string {
  const d = new Date();
  return d.toISOString();
}
export function createLogger(c: Config, getDate?: () => string, n?: Name, er?: (msg: string) => void, lg?: (msg: string) => void): L {
  return new L(c.level, c.map, c.constants, getDate, n, er, lg);
}
export class L implements Logger {
  constructor(level?: string, conf?: LogMapConfig, c?: SimpleMap, getDate?: () => string, n?: Name, er?: (msg: string) => void, lg?: (msg: string) => void) {
    this.name = (n ? n : name);
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
  name: Name;
  level: number;
  map: LogMap;
  constants?: SimpleMap;
  getTime: () => string;
  log: (msg: string) => void;
  err: (msg: string) => void;
  trace(msg: string, m?: SimpleMap): void {
    if (msg && msg.length > 0 && this.level <= -2) {
      log(this.name.trace, this.getTime, this.map, this.log, msg, this.constants, m);
    }
  }
  debug(msg: string, m?: SimpleMap): void {
    if (msg && msg.length > 0 && this.level <= -1) {
      log(this.name.debug, this.getTime, this.map, this.log, msg, this.constants, m);
    }
  }
  info(msg: string, m?: SimpleMap): void {
    if (msg && msg.length > 0 && this.level <= 0) {
      log(this.name.info, this.getTime, this.map, this.log, msg, this.constants, m);
    }
  }
  warn(msg: string, m?: SimpleMap): void {
    if (msg && msg.length > 0 && this.level <= 1) {
      log(this.name.warn, this.getTime, this.map, this.log, msg, this.constants, m);
    }
  }
  error(msg: string, m?: SimpleMap): void {
    if (msg && msg.length > 0 && this.level <= 2) {
      log(this.name.error, this.getTime, this.map, this.err, msg, this.constants, m);
    }
  }
  panic(msg: string, m?: SimpleMap): void {
    if (msg && msg.length > 0 && this.level <= 3) {
      log(this.name.panic, this.getTime, this.map, this.err, msg, this.constants, m);
    }
  }
  fatal(msg: string, m?: SimpleMap): void {
    if (msg && msg.length > 0 && this.level <= 4) {
      log(this.name.fatal, this.getTime, this.map, this.err, msg, this.constants, m);
    }
  }
  isLevelEnabled(level: number): boolean {
    return (this.level <= level);
  }
  isTraceEnabled(): boolean {
    return (this.level <= -2);
  }
  isDebugEnabled(): boolean {
    return (this.level <= -1);
  }
  isInfoEnabled(): boolean {
    return (this.level <= 0);
  }
  isWarnEnabled(): boolean {
    return (this.level <= 1);
  }
  isErrorEnabled(): boolean {
    return (this.level <= 2);
  }
  isPanicEnabled(): boolean {
    return (this.level <= 3);
  }
  isFatalEnabled(): boolean {
    return (this.level <= 4);
  }
}
export const JSONLogger = L;
export const SimpleLogger = L;

// tslint:disable-next-line:max-classes-per-file
export class LogController {
  map: NumberMap;
  constructor(public logger: Logger, mp?: NumberMap) {
    this.map = (mp ? mp : map);
    this.config = this.config.bind(this);
  }
  config(req: http.IncomingMessage, res: http.ServerResponse) {
    getBody(req).then(body => {
      const obj: Config = JSON.parse(body);
      if (!obj || (obj as any) === '') {
        res.writeHead(400).end('The request body cannot be empty');
      }
      if (!this.logger) {
        res.writeHead(503).end('Logger is not available');
      }
      if (typeof obj.level === 'string' && obj.level.length > 0) {
        if (!this.map) {
          res.writeHead(503).end('Map is not available');
        }
      }
      const changed = update(this.logger, obj, this.map);
      if (changed) {
        res.writeHead(200).end('true');
      } else {
        res.writeHead(204).end('false');
      }
    });
  }
}
export const LogHandler = LogController;
export function getBody(req: http.IncomingMessage): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      let body = '';
      // listen to data sent by client
      req.on('data', (chunk: { toString: () => string; }) => {
        // append the string version to the body
        body += chunk.toString();
      });
      // listen till the end
      req.on('end', () => {
        // send back the data
        resolve(body);
      });
    } catch (err) {
      reject(err);
    }
  });
}
export function update(logger: Logger, obj: Config, mp: NumberMap): boolean {
  let changed = false;
  if (typeof obj.level === 'string' && obj.level.length > 0) {
    const lv = mp[obj.level.toUpperCase()];
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
    const ks = Object.keys(obj.constants);
    if (ks.length > 0) {
      logger.constants = obj.constants;
    } else {
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
export const updateLog = update;
export const change = update;
export const changeLog = update;
