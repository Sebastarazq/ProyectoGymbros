import bcrypt from 'bcrypt'
const usuarios = [
    {
        nombre: 'Admin',
        apellido: 'Admin',
        email: 'admin@apolo.com',
        confirmado: 1,
        tipo_usuario: 2,
        password: bcrypt.hashSync('password',10)
    }
]

export default usuarios;