import * as Yup from 'yup';
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
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }
    // find encomenda
    const encomenda = await Encomenda.findOne({
      where: { id: req.body.id },
    });
    // check encomenda exists
    if (!encomenda) {
      return res.status(400).json({ error: 'Encomenda does not exists!' });
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
      return res.status(400).json({ error: 'This is not your encomenda!' });
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
