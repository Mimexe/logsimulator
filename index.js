import { spawn } from "child_process";
import fs from "fs";
(async () => {
  if (process.argv[2] === "client") {
    console.log("Starting in client mode...");
    process.title = "node index.js";
    const log = () => {
      if (!fs.existsSync("logs.json")) {
        console.log("No logs.json file found");
        process.exit(0);
      }
      const data = fs.readFileSync("logs.json");
      const logs = JSON.parse(data);
      console.clear();
      if (logs.length === 0) return;
      console.log(logs.join("\n"));
    };
    log();
    fs.watch("logs.json", log);
    return;
  }
  let logs = [];
  console.log("Starting in server mode...");
  fs.writeFileSync("logs.json", "[]");
  process.stdin.on("data", async (data) => {
    let log = data.toString().trim();
    if (log === "/exit") {
      console.log("Exiting...");
      fs.unlinkSync("logs.json");
      process.exit(0);
    }
    if (log === "/clear") {
      logs = [];
      fs.writeFileSync("logs.json", "[]");
      console.log("Cleared logs");
      return;
    }
    if (!log) return;
    logs.push(log);
    fs.writeFileSync("logs.json", JSON.stringify(logs) + "\n");
    console.log("Writed to logs.json");
  });
  spawn("node", ["index.js", "client"], {
    detached: true,
    shell: true,
  });
  console.log("Listening for input...");
  console.log("Type 'exit' to exit");
  process.stdin.resume();
  console.log("Server started");
  process.on("SIGINT", () => {
    console.log("Exiting...");
    fs.unlinkSync("logs.json");
    process.exit(0);
  });
})();
