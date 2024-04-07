# logger-core

### Structured Logging
 - Supports structured logging, with JSON format, allowing you to attach key-value pairs (fields) to log entries.
 - This makes it easier to filter and analyze logs using tools like Elasticsearch, Splunk, or Logstash.

### Log Levels
- Supports different log levels: trace, debug, info, warn, error, panic, fatal.
- You can specify the log level for each message, and this library will filter messages based on their severity, allowing you to control which messages are logged and where they are logged.

### Integration
- It can be used in a variety of JavaScript environments, including nodejs, browsers, and frontend frameworks like React, Angular and Vue.js.
- It is easy to integrate into your existing projects and workflows, with its flexible and modular design.
- Especially, it is easy to integrate with middleware logging, such as Express and Koa, enable you to log detailed information about incoming requests, outgoing responses, and errors.

### Extensibility
- The default logging destination is console. But it enables you to log messages to various destinations such as files, databases or third-party logging services.

### Asynchronous Logging
- Performs logging asynchronously by default, which helps improve the performance of your applications by minimizing the impact of logging on the main execution thread.

### Compare with Winston
- Much more lightweight than Winston
