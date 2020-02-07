import * as Yup from 'yup';
import Encomenda from '../models/Encomenda';
import DeliveryProblems from '../models/DeliveryProblems';

class EntProblemsController {
  async store(req, res) {
    const schema = Yup.object().shape({
      // delivery_id: Yup.number().required(),
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // check delivery exists
    const { encomendaId } = req.params;
    const deliveryExists = await Encomenda.findOne({
      where: { id: encomendaId },
    });

    if (!deliveryExists) {
      return res.status(400).json({ error: 'Delivery does not exists.' });
    }

    const problem = await DeliveryProblems.create({
      delivery_id: encomendaId,
      description: req.body.description,
    });

    return res.json(problem);
  }
}

export default new EntProblemsController();
