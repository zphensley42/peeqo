const { SnipsIntent, SnipsIntentWrapper } = require('js/intents/snips_intent');
const event = require('js/events/events');

class SnipsCameraIntent extends SnipsIntent {
    constructor(name, data) {
        super(name, data);
    }

    parse(cmd) {
        super.parse(cmd);
        if(this.slots.length <= 0) {
            this.validIntent = false;
        }
        else {
            this.action = this.slots[0];
        }

        return this;
    }

    async perform() {
        if(this.validIntent) {
            event.emit(`camera-${this.action}`);
        }
        else {
            await super.perform();
        }
    }
}

module.exports = SnipsCameraIntent;
