import Express from 'express';

import { logger } from 'logs/winston-logger';
import ClassifyCenter from 'classifies';
import TransporterCenter from 'transporters';

const webHookApp = new Express();
const transporterCenter = new TransporterCenter();
const classifyCenter = new ClassifyCenter(transporterCenter);

webHookApp.get('/', (req, res) => {
  res.send('Hello from Life Pedia - Chatbot')
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
      pageEntry.messaging.forEach(function(messagingEvent) {
        classifyCenter.receivedMessage(messagingEvent);
      });
    });

    res.sendStatus(200);
  }
});


export default webHookApp;
