import jwt from 'jsonwebtoken';

import Admuser from '../models/AdmUser';
import authAdm from '../../config/authadm';

class AdmController {
  async store(req, res) {
    // create session
    const { email, password } = req.body;

    const admuser = await Admuser.findOne({ where: { email } });
    if (!admuser) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (!(await admuser.checkPass(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name } = admuser;

    return res.json({
      admuser: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authAdm.secret, {
        expiresIn: authAdm.expiresIn,
      }),
    });
  }
}

export default new AdmController();
