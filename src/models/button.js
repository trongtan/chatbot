export default (sequelize, DataTypes) => {
  const Button = sequelize.define('Button', {
    title: DataTypes.STRING,
    typeValue: DataTypes.STRING,
    postbackId: DataTypes.STRING
  }, {
    freezeTableName: true,
    classMethods: {
      findButtonsByGroup: (groupName) => {
          return sequelize.query('SELECT "RawButton"."id", "RawButton"."title", "RawButton"."typeValue", "RawButton"."postbackId", "name" AS "postbackName" ' +
            'FROM (SELECT * FROM "Button" ' +
            'INNER JOIN "GroupButton" ' +
            'ON "Button"."id" = "GroupButton"."buttonId" ' +
            'WHERE "GroupButton"."groupId" ' +
            'IN (SELECT "Group"."id" FROM "Group" WHERE "Group"."name" LIKE $groupName)) AS "RawButton" ' +
            'INNER JOIN "Group" ON "RawButton"."postbackId" = "Group"."id"',
            {
              type: sequelize.QueryTypes.SELECT,
              bind: {
                groupName: groupName
              }
            }
          ).then(result => {
            return result ? result : [];
        });
      }
    }
  });
  return Button;
};
