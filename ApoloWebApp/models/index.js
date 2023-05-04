import Producto from "./Producto.js";
import Usuario from "./Usuario.js";
import ClaseProducto from "./ClaseProducto.js";
import TipoUsuario from "./TipoUsuario.js";
import Cita from "./Cita.js";
import TipoCita from "./TipoCita.js";
import EstadoCita from "./EstadoCita.js";
import CitaEstadoRegistro from "./CitaEstadoRegistro.js";

Usuario.belongsTo(TipoUsuario, { foreignKey: 'tipo_usuario', as: 'tipoUsuario' });
Producto.belongsTo(ClaseProducto, {foreignKey: 'claseProductoId'})
Producto.belongsTo(Usuario, {foreignKey: 'usuarioId'})
Cita.belongsTo(Usuario, { foreignKey: 'usuarioId' });
Cita.belongsTo(TipoCita, { foreignKey: 'tipo_cita_id', as: 'tipoCita' }); // Agrega la relación entre Cita y TipoCita
Cita.belongsToMany(EstadoCita, {
    through: CitaEstadoRegistro,
    as: 'estados',
    foreignKey: 'cita_id' // nombre de la clave foránea en CitaEstadoRegistro que apunta a Cita
});
  
EstadoCita.belongsToMany(Cita, {
    through: CitaEstadoRegistro,
    as: 'citas',
    foreignKey: 'estado_cita_id' // nombre de la clave foránea en CitaEstadoRegistro que apunta a EstadoCita
}); 
CitaEstadoRegistro.belongsTo(Cita, { foreignKey: 'cita_id', as: 'cita' });
CitaEstadoRegistro.belongsTo(EstadoCita, { foreignKey: 'estado_cita_id', as: 'estadoCita' });
  


export {
    TipoUsuario,
    Producto,
    Usuario,
    ClaseProducto,
    Cita,
    TipoCita,
    EstadoCita,
    CitaEstadoRegistro,
}