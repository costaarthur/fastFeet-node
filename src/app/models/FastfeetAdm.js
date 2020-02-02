import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class Admin extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    // const password_hash = bcrypt.hashSync('123456', 8),
    this.addHook('beforeSave', async adm => {
      if (adm.password) {
        adm.password_hash = await bcrypt.hash(adm.password, 8);
      }
    });

    return this;
  }

  checkPass(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default Admin;
