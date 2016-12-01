import Express from 'express';
import bodyParser from 'body-parser';

import './preload';
import webhookApp from './controllers/webhook-controller';
import admin from 'admin/app';

const app = Express();
const port = process.env.NODE_ENV !== 'test' ? 3000 : 4000;
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use('/', webhookApp);
app.use(admin);

app.listen(port);
