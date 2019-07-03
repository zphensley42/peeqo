const event = require('js/events/events');
const { SnipsIntent, SnipsIntentWrapper } = require('js/intents/snips_intent');

class Timer {
	constructor(time, units) {
		this.time = time;
		this.unit = units;
		this.timer = null;
		this.multiplier = 1000;

        this.okIntent = new SnipsIntent("OK", require('json/intents/OK.json'));
        this.alarmIntent = new SnipsIntent("Alarm", require('json/intents/Alarm.json'));

        if(this.unit === "hour" || this.unit === "hours"){
			this.multiplier *= 3600
		} else if(this.unit === "minute" || this.unit === "minutes"){
			this.multiplier *= 60
		}

		this.time = this.time * this.multiplier;

		this.clearTimer = this.clearTimer.bind(this);

		event.once('stop-timer', this.clearTimer)
	}

	async startTimer() {

        await this.okIntent.perform();

        let timeoutFunc = async function() {
            await this.alarmIntent.perform();
            console.log("timer over");
            this.timer = null
		};
        timeoutFunc = timeoutFunc.bind(this);

		this.timer = setTimeout(timeoutFunc, this.time);
	}

	clearTimer() {
		if(this.timer !== null){
			clearTimeout(this.timer);
			this.timer = null
		}
	}
}

module.exports = Timer;
