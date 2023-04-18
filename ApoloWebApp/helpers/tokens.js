import jwt from 'jsonwebtoken';

const generarJWT = datos => {
  try {
    return jwt.sign({ id: datos.id, nombre: datos.nombre }, process.env.JWT_SECRET, { expiresIn: '7d' });
  } catch (error) {
    console.error(error);
    return null;
  }
};

const generaId = () => Math.random().toString(32).substring(2) + Date.now().toString(32);

export {
  generarJWT,
  generaId
};
