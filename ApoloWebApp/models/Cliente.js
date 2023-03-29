import { DataTypes } from 'sequelize'
import bcrypt from 'bcrypt'
import db from '../config/db.js'

const Cliente = db.define('clientes',{
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    apellido: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: DataTypes.STRING,
    confirmado: DataTypes.BOOLEAN
}, {
    hooks: {
        beforeCreate: async function(cliente) {
            const salt = await bcrypt.genSalt(10)
            cliente.password = await bcrypt.hash( cliente.password, salt);
        }
    },
    scopes: {
        eliminarPassword: {
            attributes:{
                exclude: ['password','token','confirmado','createdAt','updatedAt']
            }
        }
    }
})

Usuario.prototype.verificarPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}


export default Cliente