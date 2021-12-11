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
}
export interface LogConfig {
  log: Config;
}
export interface Logger {
  level: number;
  map: LogMap;
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
export function log(level: string, getDate: () => string, conf: LogMap, lg: (msg: string) => void, msg: string, m?: SimpleMap): void {
  setTimeout(() => {
    const obj: SimpleMap = {
      [conf.level]: level,
      [conf.time]: getDate(),
      [conf.msg]: msg,
    };
    if (m) {
      const keys = Object.keys(m);
      for (const k of keys) {
        obj[k] = m[k];
      }
    }
    lg(JSON.stringify(obj));
  }, 0);
}
export function getTime(): string {
  const d = new Date();
  return d.toISOString();
}
export class JSONLogger implements Logger {
  constructor(level?: string, conf?: LogMapConfig, getDate?: () => string, lg?: (msg: string) => void) {
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
  level: number;
  map: LogMap;
  getTime: () => string;
  log: (msg: string) => void;
  trace(msg: string, m?: SimpleMap): void {
    if (msg && msg.length > 0 && this.level <= -2) {
      log('trace', this.getTime, this.map, this.log, msg, m);
    }
  }
  debug(msg: string, m?: SimpleMap): void {
    if (msg && msg.length > 0 && this.level <= -1) {
      log('debug', this.getTime, this.map, this.log, msg, m);
    }
  }
  info(msg: string, m?: SimpleMap): void {
    if (msg && msg.length > 0 && this.level <= 0) {
      log('info', this.getTime, this.map, this.log, msg, m);
    }
  }
  warn(msg: string, m?: SimpleMap): void {
    if (msg && msg.length > 0 && this.level <= 1) {
      log('warn', this.getTime, this.map, this.log, msg, m);
    }
  }
  error(msg: string, m?: SimpleMap): void {
    if (msg && msg.length > 0 && this.level <= 2) {
      log('error', this.getTime, this.map, this.log, msg, m);
    }
  }
  panic(msg: string, m?: SimpleMap): void {
    if (msg && msg.length > 0 && this.level <= 3) {
      log('panic', this.getTime, this.map, this.log, msg, m);
    }
  }
  fatal(msg: string, m?: SimpleMap): void {
    if (msg && msg.length > 0 && this.level <= 4) {
      log('fatal', this.getTime, this.map, this.log, msg, m);
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
export const SimpleLogger = JSONLogger;
