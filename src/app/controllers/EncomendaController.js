import Encomenda from '../models/Encomenda';

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
    });

    return res.json(encomendas);
  }

  async store(req, res) {
    const {
      id,
      recipient_id,
      deliveryman_id,
      product,
      canceled_at,
      start_date,
      end_date,
    } = await Encomenda.create(req.body);

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

  async update(req, res) { }
}

export default new EncomendaController();
