const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Subject = sequelize.define('Subject', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(250),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    coverImage: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    authorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    teamId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'teams',
        key: 'id'
      }
    },
    visibility: {
      type: DataTypes.ENUM('public', 'team'),
      defaultValue: 'public',
      allowNull: false
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    requiresApproval: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'For team member created content'
    },
    approvedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    timestamps: true,
    tableName: 'subjects'
  });

  Subject.associate = (models) => {
    Subject.belongsTo(models.User, { foreignKey: 'authorId', as: 'author' });
    Subject.belongsTo(models.Team, { foreignKey: 'teamId', as: 'team' });
    Subject.belongsTo(models.User, { foreignKey: 'approvedBy', as: 'approver' });
    Subject.hasMany(models.Topic, { foreignKey: 'subjectId', as: 'topics' });
  };

  return Subject;
};
