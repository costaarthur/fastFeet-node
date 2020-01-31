import Sequelize, { Model } from 'sequelize';

class Ent extends Model {
  static init(sequelize) {
    super.init(
      {
        email: Sequelize.STRING,
        nome: Sequelize.STRING,
        avatar_id: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
        // freezeTableName: true,
      }
    );
  }

  // pertence ao model de file, um id de arquivo é armazenado no model de entregadores
  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id' });
  }
}

export default Ent;