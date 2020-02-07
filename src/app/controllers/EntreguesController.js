import { isBefore } from 'date-fns';
import Encomenda from '../models/Encomenda';
import Ent from '../models/Ent';

class EntreguesController {
  async index(req, res) {
    const { deliverymanId } = req.params;

    // check deliveryman exists
    const checkDeliverymanExists = await Ent.findOne({
      where: { id: deliverymanId },
    });

    if (!checkDeliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman does not exists!' });
    }

    // check signature exists
    const sign = await Encomenda.findOne({
      where: { signature_id: null },
    });
    const dontSign = !sign;
    const entregues = await Encomenda.findAll({
      where: {
        deliveryman_id: deliverymanId,
        canceled_at: null,
        end_date: isBefore(end_date, new Date()),
      },
    });
    // .sort({ createdAt: 'desc' })
    // .limit(20);

    return res.json(entregues);
  }
}

export default new EntreguesController();
