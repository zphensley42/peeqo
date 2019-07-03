const { SnipsIntent, SnipsIntentWrapper } = require('js/intents/snips_intent');
const event = require('js/events/events');

class SnipsChangeGlassesIntent extends SnipsIntent {
    constructor(name, data) {
        super(name, data);
    }

    async perform() {
        event.emit('change-glasses');
    }
}

module.exports = SnipsChangeGlassesIntent;
