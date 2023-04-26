import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const EstadoCita = db.define('EstadoCita', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

export default EstadoCita;