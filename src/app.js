import Express from 'express';
import bodyParser from 'body-parser';

import './preload';
import webhookApp from './controllers/webhook-controller';

const app = Express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use('/', webhookApp);

app.listen(3000);
