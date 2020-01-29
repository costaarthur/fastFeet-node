// import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
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
    const { email } = req.body;

    const recipient = await Recipient.findOne({ where: { email } });

    if (!recipient) {
      return res.status(400).json({ error: 'Email does not exists.' });
    }

    const {
      id,
      nome,
      rua,
      numero,
      complemento,
      estado,
      cidade,
      cep,
    } = await recipient.update(req.body);

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
      admffId: req.admffId,
    });
  }
}

export default new RecipientController();
