const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TeamRequest = sequelize.define('TeamRequest', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    teamId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'teams',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
      allowNull: false
    },
    requestMessage: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    respondedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    respondedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    timestamps: true,
    tableName: 'team_requests',
    indexes: [
      {
        unique: true,
        fields: ['teamId', 'userId'],
        where: {
          status: 'pending'
        }
      }
    ]
  });

  TeamRequest.associate = (models) => {
    TeamRequest.belongsTo(models.Team, { foreignKey: 'teamId', as: 'team' });
    TeamRequest.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    TeamRequest.belongsTo(models.User, { foreignKey: 'respondedBy', as: 'responder' });
  };

  return TeamRequest;
};
