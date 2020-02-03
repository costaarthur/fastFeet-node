import Sign from '../models/Sign';

class SignController {
  async store(req, res) {
    // console.log(req.file);
    const { originalname: name, filename: path } = req.sign;

    const sign = await Sign.create({
      name,
      path,
    });

    return res.json(sign);
  }
}

export default new SignController();
