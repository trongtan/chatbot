export const getRandomObjectFromArray = array => {
  return array[Math.floor((Math.random() * 100) % array.length)];
};
