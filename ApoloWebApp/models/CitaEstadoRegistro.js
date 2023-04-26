import { DataTypes } from 'sequelize';
import db from '../config/db.js';
const CitaEstadoRegistro = db.define('CitaEstadoRegistro', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  });

export default CitaEstadoRegistro;
  