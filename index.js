//  This code is a chatbot that uses the OpenAI API to generate responses.
// When receiving a '/start' message, the bot activates and sends a message with this text,
// and then when other messages are received, it uses the OpenAI API to generate a response.

const dotenv = require('dotenv').config();

const telegramAPI = require('node-telegram-bot-api');

const token = process.env.KEY_BOT;

const bot = new telegramAPI(token,{polling: true});

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const myText = "Hello, tell us about your main features in 5 points.\n" +
    "Answer my questions like a pro.\n" ;

(async () => {
    try {
        // Catching a message from the chat
        bot.on('message', async msg => {
            const text = msg.text;
            const chatId = msg.chat.id;
            console.log(msg.text);
            // // Process the "/start" command and send brief information to the chat
            if (text === '/start') {
                myMessage = myText;
                await bot.sendMessage(chatId, `This chat-bot is a bot that uses the OpenAI API to create responses. 
Upon receipt of the '/start' message, the bot is activated and sends  a message with the given text, and then upon receipt of other messages - uses the OpenAI API to generate the response. You can communicate with the bot in almost any widely used language. GPT-3:`)
            } else { myMessage = text }
            // Pass model settings to OpenAI
            const completion = await openai.createCompletion({
                model: 'text-davinci-003',
                prompt: myMessage,
                temperature: 0.2,
                max_tokens: 180,
                top_p: 1.0,
                frequency_penalty: 0.2,
                presence_penalty: 0.2,
                stop: ["\n+"],
            })
            // send the generated response to the chat
            await bot.sendMessage(chatId, completion.data.choices[0].text);
            console.log(completion.data);
        })
    // If there are errors, print them to the console
    } catch (error) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }
    }
}) ();
