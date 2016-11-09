import Config from 'dotenv';
import Express from 'express';
import bodyParser from 'body-parser';

import webhookApp from './controllers/webhook-controller';

Config.config();

const app = Express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use('/', webhookApp);

app.listen(3000);
