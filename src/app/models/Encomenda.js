import Sequelize, { Model } from 'sequelize';

class Encomenda extends Model {
  static init(sequelize) {
    super.init(
      {
        id: Sequelize.INTEGER,
        recipient_id: Sequelize.INTEGER,
        deliveryman_id: Sequelize.INTEGER,
        signature_id: Sequelize.INTEGER,
        product: Sequelize.STRING,
        canceled_at: Sequelize.DATE,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
      },
      {
        sequelize,
        // freezeTableName: true,
      }
    );
  }

  // model de usuário pertence ao model de file,
  // um id de arquivo é armazenado no model de entregadores
  static associate(models) {
    this.belongsTo(models.Sign, { foreignKey: 'signature_id' });
  }
}

export default Encomenda;
