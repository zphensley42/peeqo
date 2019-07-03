const { SnipsIntent, SnipsIntentWrapper } = require('js/intents/snips_intent');
const { PeeqoWeather } = require('js/skills/weather');

class SnipsWeatherIntent extends SnipsIntent {
    constructor(name, data) {
        super(name, data);
    }

    parse(cmd) {
        super.parse(cmd);
        if(this.slots.length <= 0) {
            this.validIntent = false;
        }
        else {
            this.city = this.slots[0];
        }

        return this;
    }

    async perform() {
        if(this.validIntent) {
            let weather = new PeeqoWeather();
            weather.getWeather(this.city);
        }
        else {
            await super.perform();
        }
    }
}

module.exports = SnipsWeatherIntent;
