import Ent from '../models/Ent';

class EntController {
  async index(req, res) {
    const ent = await Ent.findAll();

    return res.json(ent);
  }

  async store(req, res) {
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
    // const { email } = req.body;
    const ent = await Ent.findOne({
      where: { email: req.body.email },
    });

    if (!ent) {
      return res.status(400).json({ error: 'Email does not exists.' });
    }

    const { id, email, nome, avatar_id } = await ent.update(req.body);

    return res.json({
      id,
      email,
      nome,
      avatar_id,
    });
  }

  async delete(req, res) {
    const ent = await Ent.findOne({
      where: { email: req.body.email },
    });

    if (!ent) {
      return res.status(400).json({ error: 'Email does not exists.' });
    }
    const delEnt = await Ent.delete(ent);
    return res.json(delEnt);
  }
}

export default new EntController();
