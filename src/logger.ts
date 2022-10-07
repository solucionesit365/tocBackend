const logger = require("node-file-logger");

const options = {
  timeZone: "Europe/Madrid",
  folderPath: "./logs/",
  dateBasedFileNaming: true,
  fileNamePrefix: "logTocBackend_",
  fileNameExtension: ".log",
  dateFormat: "YYYY_MM_DD",
  timeFormat: "HH:mm:ss",
};

logger.SetUserOptions(options);

export { logger };
