import express from 'express'
import hbs from 'hbs'
import path from 'path'
import morgan from 'morgan'
import bodyParcel from 'body-parser'

//const database = require('./database')
import { initDatabase, initTable, insertProduct, getProduct } from './database.js'

const __dirname = path.resolve()

const app = express()
const db = initDatabase()
initTable(db)

app.set('views', __dirname + '/layout')
app.set('view engine', 'html')
app.engine('html', hbs.__express)

app.use(morgan('combined'))

app.use(bodyParcel.urlencoded())

app.use('/assets', express.static(__dirname + '/assets'))


app.get('/', (req, res, next) => {
    res.send({ success: true})
})

app.get('/product', (req, res, next) => {
    res.render('product')
})

app.get('/add-product', (req, res, next) => {
    res.send(req.query)
})

app.post('/add-product', (req, res, next)=> {
    console.log('Request', req.body)
    res.send(req.body)
})

app.use((err, req, res, next) =>{
    res.send(err.message)
})

app.listen(8000,() => {
    console.log('App listen on port 8000')
})