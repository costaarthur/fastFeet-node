// import * as Yup from 'yup';
import DeliveryProblems from '../models/DeliveryProblems';
import Encomenda from '../models/Encomenda';
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
    for (i = 0; i < problems.length; i++) {
      idNumbers.push(problems[i].delivery_id);
      Encomenda.findAll({
        where: { id: problems[i].delivery_id },
      });
    }

    const encomendasWithProblems = await Encomenda.findAll({
      where: { id: idNumbers },
      /*  include: [
        {
          model: DeliveryProblems,
          as: 'descriptioner',
          attributes: ['description'],
        },
      ], */
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
}
export default new AdmProblemsController();
