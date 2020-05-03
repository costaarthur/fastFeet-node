import { Op } from 'sequelize';
import * as Yup from 'yup';
import Ent from '../models/Ent';
import File from '../models/File';

class EntController {
  async index(req, res) {
    const { page = 1, filter } = req.query;

    const ent = await Ent.findAll({
      where: filter
        ? { nome: { [Op.iLike]: `%${filter}%` } }
        : { provider: false },
      order: ['id'],
      limit: 10,
      offset: (page - 1) * 10,
      include: [
        // acrescenta além do retorno
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'], // quais atributos do 'avatar'
        },
      ],
      attributes: ['id', 'email', 'nome'], // quais atributos que vão mostrar do 'ent'
    });

    return res.json(ent);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const entExists = await Ent.findOne({
      where: { email: req.body.email },
    });

    if (entExists) {
      return res.status(400).json({ error: 'Email already exists.' });
    }

    const { id, email, nome } = await Ent.create(req.body);

    return res.json({
      id,
      email,
      nome,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const ent = await Ent.findOne({
      where: { email: req.body.email },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    if (!ent) {
      return res.status(400).json({ error: 'Email does not exists.' });
    }

    const { id, email, nome, avatar_id } = await ent.update(req.body);

    const { url } = await File.findOne({
      where: { id: avatar_id },
    });

    return res.json({
      id,
      email,
      nome,
      avatar_id,
      avatar: url,
    });
  }

  async delete(req, res) {
    const ent = await Ent.findOne({
      where: { email: req.body.email },
    });

    if (!ent) {
      return res.status(400).json({ error: 'Email does not exists.' });
    }
    const delEnt = await ent.destroy(req.body);
    return res.json(delEnt);
  }
}

export default new EntController();
