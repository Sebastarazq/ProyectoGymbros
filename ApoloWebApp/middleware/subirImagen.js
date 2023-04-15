import multer from "multer";
import path from 'path'
import { generaId } from '../helpers/tokens.js'

const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null, './public/uploads/')

    },
    filename: function (req,file,cb) {
        cb(null, generaId() + path.extname(file.originalname))
        
    }
})

//le pasamos el objeto de la configuracion de nosotros
const upload = multer ({ storage })

export default upload;