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
To start the server without starting the client, use the `--no-client` flag:

```sh
node index.js --no-client
```

To start the client use the `client` argument:

```sh
node index.js client
```

Note: You need a `logs.json` file to make the client work. (without starting the server)

## Commands

- `/exit`: Exit the server and the client
- `/clear`: Clear the client terminal
- `/help`: Show the help message
- `/title <title>`: Change the title of the client

## Troubleshooting

### The client doesn't start with error 'No logs.json file found, exiting...'

You need a `logs.json` file to make the client work.  
You can create one by running the server.  
Or you can create one manually with this content:

```json
[]
```

## License

MIT License
