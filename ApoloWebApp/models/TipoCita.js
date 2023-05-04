import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const TipoCita = db.define('TipoCita', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default TipoCita;
