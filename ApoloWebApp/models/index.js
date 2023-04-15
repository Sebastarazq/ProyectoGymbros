import Producto from "./Producto.js";
import Usuario from "./Usuario.js";
import ClaseProducto from "./ClaseProducto.js";
import TipoUsuario from "./TipoUsuario.js";

Usuario.belongsTo(TipoUsuario, { foreignKey: 'tipo_usuario', as: 'tipoUsuario' });
Producto.belongsTo(ClaseProducto, {foreignKey: 'claseProductoId'})
Producto.belongsTo(Usuario, {foreignKey: 'usuarioId'})




export {
    TipoUsuario,
    Producto,
    Usuario,
    ClaseProducto
}