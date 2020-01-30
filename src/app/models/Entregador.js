import Sequelize, { Model } from 'sequelize';

class Entregador extends Model {
  static init(sequelize) {
    super.init(
      {
        email: Sequelize.STRING,
        nome: Sequelize.STRING,
        avatar_id: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
  }
}

export default Entregador;
