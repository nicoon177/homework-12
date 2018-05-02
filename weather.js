const request = require('request');
const { argv } = require('yargs');

const CITY = argv.c || 'Ternopil';
const GOOGLE_API_KEY = process.env.GOOGLE_KEY;
const GOOGLE_ROOT_URL = `https://maps.googleapis.com/maps/api/geocode/json?&address=${CITY}&key=${GOOGLE_API_KEY}`;
const DARK_SKY_KEY = process.env.DARKSKY_KEY;
const DARK_SKY_ROOT_URL = `https://api.darksky.net/forecast/${DARK_SKY_KEY}`;

const Weather = request(GOOGLE_ROOT_URL, function (err, response, body) {
    if(err){
        console.log('error:', error);
    } else {
        if (JSON.parse(body).status === 'ZERO_RESULTS'){
            console.log('There is no such city, please enter a valid one.')
        }
        let response = JSON.parse(body);
        let location = response.results.find(item => {
            let lat = item.geometry.location.lat;
            let lng = item.geometry.location.lng;
            request(`${DARK_SKY_ROOT_URL}/${lat},${lng}`, function (err, response, body) {
                if (err) {
                    console.log('error: ', error);
                } else {
                    let data = JSON.parse(body);
                    const toCelsius = (data.currently.temperature - 32) * 5/9;
                    console.log(`The temperature in ${CITY} is`, `${parseFloat(toCelsius).toFixed(1)}`);
                }
            } )
        });
    }
});

module.exports = {
    Weather
}