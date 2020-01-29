import jwt from 'jsonwebtoken';

import Admin from '../models/FastfeetAdm';
import authff from '../../config/authff';

class FastfeetSession {
  async store(req, res) {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      return res.status(401).json({ error: 'Admin not found' });
    }

    if (!(await admin.checkPass(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name } = admin;

    return res.json({
      admin: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authff.secret, {
        expiresIn: authff.expiresIn,
      }),
    });
  }
}

export default new FastfeetSession();
