import Producto from "./Producto.js";
import Usuario from "./Usuario.js";
import ClaseProducto from "./ClaseProducto.js";
import TipoUsuario from "./TipoUsuario.js";
import Cita from "./Cita.js";
import EstadoCita from "./EstadoCita.js";
import CitaEstadoRegistro from "./CitaEstadoRegistro.js";

Usuario.belongsTo(TipoUsuario, { foreignKey: 'tipo_usuario', as: 'tipoUsuario' });
Producto.belongsTo(ClaseProducto, {foreignKey: 'claseProductoId'})
Producto.belongsTo(Usuario, {foreignKey: 'usuarioId'})
Cita.belongsTo(Usuario, { foreignKey: 'usuarioId' });
Cita.belongsToMany(EstadoCita, { through: CitaEstadoRegistro, as: 'estados' });
EstadoCita.belongsToMany(Cita, { through: CitaEstadoRegistro, as: 'citas' });




export {
    TipoUsuario,
    Producto,
    Usuario,
    ClaseProducto,
    Cita,
    EstadoCita,
}