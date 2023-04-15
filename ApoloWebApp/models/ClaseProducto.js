import { DataTypes } from 'sequelize'
import db from '../config/db.js'

const ClaseProducto = db.define('clase_productos',{
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    }

});

export default ClaseProducto;