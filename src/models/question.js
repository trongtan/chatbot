export default (sequelize, DataTypes) => {
  const Question = sequelize.define('Questions', {
    question: DataTypes.TEXT,
    answer: DataTypes.TEXT,
    order: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Question;
};
