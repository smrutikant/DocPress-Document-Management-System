const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Team = sequelize.define('Team', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    slug: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    timestamps: true,
    tableName: 'teams'
  });

  Team.associate = (models) => {
    Team.hasMany(models.TeamMember, { foreignKey: 'teamId', as: 'members' });
    Team.hasMany(models.TeamRequest, { foreignKey: 'teamId', as: 'requests' });
    Team.hasMany(models.Subject, { foreignKey: 'teamId', as: 'subjects' });
  };

  return Team;
};
