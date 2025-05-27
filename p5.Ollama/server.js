// --------------------------------------------------------------------------------
// P5js + Node server with websockets and the Ollama API
//
// Jérémie Wenger, 2025
// With Robin Leverton and Nathan Bayliss, in the context of *Tech, Tea + Exchange*:
// A residency in partnership with Tate, Anthropic, Goldsmiths and UAL
// --------------------------------------------------------------------------------

// model globals, see list here
// https://ollama.com/search
// NOTE: You *must* have downloaded them beforehand!
//       ollama pull <model-name> 
//       or
//       ollama run <model-name> // then stop the chat
const GEN_MODEL =  'llama3.2:1b';
const CHAT_MODEL = 'llama3.2:1b';
const MULTI_MODEL =  'gemma3:4b';

import ollama from 'ollama';

ollama.list()
  .then((list) => {
    console.log('----------------------------------------');
    console.log('available local models:');
    for (const m of list.models) {
      console.log(` - ${m.name}`);
    }
    console.log('----------------------------------------');
  });

// // debugging test: stream
// const response = await ollama.generate({
//     model: GEN_MODEL,
//     prompt: 'Hello',
//     system: 'You are a helpful assistant.',
//     stream: true,
//     options: {
//       temperature: 1.0,
//       num_predict: -1,
//     }
//   });
// for await (const part of response) {
//   process.stdout.write(part.response);
// }
// process.stdout.write('\n');

// // debugging test: no stream
// const response = await ollama.generate({
//     model: GEN_MODEL,
//     prompt: 'Hello',
//     system: 'You are a helpful assistant.',
//     stream: false,
//     options: {
//       temperature: 1.0,
//       num_predict: -1,
//     }
//   });
// console.log(response.response);

// https://socket.io/get-started/chat#integrating-socketio
// See also Dan Shiffman's tutorial on Node & Websockets for more information
// https://www.youtube.com/watch?v=bjULmG8fqc8&list=PLRqwX-V7Uu6b36TzJidYfIYwTFEq3K5qH

import express from 'express';
import { Server } from 'socket.io';

const app = express();
const port = 3000;
const server = app.listen(port, () => {
    console.log(`it works. listening on port ${server.address().port}`);
}); // https://stackoverflow.com/a/4842885

// make our 'public' folder visible to the outside world
app.use(express.static('public'));

const io = new Server(server);

io.on('connection', (socket) => {

  console.log(`connection! id: ${socket.id}`);
  // console.log(socket);

  io.emit('message', 'hello');
  // console.log('sent message');

  // ! See requestCompletion for notes on available models
  socket.on('completion request', (message, sock) => {
    console.log(`completion requested by user:`);
    console.log(message);
    sock('the server received your completion request');
    console.log('making request to the model...');
    console.log(...Object.values(message));
    requestCompletion(...Object.values(message))
      .then((response) => {
        // console.log(response); // see the full horror of the response object
        const t = response.response;
        console.log(t);
        io.emit('completion response', t);
        console.log('it answered!');
        console.log('----------------------------------------');
      })
      .catch((e) => {
        io.emit('completion response', `[server says: oops, error: ${e.error}]`);
        console.error(e);
      });
  });

  socket.on('chat request', (message, sock) => {
    console.log(`chat requested by user:`);
    console.log(message);
    sock('the server received your chat request');
    console.log('making request to the model...');
    requestMessage(...Object.values(message))
      .then((response) => {
        // console.log(response); // see the full horror of the response object
        const t = response.message.content;
        console.log(t);
        io.emit('chat response', t);
        console.log('it answered!');
        console.log('----------------------------------------');
      })
      .catch((e) => {
        io.emit('chat response',  `[server says: oops, error: ${e.error}]`);
        console.error(e);
      });
  });

  socket.on('image request', (message, sock) => {
    console.log(`image requested by user:`);
    // console.log(message); // this will print the entire base64 string
    sock('the server received your image request');
    console.log('making request to the model...');
    requestImageAnalysis(...Object.values(message))
      .then((response) => {
        // console.log(response); // see the full horror of the response object
        const t = response.message.content;
        console.log(t);
        io.emit('image response', t);
        console.log('it answered!');
        console.log('----------------------------------------');
      })
      .catch((e) => {
        io.emit('image response',  `[server says: oops, error: ${e.error}]`);
        console.error(e);
      });
  });

});

// separate async function (required if we want to use the await keyword)
// this allows us to make a call to the API, and wait for it to respond
// without breaking our code
async function requestCompletion(
  prompt = 'Say: "this is a test".',
  system_prompt = 'You are a helpful assistant.',
  max_tokens = -1, // no limit
  temperature = 0.7,
) {
  // console.log('inside requestCompletion', prompt, max_tokens, temperature);
  // https://github.com/ollama/ollama-js?tab=readme-ov-file#generate
  console.log(`requestion completion with ${max_tokens} tokens, temperature: ${temperature}`);
  return await ollama.generate({
    model: GEN_MODEL, // TODO: search the documentation for various models, possibly allow the user to change this from the UI.
    prompt: prompt,       //       For available models, see here: https://ollama.com/library
    system: system_prompt,
    template: '',         // overriding model template: no special tokens etc.
    raw: true,            // will be added in the background
    stream: false,        // TODO: implement streaming
    options: {
      temperature: parseFloat(temperature),  // security checks
      num_predict: parseInt(max_tokens),     // for the variable type
    }
  });
}

async function requestMessage(
  prompt = 'Say this is a test',
  system_prompt = 'You are William Shakespeare and speak like in the 1590s.',
  max_tokens = -1, // no limit
  temperature = 0.7,
) {
  // console.log('inside requestChat', prompt, system_prompt, max_tokens, temperature);
  return await ollama.chat({
    model: CHAT_MODEL,
    messages: [
      {role: "system", content: system_prompt},
      {role: "user", content: prompt}
    ],
    options: {
      temperature: parseFloat(temperature), // security checks
      num_predict: parseInt(max_tokens),    // for the variable type
    }
  });
}

async function requestImageAnalysis(base64Image, prompt, system_prompt) {

  console.log(`inside requestImageAnalysis:`);
  // console.log(base64Image);
  console.log(`prompt: ${prompt}`);
  console.log(`system: ${system_prompt}`);

  return await ollama.chat({
    model: MULTI_MODEL, // Replace with your preferred model (note: this multimodal model requires 
    max_tokens: 1000,
    messages: [
      { role: 'system', content: system_prompt, },
      {
        // Note: one could send more than one image!
        role: 'user', content: prompt, images: [base64Image],
      },
    ],
    options: {
      // temperature: parseFloat(temperature), // security checks
      // num_predict: parseInt(max_tokens),    // for the variable type
    }
  });
}
