const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

const address = process.argv[2]

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Us'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Us',
        name: 'Us'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Us'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    } else {
        geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
            if (error) {
                return res.send({ error })
            } else {
                forecast(latitude, longitude, (error, forecastData) => {
                    if (error) {
                        return res.send({ error })
                    }
                    else {
                        res.send({
                            forecast: forecastData,
                            location,
                            address: req.query.address
                        })
                    }
                })
            }

        })
    }
})



// wildcard for help/wildcard
app.get('/help/*', (req, res) => {
    res.render('404', {
        errorMessage: 'Help article not found.',
        title: '404',
        name: 'Us'
    })
})

// wildcard for all 404 pages
app.get('*', (req, res) => {
    res.render('404', {
        errorMessage: 'Page not found.',
        title: '404',
        name: 'Us'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000')
})