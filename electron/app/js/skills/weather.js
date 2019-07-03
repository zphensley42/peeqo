const { SnipsIntent, SnipsIntentWrapper } = require('js/intents/snips_intent');
const config = require('config/config');
const speak = require('js/senses/speak');

class PeeqoWeather {
	constructor() {
	    this.weatherIntent = new SnipsIntent("Weather", require('json/intents/Weather.json'));
    }

    // @param {string} city - city to find weather of
    getWeather(city) {
        if(!city){
            // enter your default city here
            city = config.openweather.city
        }

        let query = encodeURI(city);

        fetch(`http://api.openweathermap.org/data/2.5/weather?q=${query}&units=imperial&APPID=${config.openweather.key}`)
            .then((response)=> response.json())
            .then((json)=>{
                console.log(json);
                if(json.code === '404') {
                    speak.speak(`Sorry, I could not find the city: ${query}`);
                    console.error(`Cant find city ${query}`);
                    return
                }

                this.displayWeather(json)
            })
    }

    displayWeather(data) {
        let cbDuring = () => {
            speak.speak(`The temperature in ${data.name} is ${data.main.temp} degrees with ${data.weather[0].description}`)
        };

        this.weatherIntent = this.weatherIntent.override(
            {
                queryTerms: [data.weather[0].description],
                text: `${data.main.temp} \n ${data.weather[0].description}`,
                type: 'remote'
            }
        ).during(cbDuring);
        let promise = this.weatherIntent.perform();

        console.log(`The temperature in ${data.name} is ${data.main.temp} degrees with ${data.weather[0].description}`)
    }

}

module.exports = {
    PeeqoWeather : PeeqoWeather
};
