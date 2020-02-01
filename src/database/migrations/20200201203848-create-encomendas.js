module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('encomendas', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      recipient_id: {
        type: Sequelize.INTEGER,
        references: { model: 'recipients', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: false,
        unique: false,
      },
      deliveryman_id: {
        type: Sequelize.INTEGER,
        references: { model: 'ents', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: false,
        unique: false,
      },
      signature_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        unique: false,
      },
      product: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
      },
      canceled_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('encomendas');
  },
};
