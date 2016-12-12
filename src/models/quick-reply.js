export default (sequelize, DataTypes) => {
  const QuickReply = sequelize.define('QuickReply', {
    contentType: DataTypes.STRING,
    title: DataTypes.STRING,
    imageUrl: DataTypes.STRING
  }, {
    freezeTableName: true,
    classMethods: {
      findByGroup: (groupName) => {
        return sequelize.query('SELECT  "RawQuickReply"."id", "RawQuickReply"."title",  "RawQuickReply"."imageUrl", "RawQuickReply"."contentType", "RawQuickReply"."payloadId", "Group"."name" ' +
          'FROM ' +
          '(SELECT "QuickReply"."id", "QuickReply"."title", "QuickReply"."payloadId", "QuickReply"."imageUrl", "QuickReply"."contentType" FROM "QuickReply" ' +
          'INNER JOIN "Group" ' +
          'ON "QuickReply"."groupId" = "Group"."id" AND "Group"."name" like $groupName) AS "RawQuickReply" ' +
          'INNER JOIN "Group" ' +
          'ON "RawQuickReply"."payloadId" = "Group"."id"',
          {
            type: sequelize.QueryTypes.SELECT,
            bind: {
              groupName: groupName
            }
          }
        ).then(result => result.length > 0 ? result : null);
      }
    }
  });
  return QuickReply;
};
