import Express from 'express';
import {logger} from 'logs/winston-logger';

var webHookApp = new Express();

webHookApp.get('/', (req, res) => {
  logger.log('info', "request to root");
  res.send('Hello from Life Pedia - Chatbot')
});

webHookApp.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});

export default webHookApp;
