const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Rating = sequelize.define('Rating', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    conceptId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'concepts',
        key: 'id'
      }
    },
    topicId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'topics',
        key: 'id'
      }
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    timestamps: true,
    tableName: 'ratings',
    indexes: [
      {
        unique: true,
        fields: ['userId', 'conceptId'],
        name: 'unique_user_concept_rating'
      },
      {
        unique: true,
        fields: ['userId', 'topicId'],
        name: 'unique_user_topic_rating'
      }
    ]
  });

  Rating.associate = (models) => {
    Rating.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Rating.belongsTo(models.Concept, { foreignKey: 'conceptId', as: 'concept' });
    Rating.belongsTo(models.Topic, { foreignKey: 'topicId', as: 'topic' });
  };

  return Rating;
};
