import { spawn } from "child_process";
import fs from "fs";
(async () => {
  if (process.argv[2] === "client") {
    process.title = "node index.js";
    const log = () => {
      if (!fs.existsSync("logs.json")) {
        process.exit(0);
      }
      const data = fs.readFileSync("logs.json");
      const logs = JSON.parse(data);
      console.clear();
      if (logs.length === 0) return;
      if (logs[logs.length - 1] === "[{<!%title%!>}]") {
        const title = fs.readFileSync("title.txt").toString();
        process.title = title;
        fs.unlinkSync("title.txt");
        logs.pop();
        fs.writeFileSync("logs.json", JSON.stringify(logs));
        return;
      }
      console.log(logs.join("\n"));
    };
    if (!fs.existsSync("logs.json")) {
      console.log("No logs.json file found, exiting...");
      process.exit(1);
    }
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
    if (log.startsWith("/title")) {
      const title = log.split(" ").slice(1).join(" ");
      if (!title) return console.log("No title provided");
      fs.writeFileSync("title.txt", title);
      logs.push(`[{<!%title%!>}]`);
      fs.writeFileSync("logs.json", JSON.stringify(logs));
      logs.pop();
      console.log("Changed title");
      return;
    }
    if (log === "/help") {
      console.log("Help:");
      console.log("/exit - Exits the server");
      console.log("/clear - Clears the logs");
      console.log("/title <title> - Changes the client title");
      console.log("/help - Shows this message");
      return;
    }
    if (!log) return;
    logs.push(log);
    fs.writeFileSync("logs.json", JSON.stringify(logs));
    console.log("Writed to logs.json");
  });
  if (process.argv.includes("--no-client")) {
    console.log("--no-client flag detected, not starting client");
  } else {
    spawn("node", ["index.js", "client"], {
      detached: true,
      shell: true,
    });
  }
  console.log("Listening for input...");
  console.log("Help:");
  console.log("/exit - Exits the server");
  console.log("/clear - Clears the logs");
  console.log("/title <title> - Changes the client title");
  console.log("/help - Shows this message");
  process.stdin.resume();
  console.log("Server started");
  process.on("SIGINT", () => {
    console.log("Exiting...");
    fs.unlinkSync("logs.json");
    process.exit(0);
  });
})();
