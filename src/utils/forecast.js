const request = require('request')

const forecast = (lat, long, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=9bf5a833ccfe4a43be9004d235dda2ad&query=' + lat + ',' + long

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to weather service!', undefined)
        } else if (body.error) {
            callback('Unable to find location', undefined)
        } else {
            callback(undefined, `It is currently ${body.current.temperature}° out. It feels like ${body.current.feelslike}° out.`)
        }
    })
}

module.exports = forecast