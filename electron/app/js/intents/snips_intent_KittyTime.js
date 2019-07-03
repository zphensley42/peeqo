const { SnipsIntent, SnipsIntentWrapper } = require('js/intents/snips_intent');
const speak = require('js/senses/speak');

class SnipsKittyTimeIntent extends SnipsIntent {
    constructor(name, data) {
        super(name, data);
    }

    parse(cmd) {
        super.parse(cmd);

        let toSpeak = this.data.speak;
        this.during(()=>{
            speak.speak(toSpeak);
        });

        return this;
    }

    async perform() {
        await super.perform();
    }
}

module.exports = SnipsKittyTimeIntent;
