import Sequelize, { Model } from 'sequelize';

class DeliveryProblems extends Model {
  static init(sequelize) {
    super.init(
      {
        delivery_id: Sequelize.INTEGER,
        description: Sequelize.STRING,
      },
      {
        sequelize,
        // freezeTableName: true,
      }
    );
    return this;
  }

  // model de usuário pertence ao model de file,
  // um id de arquivo é armazenado no model de entregadores
  static associate(models) {
    this.belongsTo(models.Encomenda, { foreignKey: 'delivery_id' });
  }
}

export default DeliveryProblems;
