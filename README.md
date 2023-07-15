# Logs Simulator

Simulate logs in your terminal

## Installation:

Clone the repo:

```sh
git clone https://github.com/Mimexe/logsimulator.git
```

## Usage

First of all, run the server:

```sh
node index.js
```

Then, the client will automatically start and watch for the `logs.json` file change to update.  
In the server, you can add logs by simply type in the terminal and hit enter.  
To exit the server, type `/exit` and hit enter or simply hit CTRL+C.  
The client will exit automatically when the server is closed (gracefully).  
You can clear the client terminal with `/clear` command.

## Commands

- `/exit`: Exit the server and the client
- `/clear`: Clear the client terminal
