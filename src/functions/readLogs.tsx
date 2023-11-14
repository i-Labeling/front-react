import * as fs from "fs";

interface LogEntry {
  inspection: string;
  labeling: string;
  validateLabel: string;
  leaveMemory: string;
  errorMemory: string;
  takeMemory: string;
  path: string;
}

interface LastPaths {
  sodimm: string | null;
  udimm: string | null;
}

const readLogs = (): LastPaths => {
  const logData = fs.readFileSync("apiDashboard/log.json", "utf8");
  const logs: LogEntry[] = JSON.parse(logData);

  const lastSodimmEntry = logs
    .slice()
    .reverse()
    .find((log) => log.path && log.path.toLowerCase().includes("sodimm"));

  const lastUdimmEntry = logs
    .slice()
    .reverse()
    .find((log) => log.path && log.path.toLowerCase().includes("udimm"));

  return {
    sodimm: lastSodimmEntry ? lastSodimmEntry.path : null,
    udimm: lastUdimmEntry ? lastUdimmEntry.path : null,
  };
};

export default readLogs;
