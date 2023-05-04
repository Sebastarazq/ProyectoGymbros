import { check, validationResult } from 'express-validator'
import { Cita,TipoCita,EstadoCita,CitaEstadoRegistro, Usuario } from '../models/index.js'
import jwt from 'jsonwebtoken'
import moment from 'moment';
import {Op} from 'sequelize'


const mostrarTodasLasCitas = async (req, res) => {
    const usuario = req.usuario;
    const usuarioAutenticado = true; // Si llegamos hasta aquí es porque el usuario está autenticado
  
    const citas = await CitaEstadoRegistro.findAll({
        include: [
          {
            model: Cita,
            as: 'cita',
            include: [{ model: TipoCita, as: 'tipoCita' }, { model: Usuario, as: 'usuario' }],
          },
          { model: EstadoCita, as: 'estadoCita' },
        ],
        order: [['createdAt', 'DESC']],
    });
      
  

    res.render('citas/admin-citas', {
      pagina: 'Crear Citas',
      csrfToken: req.csrfToken(),
      usuario,
      citas,
      autenticado: usuarioAutenticado,
    });
  };  
const mostrarFormularioCrearCita = async (req,res) =>{
    const usuario = req.usuario;
    const usuarioAutenticado = true; // Si llegamos hasta aquí es porque el usuario está autenticado

    // Consultar tipos de citas
  const tiposCitas = await TipoCita.findAll();

  res.render("citas/crear", {
    pagina: "Crear cita",
    csrfToken: req.csrfToken(),
    tiposCitas,
    usuario,
    usuarioAutenticado,
    datos: {},
  });
};

const crearCita = async (req, res) => {
    const usuario = req.usuario;
    const usuarioAutenticado = true; // Si llegamos hasta aquí es porque el usuario está autenticado
    // Validacion
    await check('tipoCita').notEmpty().withMessage('El tipo de cita es obligatorio').run(req)
    await check('fecha').notEmpty().withMessage('La fecha es obligatoria').isDate().withMessage('La fecha debe ser válida').run(req)
    await check('hora').notEmpty().withMessage('La hora es obligatoria').isLength({ min: 5, max: 5 }).withMessage('La hora debe tener el formato HH:MM').run(req)

    const resultado = validationResult(req)

    // Verificar que el resultado esté vacío
    if (!resultado.isEmpty()) {
        // Consultar tipos de citas
        const [tiposCitas] = await Promise.all([
          TipoCita.findAll()
        ]);
      
        // Errores
        return res.render('citas/crear', {
          pagina: 'Crear Cita',
          csrfToken: req.csrfToken(),
          tiposCitas,
          usuario,
          usuarioAutenticado,
          errores: resultado.array(),
          datos: req.body
        });
    }      
      

  // Extraer los datos
  const { tipoCita:tipo_cita_id, fecha, hora } = req.body


  // Crear la cita con estado pendiente
    const cita = await Cita.create({
        tipo_cita_id,
        fecha,
        hora,
    })
  
  // Crear un registro en la tabla CitaEstadoRegistro
  const registro = await CitaEstadoRegistro.create({
    cita_id: cita.id,
    estado_cita_id: 1,
    fecha: new Date()
  });
  
  if (registro) {
    // Redireccionar
    res.redirect('/admin-citas');
  } else {
    // Mostrar un mensaje de error
    res.render('citas/crear', {
      pagina: 'Crear Cita',
      csrfToken: req.csrfToken(),
      tiposCitas,
      usuario,
      usuarioAutenticado,
      errores: [{ msg: 'Error al registrar la cita.' }],
      datos: req.body
    });
  }  
}

const mostrarFormularioEditarCita = async (req, res) => {
  const usuario = req.usuario;
  const usuarioAutenticado = true; // Si llegamos hasta aquí es porque el usuario está autenticado

  // Obtener el ID de la cita que se desea editar
  const { id } = req.params;

  // Buscar la cita en la base de datos incluyendo su relación TipoCita
  const cita = await Cita.findByPk(id, {
    include: [{ model: TipoCita, as: 'tipoCita' }],
  });

  // Si no se encuentra la cita, redirigir al usuario
  if (!cita) {
    return res.redirect('/citas');
  }

  // Consultar tipos de citas
  const [tiposCitas] = await Promise.all([
    TipoCita.findAll()
  ]);
  

  res.render("citas/editar", {
    pagina: `Editar Producto: ${cita.tipoCita.nombre}`,
    csrfToken: req.csrfToken(),
    tiposCitas,
    usuario,
    usuarioAutenticado,
    datos: cita,
  });
};


