import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
// novos \/
import FastfeetSession from './app/controllers/FastfeetSession';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import SignController from './app/controllers/SignController';

import StudentController from './app/controllers/StudentController';
import AdmController from './app/controllers/AdmController';

// // entregadores ////
import EntController from './app/controllers/EntController';
// // encomenda ////
import EncomendaController from './app/controllers/EncomendaController';

import authMiddleware from './app/middlewares/auth';
import admMiddleware from './app/middlewares/authadm';
import authff from './app/middlewares/authff';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// project
routes.post('/ffsessions', FastfeetSession.store);

routes.post('/admsessions', AdmController.store);

routes.get('/getstudent', StudentController.get);

/*
 ********* destinatários
 */
routes.post('/recipients', authff, RecipientController.store);
routes.put('/recipients', authff, RecipientController.update);

/*
 ********* encomendas
 */
routes.post('/signs', authff, upload.single('sign'), SignController.store);
routes.get('/encomendas', authff, EncomendaController.index);
routes.post('/encomendas', authff, EncomendaController.store);
/*
 ********* entregadores
 */
routes.post('/files', authff, upload.single('file'), FileController.store);
routes.get('/ents', authff, EntController.index);
routes.post('/ents', authff, EntController.store);
routes.put('/ents', authff, EntController.update);
routes.delete('/ents', authff, EntController.delete);

routes.use(admMiddleware);
routes.post('/students', StudentController.store);
routes.put('/students', StudentController.update);

// routes.put('/users', authMiddleware, UserController.update);
// da para utilizar o middleware assim/\ de forma local

// ou de forma global assim. Ai funciona em apenas nas rotas abaixo dele
routes.use(authMiddleware);
routes.put('/users', UserController.update);

export default routes;
