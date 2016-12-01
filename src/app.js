import Express from 'express';
import bodyParser from 'body-parser';
import epilogue from 'epilogue';
import cors from 'cors';

import './preload';
import { sequelize, Type } from 'models';
import webhookApp from './controllers/webhook-controller';

const app = Express();
app.use(cors());
const port = process.env.NODE_ENV !== 'test' ? 3000 : 4000;

// Initialize epilogue
epilogue.initialize({ app, sequelize });

// Create type CRUD resource
epilogue.resource({
  model: Type,
  endpoints: ['/types', '/types/:id']
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', webhookApp);

app.listen(port, () => {
  require('./api-doc')(app._router.stack);
});
