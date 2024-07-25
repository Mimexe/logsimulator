import { spawn } from "child_process";
import fs from "fs";
import io from "socket.io-client";
import promptSync from "prompt-sync";
const prompt = promptSync();
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
  } else if (process.argv[2] === "websocket") {
    const url = process.argv[3] || "http://localhost:3000";
    let action = prompt("Do you want to create (c) or join (j) a room? ");
    while (!["c", "j"].includes(action)) {
      action = prompt("Invalid option, please enter c or j: ");
    }
    let name = prompt("Please enter the name: ");
    while (!name) {
      name = prompt("Please enter the name: ");
    }
    let pass = prompt("Please enter the password: ", { echo: "*" });
    while (!pass) {
      pass = prompt("Please enter the password: ", { echo: "*" });
    }
    console.log("Connecting to websocket server...");
    const socket = io(url);
    socket.on("connect", () => {
      console.log("Connected to websocket server");
      socket.emit(
        action == "c" ? "create" : "join",
        {
          name,
          pass,
        },
        (err) => {
          if (err) {
            console.log("Failed to create/join room: " + err);
            process.exit(1);
          } else {
            console.log("Successfully created/joined room");
            if (action == "c") {
              process.stdin.on("data", (data) => {
                let log = data.toString().trim();
                if (log === "/exit") {
                  console.log("Exiting...");
                  process.exit(0);
                }
                socket.emit("send", log);
              });
            }
            if (action == "j") console.clear();
          }
        }
      );
    });
    if (action == "c") {
      socket.on("join", (id) => {
        console.log("Someone (" + id + ") joined the room");
      });
      socket.on("leave", (id) => {
        console.log("Someone (" + id + ") left the room");
      });
    } else {
      socket.on("receive", (msg) => {
        console.log(msg);
      });
    }
    socket.on("error", (err) => {
      console.error("Error:", err);
    });
    socket.on("disconnect", () => {
      if (socket.alive) {
        console.log("Disconnected from websocket server, reconnecting...");
      } else {
        console.log(
          "Disconnected from websocket server, server has closed the connection"
        );
        process.exit(0);
      }
    });
    socket.io.on("reconnect", () => {
      console.log("Reconnected to websocket server");
    });
    socket.io.on("reconnect_attempt", (attempt) => {
      console.log(
        "Attempting to reconnect to websocket server (attempt " + attempt + ")"
      );
    });
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
