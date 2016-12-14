import Express from 'express';

import Dispatcher from 'message';
import { RECEIVED_MESSAGE_EVENT } from 'utils/event-constants';

import { logger } from 'logs/winston-logger';

const webHookApp = new Express();
const dispatcher = new Dispatcher();

webHookApp.get('/', (req, res) => {
  res.send('Hello from Life Pedia - Chatbot');
});

webHookApp.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
    logger.log('info', 'Validating webhook');
    res.status(200).send(req.query['hub.challenge']);
  } else {
    logger.log('error', 'Failed validation. Make sure the validation tokens match.');
    res.sendStatus(403);
  }
});

webHookApp.post('/webhook', (req, res) => {
  const data = req.body;

  if (data.object == 'page') {
    data.entry.forEach(pageEntry => {
      pageEntry.messaging.forEach(messagingEvent => {
        dispatcher.emit(RECEIVED_MESSAGE_EVENT, messagingEvent);
      });
    });

    res.sendStatus(200);
  }
});


export default webHookApp;
