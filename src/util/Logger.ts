import { ILogObj, Logger as tsLog } from "tslog";
import ErrorTransmitter from "./ErrorTransmitter";
const Logger: tsLog<ILogObj> = new tsLog({
	type: 'pretty',
    prettyLogTimeZone: 'local',
	prettyLogTemplate: "{{yyyy}}.{{mm}}.{{dd}} {{hh}}:{{MM}}:{{ss}}:{{ms}}\t{{logLevelName}}\t",
});

Logger.attachTransport( logObj =>
	ErrorTransmitter.handleLog(logObj)
);

export default Logger;