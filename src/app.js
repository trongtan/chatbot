import Config from 'dotenv';
import Express from 'express';
import webhookApp from './controllers/webhook-controller';

Config.config();

const app = Express();
app.use('/', webhookApp);

app.listen(3000);
