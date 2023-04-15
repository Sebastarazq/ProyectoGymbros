import { Usuario } from '../models/index.js'

const esTrabajador = async (req, res, next) => {
    const usuario = await Usuario.findByPk(req.usuario.id); // Busca el usuario por su id

    //Verificar el usuario si existe
    if (!usuario) {
        return res.redirect('/');
    }

    if (usuario.tipo_usuario === 2) { // Si el tipo de usuario es trabajador
        return next(); // Permitir acceso a la ruta
    }

    // Si el tipo de usuario no es trabajador, redirigir a otra página
    res.redirect('/'); // Por ejemplo, a la página de inicio
};

export default esTrabajador;