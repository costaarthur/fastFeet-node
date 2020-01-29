import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authff from '../../config/authff';

export default async (req, res, next) => {
  const ffHeader = req.headers.authorization;
  if (!ffHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  const [, token] = ffHeader.split(' ');

  try {
    const decodedff = await promisify(jwt.verify)(token, authff.secret);

    req.admffId = decodedff.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
