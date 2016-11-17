import { replaceVietnameseCharacters } from './text-utils';

export const getRandomObjectFromArray = array => {
  if (array.length > 0) {
    return array[Math.floor((Math.random() * 100) % array.length)];
  } else {
    return null;
  }
};

export const isSynonymTextInArray = (text, elements) => {
  const synonymText = replaceVietnameseCharacters(text).toLowerCase();

  for (let element of elements) {
    if (synonymText.includes(element)) {
      return true;
    }
  }
  return false;
};
