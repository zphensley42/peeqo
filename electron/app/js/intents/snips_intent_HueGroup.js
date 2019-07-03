const { SnipsIntent, SnipsIntentWrapper } = require('js/intents/snips_intent');
const PeeqoHue = require('js/skills/hue');

class SnipsHueIntent extends SnipsIntent {
    constructor(name, data) {
        super(name, data);
    }

    parse(cmd) {
        super.parse(cmd);
        if(this.slots.length <= 1) {
            this.validIntent = false;
        }
        else {
            this.target = this.slots[0];
            this.state = this.slots[1];
        }

        return this;
    }

    async perform() {
        if(this.validIntent) {

            let hue = new PeeqoHue();
            hue.controlGroupLights(this.target, {on: this.state === "on"});
        }
        else {
            await super.perform();
        }
    }
}

module.exports = SnipsHueIntent;
