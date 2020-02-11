// import * as Yup from 'yup';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import DeliveryProblems from '../models/DeliveryProblems';
import Encomenda from '../models/Encomenda';
import Ent from '../models/Ent';

import Mail from '../../lib/Mail';
// import Sign from '../models/Sign';

class AdmProblemsController {
  async index(req, res) {
    // const { page = 1 } = req.query;
    // const deliveryWithProblem = await Encomenda.findAll({
    //  where: { id: }
    const problems = await DeliveryProblems.findAll({
      attributes: ['delivery_id'],
    });

    // get array with delivery_id problems
    let i;
    const idNumbers = [];
    for (i = 0; i < problems.length; i += 1) {
      idNumbers.push(problems[i].delivery_id);
      Encomenda.findAll({
        where: { id: problems[i].delivery_id },
      });
    }

    const encomendasWithProblems = await Encomenda.findAll({
      where: { id: idNumbers },
      include: [
        {
          model: DeliveryProblems,
          as: 'descriptioner',
          attributes: ['description'],
        },
      ],
    });
    // console.log(problems[1].delivery_id);

    /* const separaNumber = problems.map(n => {
      const [, number] = n.split(':');
      const value = number;
      return { value };
    });

    return res.json(separaNumber);
  } */
    // console.log(problems[i].delivery_id);
    return res.json(encomendasWithProblems);
  }

  async delete(req, res) {
    const { problemId } = req.params;
    const findDeliveryId = await DeliveryProblems.findOne({
      where: { id: problemId },
    });

    // check Id has problem
    if (!findDeliveryId) {
      return res.status(400).json({ error: 'This is not an Id with problem.' });
    }

    const deliveryId = findDeliveryId.delivery_id;
    // console.log(deliveryId);

    const encomenda = await Encomenda.findOne({
      where: { id: deliveryId },
    });

    // check delivery exists
    if (!encomenda) {
      return res.status(400).json({ error: 'Encomenda does not exists.' });
    }

    encomenda.canceled_at = new Date();
    await encomenda.save();

    // find ent
    const entregador = await Ent.findByPk(deliveryId);
    // console.log(entregador.id);
    await Mail.sendMail({
      to: `${entregador.nome} <${entregador.email}>`,
      subject: 'Encomenda cancelada',
      template: 'cancellation',
      context: {
        deliveryman: entregador.nome,
        name: encomenda.recipient_id,
        date: format(
          encomenda.canceled_at,
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
    // const deleteEncomenda = await Encomenda.delete(encomenda);
    return res.json(encomenda);
  }
}
export default new AdmProblemsController();
