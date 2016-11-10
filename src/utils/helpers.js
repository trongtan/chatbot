export const getRandomObjectFromArray = function (array) {
  return array[Math.floor((Math.random() * 100) % array.length)];
};
