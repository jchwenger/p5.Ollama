# Source

The template for this app was first inspired by [this example](https://lab.arts.ac.uk/books/web-technology/page/web-app-template-for-beginners), and completed by the following resources:

- The official Socket.io [Get started](https://socket.io/get-started/chat), [Server](https://socket.io/docs/v4/server-api/) and [Client](https://socket.io/docs/v4/client-api/) pages;
- The lovely tutorial by [Dan Shiffman](https://www.youtube.com/playlist?list=PLRqwX-V7Uu6b36TzJidYfIYwTFEq3K5qH).

See also the [[Ollama API reference](https://github.com/ollama/ollama-js).

---

## NPM

Install [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) (the Node Version Manager) that will install and manage `npm` and `node` for you.

First, install the packages:

```bash
cd p5.Ollama/
npm install
```

## Ollama server

You must have [Ollama](https://ollama.com/) installed on your machine, and the Ollama server up and running (in the terminal that's `ollama run`). You also need to download the models you want to use before running this (with `ollama pull <model-name>`).

## Running the server

This sketch requires you to have npm installed, and to use the plain `node server.js` command or 'nodemon server.js' (that reloads the server whenever you save changes).

```bash
node server.js
```

Or

```bash
nodemon server.js
```
