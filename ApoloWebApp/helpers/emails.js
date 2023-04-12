import nodemailer from 'nodemailer'

const emailRegistro= async (datos) =>{
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const {email, nombre, apellido, token} = datos

    //Enviar el email
    await transport.sendMail({
        from: 'Apolo.com',
        to: email,
        subject: 'Confirma tu Cuenta en Apolo.com',
        text:'Confirma tu Cuenta en Apolo.com',
        html: `
        <p>Hola ${nombre}${apellido},comprueba tu cuenta en Apolo.com</p>
        
        <p>Tu cuenta ya esta lista,solo debes confrimarla en el siguiente enlace: 
        <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 4000}/auth/confirmar/${token}">Confirmar Cuenta<a/> </p>

        <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
        `
    })
}
const emailOlvidePassword = async (datos) =>{
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const {email, nombre, apellido, token} = datos

    //Enviar el email
    await transport.sendMail({
        from: 'Apolo.com',
        to: email,
        subject: 'Restable tu password en Apolo.com',
        text:'Restable tu password en Apolo.com',
        html: `
        <p>Hola ${nombre}${apellido},Has solicitado restablecer tu Password en Apolo.com</p>
        
        <p>Sigue el siguiente enlace para generar un password nuevo: 
        <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 4000}/auth/olvide-password/${token}">Restablecer Password<a/> </p>

        <p>Si tu no Solcitaste el cambio de Password, puedes ignorar el mensaje</p>
        `
    })
}

export {
    emailRegistro,
    emailOlvidePassword
}