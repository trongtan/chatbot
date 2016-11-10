import { replaceVietnameseCharacters } from 'utils/text-utils';

const keywords = {
  'hi': ['hi'],
  'xin chao': ['xin chao', 'xin chào'],
  'hello': ['hello'],
  'hey': ['hey'],
  'e': ['e', 'ê'],
  'bs oi': ['bs oi', 'bs ơi'],
  'bac si oi': ['bac si oi', 'bác sĩ ơi']
};

export const isGreeting = function (messageEvent) {
  if (!(messageEvent && messageEvent.message && messageEvent.message.text)) {
    return false;
  } else {
    const originText = messageEvent.message.text;
    const synonymText = replaceVietnameseCharacters(originText).toLowerCase();

    return synonymText in keywords && keywords[synonymText].indexOf(originText) != -1;
  }
};
