import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
// novos \/
import FastfeetSession from './app/controllers/FastfeetSession';
import RecipientController from './app/controllers/RecipientController';

import StudentController from './app/controllers/StudentController';
import AdmController from './app/controllers/AdmController';

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

/* routes.get('/students/:id'),
  (req, res) => {
    const { id } = req.params.id;

    return res.json({ message: `Hello ${id}}` });
  }; */

routes.post('/recipients', authff, RecipientController.store);
routes.put('/recipients', authff, RecipientController.update);

routes.post('/files', authff, upload.single('file'), (req, res) => {
  return res.json({ ok: true });
});

routes.use(admMiddleware);
routes.post('/students', StudentController.store);
routes.put('/students', StudentController.update);

// routes.put('/users', authMiddleware, UserController.update);
// da para utilizar o middleware assim/\ de forma local

// ou de forma global assim. Ai funciona em apenas nas rotas abaixo dele
routes.use(authMiddleware);
routes.put('/users', UserController.update);

export default routes;
