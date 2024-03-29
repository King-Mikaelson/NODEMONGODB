const { v4: uuid } = require("uuid");
const { format } = require("date-fns");
// import { v4 as uuidv4 } from 'uuid';
// import {format} from 'date-fns/format';

const fs = require("fs");
const path = require("path");
const fsPromises = require("fs").promises;

const logEvents = async (message, logName) => {
  const dateTime = `${format(new Date(), "yyyy-MM-dd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
  console.log(logItem);
  try {
    if (!fs.existsSync(path.join(__dirname, '..',"logs"))) {
      await fsPromises.mkdir(path.join(__dirname, '..', "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, '..', "logs", logName),
      logItem
    );
  } catch (error) {
    console.log(error);
  }
};
 

const logger = (req,res, next) =>{
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt')
    console.log(`Request Logged: ${req.url} ${req.method}`)
    next();
}


module.exports = {logger, logEvents};
