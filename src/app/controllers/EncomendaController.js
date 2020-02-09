import * as Yup from 'yup';
import Encomenda from '../models/Encomenda';
import Ent from '../models/Ent';
import Sign from '../models/Sign';

import Mail from '../../lib/Mail';

class EncomendaController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const encomendas = await Encomenda.findAll({
      where: { canceled_at: null },
      attributes: [
        'id',
        'recipient_id',
        'deliveryman_id',
        'signature_id',
        'product',
        'start_date',
        'end_date',
      ],
      order: ['start_date'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Sign,
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(encomendas);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number(),
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }
    const {
      id,
      recipient_id,
      deliveryman_id,
      product,
      canceled_at,
      start_date,
      end_date,
    } = await Encomenda.create(req.body);
    /* const entregador = await Ent.findByPk(req.body.deliveryman_id, {
      include: [
        {
          model: Ent,
          attributes: ['nome', 'email'],
        },
      ],
    }); */

    // find ent
    const entregador2 = await Ent.findByPk(req.body.deliveryman_id);

    await Mail.sendMail({
      to: `${entregador2.nome} <${entregador2.email}>`,
      subject: 'New delivery',
      text: 'You have a new delivery.',
    });

    return res.json({
      id,
      recipient_id,
      deliveryman_id,
      product,
      canceled_at,
      start_date,
      end_date,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      recipient_id: Yup.number(),
      deliveryman_id: Yup.number(),
      signature_id: Yup.number(),
      product: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }
    const encomenda = await Encomenda.findOne({
      where: { id: req.body.id },
      include: [
        {
          model: Sign,
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    if (!encomenda) {
      return res.status(400).json({ error: 'Encomenda does not exists!' });
    }

    const {
      recipient_id,
      deliveryman_id,
      signature_id,
      product,
      canceled_at,
      start_date,
      end_date,
    } = await encomenda.update(req.body);

    // return res.json(encomenda);
    return res.json({
      recipient_id,
      deliveryman_id,
      signature_id,
      product,
      canceled_at,
      start_date,
      end_date,
    });
  }

  async delete(req, res) {
    const { id } = req.body;
    const encomenda = await Encomenda.findOne({
      where: { id },
    });

    if (!encomenda) {
      return res.status(400).json({ error: 'Encomenda does not exists.' });
    }

    encomenda.canceled_at = new Date();
    await encomenda.save();

    return res.json(encomenda);
  }
}

export default new EncomendaController();
