import Sequelize from 'sequelize';

// import User from '../app/models/User';
// import AdmUser from '../app/models/AdmUser';
// import Student from '../app/models/Student';
import FastfeetAdm from '../app/models/FastfeetAdm';
import Recipient from '../app/models/Recipient';
import Ent from '../app/models/Ent';
import File from '../app/models/File';
import Encomenda from '../app/models/Encomenda';
import Sign from '../app/models/Sign';
import DeliveryProblems from '../app/models/DeliveryProblems';

import databaseConfig from '../config/database';

// const models = [User, AdmUser, Student, FastfeetAdm, Recipient, Ent, File];
const models = [
  FastfeetAdm,
  Recipient,
  Ent,
  File,
  Encomenda,
  Sign,
  DeliveryProblems,
];
// console.log(FastfeetAdm);
// console.log(Recipient);
// console.log(Ent);
// console.log(File);

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
