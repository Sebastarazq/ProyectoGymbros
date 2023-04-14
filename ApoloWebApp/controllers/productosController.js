

const admin = (req,res) => {
    res.render('productos/admin', {
        pagina: 'Productos de la Tienda'
    })
}


//Formulario para crear un nuevo producto
const crear = (req,res) => {
    res.render('productos/crear'), {
        pagina: ''
    }
}

export {
    admin,
    crear
}