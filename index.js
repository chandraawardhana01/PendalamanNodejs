

import express from 'express'
import hbs from 'hbs'
import path from 'path'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import fileUpload from 'express-fileupload'
import fs from 'fs'
//const database = require('./database')
import { initDatabase, initTable, insertProduct, getProduct } from './database.js'

const __dirname = path.resolve()

const app = express()
const db = initDatabase()
initTable(db)

app.set('views', __dirname + '/layout')
app.set('view engine', 'html')
app.engine('html', hbs.__express)

app.use(fileUpload())

app.use(morgan('combined'))

app.use(bodyParser.urlencoded())

app.use('/assets', express.static(__dirname + '/assets'))
app.use('/files', express.static(__dirname + '/files'))

app.get('/', (req, res, next) => {
    res.send({ success: true})
})

app.get('/product', async (req, res, next) => {
  
    let products
    try {
      products = await getProduct(db)
    } catch (error) {
      return next(error)
    }
  
    res.render('product', { products })
  })

app.get('/add-product', (req, res, next) => {
    res.send(req.query)
})

app.post('/add-product', (req, res, next) => {
    console.log('Request', req.body)
    console.log('File', req.files)
    // get file name
    const fileName = Date.now() + req.files.photo.name
  
    // write file
    fs.writeFile(path.join(__dirname, '/files/', fileName), req.files.photo.data, (err) => {
      if (err) {
        console.error(err)
        return
      }
  
      // insert product
      insertProduct(db, req.body.name, parseInt(req.body.price), `/files/${fileName}`)
      
      // redirect
      res.redirect('/product')
    })
  })

app.use((err, req, res, next) =>{
    res.send(err.message)
})

app.listen(8000,() => {
    console.log('App listen on port 8000')
})