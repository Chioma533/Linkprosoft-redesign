export const debugLog = (label, value) => {
  try {
    const raw = localStorage.getItem("debugLogs") || "[]";
    const logs = JSON.parse(raw);
    logs.push({ timestamp: new Date().toISOString(), label, value });
    localStorage.setItem("debugLogs", JSON.stringify(logs));
    // keep console output too
    console.debug(`[debugLogger] ${label}`, value);
  } catch (e) {
    // best effort
    console.warn("[debugLogger] failed to write log", e);
  }
};

export const getDebugLogs = () => {
  try {
    return JSON.parse(localStorage.getItem("debugLogs") || "[]");
  } catch (e) {
    return [];
  }
};

export const clearDebugLogs = () => {
  try {
    localStorage.removeItem("debugLogs");
  } catch (e) {
    console.warn("[debugLogger] clear failed", e);
  }
};

export const downloadDebugLogs = () => {
  try {
    const logs = localStorage.getItem("debugLogs") || "[]";
    const blob = new Blob([logs], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `debug-logs-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (e) {
    console.warn("[debugLogger] download failed", e);
  }
};

// Expose quick helpers on window for easy retrieval in console during debugging
try {
  window.getDebugLogs = getDebugLogs;
  window.downloadDebugLogs = downloadDebugLogs;
  window.clearDebugLogs = clearDebugLogs;
} catch (e) {
  // ignore environments where window isn't writable
}

export default debugLog;