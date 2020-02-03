import Encomenda from '../models/Encomenda';

class EncomendaController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const encomendas = await Encomenda.findAll({
      where: { canceled_at: null },
      order: ['start_date'],
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(encomendas);
  }
}

export default new EncomendaController();
