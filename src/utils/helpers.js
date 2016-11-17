export const getRandomObjectFromArray = array => {
  if (array.length > 0) {
    return array[Math.floor((Math.random() * 100) % array.length)];
  } else {
    return null;
  }
};
