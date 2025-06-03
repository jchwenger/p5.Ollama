# p5.Ollama

## [p5.js](https://p5js.org/) & [Ollama](https://ollama.com/)

Originally presented during a the [Tech, Tea + Exchange Residency](https://www.tate.org.uk/whats-on/tate-modern/electric-dreams/tech-tea--exchange), London, May 2025, in a workshop with Nathan Bayliss, Robin Leverton and Jérémie Wenger. More in [this repo](https://github.com/jchwenger/TECH-TEA-EXCHANGE), then during a Computational Arts MA/MFA Workshop at Goldsmiths College, London, June 2025, by [Iris Colomb](https://iriscolomb.com/). 

## Starter code

## Ollama

A websocket app with with NodeJS, Express, SocketIO and P5js using the [API from Ollama](https://github.com/ollama/ollama/blob/main/docs/api.md) through [the `ollama-js` NPM module](https://github.com/ollama/ollama-js).

Note: you must have Ollama installed *and running* (the Ollama server must be running) on your machine for this to work. Also, the models must have been downloaded beforehand (using `ollama pull <model-name>` – currently, it's `llama3.2:1b` for completion/chat and `gemma3:4b` for multimodal (taking image inputs)).

Press `¬` to toggle the UI.

Click on `completion` to get your chosen model to continue the text in the **prompt** `textarea` (both the prompt `textarea` and the sketch are filled with the **prompt** and the completion). In the picture below, the original prompt is highlighted. 

![ollama, completion](pics/ollama-completion.png)

Click on `chat` to get your chosen model to continue the text in the **prompt** `textarea`, while following instructions in the **system** `textarea`.

![ollama, chat style](pics/ollama-chat.png)

Note: giving **examples** of what you want usually helps a lot (especially for models prior to GPT-4).

Click on `image` to feed the canvas to your model, following the instructions in the **prompt** and **system** `textarea`s. This functionality could be extended to get users to upload images to the browser...

![ollama, image](pics/ollama-image.png)
