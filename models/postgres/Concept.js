const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Concept = sequelize.define('Concept', {
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
    coverImage: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    topicId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'topics',
        key: 'id'
      }
    },
    contentId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'MongoDB ObjectId reference'
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    lastRevisedOn: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    timestamps: true,
    tableName: 'concepts'
  });

  Concept.associate = (models) => {
    Concept.belongsTo(models.Topic, { foreignKey: 'topicId', as: 'topic' });
    Concept.hasMany(models.Rating, { foreignKey: 'conceptId', as: 'ratings' });
  };

  return Concept;
};
