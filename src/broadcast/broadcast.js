import co from 'co';

import { schedule } from 'node-cron';
import { RSSes, User } from 'models';
import MessageRSS from './message-rss';
import RSSTemplate from './rss-template';
import { MORE_STORY } from 'utils/constants';

export default class Broadcast {
  sendMessage() {
    schedule('0 0 7 * * *', () =>{
      co(function *() {
        const users = yield User.findAll();
        const payload = { action: MORE_STORY, category: 'LAMME_RSS_PAYLOAD' };
        const rssTemplate = new RSSTemplate();
        const messageRSS = new MessageRSS(rssTemplate);
        const rss = yield RSSes.findRSSByPostback(payload.category);
        users.forEach(user => {
          messageRSS.sendRSSToUser(user, rss, payload);
        });
      });
    });
  }
}
