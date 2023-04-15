import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const TipoUsuario = db.define('tipo_usuario', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

export default TipoUsuario;