import * as Yup from 'yup';
import {
  startOfDay,
  endOfDay,
  parseISO,
  isBefore,
  isAfter,
  addHours,
} from 'date-fns';
import { Op } from 'sequelize';
import Encomenda from '../models/Encomenda';
import Ent from '../models/Ent';

class EntFunctionController {
  async index(req, res) {
    const { deliverymanId } = req.params;
    const checkDeliverymanExists = await Ent.findOne({
      where: { id: deliverymanId },
    });

    if (!checkDeliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman does not exists!' });
    }

    const encomendas = await Encomenda.findAll({
      // deliverymanId é passado em routes
      where: {
        deliveryman_id: deliverymanId,
        canceled_at: null,
      },
    });
    // .sort({ createdAt: 'desc' })
    // .limit(20);

    return res.json(encomendas);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      start_date: Yup.date(),
      end_date: Yup.date(),
      signature_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }
    // find encomenda
    const { id } = req.body;
    const encomenda = await Encomenda.findOne({
      where: { id },
    });
    // check encomenda exists
    if (!encomenda) {
      return res.status(400).json({ error: 'Delivery does not exists!' });
    }
    // check deliveryman exists
    const { deliveryman_id } = req.body;
    const ent = await Ent.findOne({
      where: { id: deliveryman_id },
    });

    if (!ent) {
      return res.status(400).json({ error: 'Deliveryman does not exists.' });
    }

    // check encomenda's owner
    if (encomenda.deliveryman_id !== deliveryman_id) {
      return res.status(400).json({ error: 'This is not your delivery!' });
    }
    // check if start_date is past date
    const { start_date } = req.body;
    const hourStart = parseISO(start_date); // transforma a string em um objeto DATE.JS

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }
    // check if start_date = 08:00 - 18:00h.
    const jobBegin = addHours(startOfDay(hourStart), 8);
    const jobEnd = addHours(startOfDay(hourStart), 18);

    if (isBefore(hourStart, jobBegin)) {
      return res
        .status(400)
        .json({ error: 'You cannot take the deliveries yet' });
    }

    if (isAfter(hourStart, jobEnd)) {
      return res
        .status(400)
        .json({ error: 'You cannot take the deliveries anymore' });
    }

    // check <=5 retiradas/dia
    const retiradasDia = await Encomenda.findAll({
      where: {
        deliveryman_id,
        canceled_at: null,
        start_date: {
          [Op.between]: [startOfDay(hourStart), endOfDay(hourStart)],
        },
      },
    });
    if (retiradasDia.length > 4) {
      return res
        .status(400)
        .json({ error: 'you cannot take more than 5 deliveries in one day' });
    }
    // add end_date
    const { signature_id } = req.body;
    if (signature_id) {
      req.body.end_date = new Date();
    }

    const result = await encomenda.update(req.body);
    return res.json(result);
    /* return res.json({
      id,
      start_date,
      deliveryman_id,
    }); */
  }
}

export default new EntFunctionController();
