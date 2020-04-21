import { Op } from 'sequelize';
import * as Yup from 'yup';
// import { format } from 'date-fns';
// import pt from 'date-fns/locale/pt';
import Encomenda from '../models/Encomenda';
import Ent from '../models/Ent';
import Recipient from '../models/Recipient';
import Sign from '../models/Sign';
import File from '../models/File';

import Mail from '../../lib/Mail';

class EncomendaController {
  async index(req, res) {
    const { page = 1, q } = req.query;

    const encomendas = await Encomenda.findAll({
      where: q ? { product: { [Op.iLike]: q } } : { id: { [Op.ne]: null } },

      attributes: [
        'id',
        'recipient_id',
        'deliveryman_id',
        'signature_id',
        'product',
        'canceled_at',
        'start_date',
        'end_date',
      ],
      order: ['id'],
      // order: ['start_date'],
      limit: 10,
      offset: (page - 1) * 10,
      include: [
        {
          model: Sign,
          attributes: ['name', 'path', 'url'],
        },
        {
          model: Recipient,
          attributes: [
            'id',
            'email',
            'nome',
            'rua',
            'numero',
            'complemento',
            'estado',
            'cidade',
            'cep',
          ],
        },
        {
          model: Ent,
          attributes: ['id', 'nome'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'name', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(encomendas);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    // check deliveryman exists
    const entregador = await Ent.findByPk(req.body.deliveryman_id);

    if (!entregador) {
      return res.status(400).json({ error: 'Deliveryman does not exists.' });
    }
    // check recipient exists
    const recipient = await Recipient.findByPk(req.body.recipient_id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient does not exists.' });
    }

    const {
      id,
      recipient_id,
      deliveryman_id,
      product,
      canceled_at,
      start_date,
      end_date,
    } = req.body;

    await Encomenda.create({
      id,
      recipient_id,
      deliveryman_id,
      product,
      canceled_at,
      start_date,
      end_date,
    });
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

    /* const encomenda = await Encomenda.findOne({
    where: { id: Encomenda.id },
  }); */

    await Mail.sendMail({
      to: `${deliveryman_id} <${entregador2.email}>`,
      subject: 'Nova encomenda',
      template: 'newdelivery',
      context: {
        deliveryman: entregador2.nome,
        product,
        /*   date: format(encomenda.created_at, "'dia' dd 'de' MMMM', às' H:mm'h'", {
        locale: pt,
      }), */
      },
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