const actualizarCita = async (req, res) => {

  const { id } = req.params;
  const usuario = req.usuario;

  // Validacion
  await check('tipoCita').notEmpty().withMessage('El tipo de cita es obligatorio').run(req)
  await check('fecha').notEmpty().withMessage('La fecha es obligatoria').isDate().withMessage('La fecha debe ser válida').run(req)
  await check('hora').notEmpty().withMessage('La hora es obligatoria').isLength({ min: 5, max: 5 }).withMessage('La hora debe tener el formato HH:MM').run(req)

  const resultado = validationResult(req)

  // Obtener los tipos de citas
  const [tiposCitas] = await Promise.all([
    TipoCita.findAll()
  ]);

  // Verificar que el resultado esté vacío
  if (!resultado.isEmpty()) {
      // Obtener la cita a actualizar
      const cita = await Cita.findByPk(id);

      // Mostrar la vista con errores
      return res.render('citas/editar', {
          pagina: 'Editar Cita',
          csrfToken: req.csrfToken(),
          tiposCitas,
          cita,
          usuario,
          errores: resultado.array(),
          datos: req.body
      });
  }

  // Extraer los datos
  const { tipoCita: tipo_cita_id, fecha, hora, estadoCitaId } = req.body

  // Actualizar la cita
  const cita = await Cita.findByPk(id);

  if(!cita) {
    return res.render('citas/editar', {
      pagina: 'Editar Cita',
      csrfToken: req.csrfToken(),
      errores: [{ msg: 'La cita que intentas actualizar no existe.' }],
      usuario,
      datos: req.body
    });
  }

  cita.tipo_cita_id = tipo_cita_id;
  cita.fecha = fecha;
  cita.hora = hora;

  try {
    await cita.save();

    const nuevoEstadoCitaId = estadoCitaId; // Agregar esta línea

    await CitaEstadoRegistro.update(
      {
        estado_cita_id: nuevoEstadoCitaId,
        fecha: new Date()
      },
      { where: { cita_id: cita.id } }
    );

    res.redirect('/admin-citas');
  } catch (error) {
    console.log(error);
    res.render('citas/editar', {
      pagina: 'Editar Cita',
      csrfToken: req.csrfToken(),
      tiposCitas,
      cita,
      usuario,
      errores: [{ msg: 'Error al actualizar la cita.' }],
      datos: req.body
    });
  }
};


const eliminarCita = async (req, res) => {
  
  const { id } = req.params;

  // Buscar la cita por su ID y cargar las relaciones
  const cita = await Cita.findByPk(id, {
    include: [
      { model: Usuario },
      { model: TipoCita, as: 'tipoCita' },
      { model: EstadoCita, as: 'estados' },
    ],
  });

  if (!cita) {
    // Si la cita no existe, redireccionar a la lista de citas
    return res.redirect('/admin-citas');
  }

  // Eliminar los registros de CitaEstadoRegistro para la cita
  await CitaEstadoRegistro.destroy({
    where: {
      cita_id: cita.id,
    },
  });

  // Eliminar la cita
  await cita.destroy();

  // Redireccionar a la lista de citas
  res.redirect('/admin-citas');
};

const citas = async (req, res) => {
  const usuarioId = req.usuario.id;
  const usuario = req.usuario;
  const usuarioAutenticado = true; // Si llegamos hasta aquí es porque el usuario está autenticado

  const inicioSemana = moment().startOf('week').toDate();
  const finSemana = moment().endOf('week').toDate();
  // Busca si el usuario ya tiene una cita
  const citaAsignada = await Cita.findOne({
    where: {
      usuarioId: usuarioId
    },
    include: [{ model: TipoCita, as: 'tipoCita' }]
  });

  if (citaAsignada) {
    // Si el usuario ya tiene una cita asignada, lo redirecciona a la página principal
    return res.redirect('/');
  }

  const citasDisponibles = await CitaEstadoRegistro.findAll({
    include: [
      {
        model: Cita,
        as: 'cita',
        include: [{ model: TipoCita, as: 'tipoCita' }, { model: Usuario, as: 'usuario' }],
      },
      {
        model: EstadoCita,
        as: 'estadoCita',
        where: { id: 1 }, // estado 'disponible'
      },
    ],
    where: {
      createdAt: {
        [Op.between]: [inicioSemana, finSemana],
      },
    },
    order: [['createdAt', 'ASC']],
  });
  

  res.render('citas', {
    pagina: 'Citas Disponibles',
    csrfToken: req.csrfToken(),
    usuario,
    citasDisponibles,
    autenticado: usuarioAutenticado,
  });
};

const asignarCita = async (req, res) => {
  const usuario = req.usuario;
  const usuarioId = req.usuario.id;
  const citaId = req.body.citaId;

  try {

  
    // Busca la cita en la base de datos
    const cita = await CitaEstadoRegistro.findOne({
      include: [
        {
          model: Cita,
          as: 'cita',
          include: [{ model: TipoCita, as: 'tipoCita' }, { model: Usuario, as: 'usuario' }],
        },
        {
          model: EstadoCita,
          as: 'estadoCita',
          where: { id: 1 }, // estado 'disponible'
        },
      ],
      where: { id: citaId },
    });
    
    if (!cita) {
      throw new Error('La cita no existe o no está disponible.');
    }

    const citas = await Cita.findAll();

    // Actualiza el estado de la cita y asigna el usuario
    cita.estado_cita_id = 2; // estado 'confirmada'
    cita.cita.usuarioId = usuarioId.toString();

    // Guarda los cambios en la base de datos
    await cita.save();
    await cita.cita.save(); // Guarda la cita de forma individual
    console.log(usuarioId)
    console.log(citaId)

    // Muestra el mensaje de confirmacion
    res.render('templates/mensaje-cita',{
      pagina: 'Cita Asignada',
      usuario,
  })
  } catch (error) {
    console.log(error);
    res.redirect('/citas');
  }
};




export {
  mostrarTodasLasCitas,
  mostrarFormularioCrearCita,
  crearCita,
  mostrarFormularioEditarCita,
  actualizarCita,
  eliminarCita,
  citas,
  asignarCita
}
