import { Producto, ClaseProducto , Usuario} from '../models/index.js'

const productos = async (req,res) =>{

    const productos = await Producto.findAll({
        include: [
            {model: ClaseProducto, as: 'clase_producto'},
        ]

    })
    res.json(productos)
}

export{
    productos
}