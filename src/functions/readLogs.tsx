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

const readLogs = async (): Promise<LastPaths> => {
  try {
    const response = await fetch("apiDashboard/log.json");
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const logs: LogEntry[] = await response.json();

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
  } catch (error) {
    console.error("Error fetching logs:", error);
    // Return default values or handle the error as needed
    return {
      sodimm: null,
      udimm: null,
    };
  }
};

export default readLogs;
