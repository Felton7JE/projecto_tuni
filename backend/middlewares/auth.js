import jwt from 'jsonwebtoken';
const SECRET_KEY = 'minha_chave_super_secreta';

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Token ausente' });

  const [bearer, token] = authHeader.split(' ');
  if (bearer !== 'Bearer' || !token) return res.status(401).json({ error: 'Formato de token inválido' });

  try {
    req.user = jwt.verify(token, SECRET_KEY);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

export default authMiddleware;
