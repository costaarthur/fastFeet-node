import { Op } from 'sequelize';
import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async index(req, res) {
    const { page = 1, q } = req.query;

    // let recipient;

    const recipient = await Recipient.findAll({
      where: q ? { nome: { [Op.iLike]: q } } : { id: { [Op.ne]: null } },
      order: ['id'],
      limit: 10,
      offset: (page - 1) * 10,
      attributes: [
        'id',
        'nome',
        'rua',
        'numero',
        'complemento',
        'estado',
        'cidade',
        'cep',
        'email',
      ],
    });
    return res.json(recipient);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .required()
        .email(),
      nome: Yup.string().required(),
      rua: Yup.string().required(),
      numero: Yup.number().required(),
      complemento: Yup.string(),
      estado: Yup.string().required(),
      cidade: Yup.string().required(),
      cep: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const recipientExists = await Recipient.findOne({
      where: { email: req.body.email },
    });

    if (recipientExists) {
      return res.status(400).json({ error: 'Email already exists.' });
    }

    const {
      id,
      email,
      nome,
      rua,
      numero,
      complemento,
      estado,
      cidade,
      cep,
    } = await Recipient.create(req.body);

    return res.json({
      id,
      email,
      nome,
      rua,
      numero,
      complemento,
      estado,
      cidade,
      cep,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string(),
      rua: Yup.string(),
      numero: Yup.number(),
      complemento: Yup.string(),
      estado: Yup.string(),
      cidade: Yup.string(),
      cep: Yup.number(),
      email: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const { email } = req.body;
    // const { id } = req.query;

    const recipient = await Recipient.findOne({ where: { email } });

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient does not exists.' });
    }

    const {
      nome,
      rua,
      numero,
      complemento,
      estado,
      cidade,
      cep,
      // email,
    } = await recipient.update(req.body);

    return res.json({
      nome,
      rua,
      numero,
      complemento,
      estado,
      cidade,
      cep,
      // email,
      admffId: req.admffId,
    });
  }

  async delete(req, res) {
    const recipient = await Recipient.findOne({
      where: { id: req.body.id },
    });

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient does not exists.' });
    }
    const delRecipient = await recipient.destroy(req.body);
    return res.json(delRecipient);
  }
}

export default new RecipientController();
