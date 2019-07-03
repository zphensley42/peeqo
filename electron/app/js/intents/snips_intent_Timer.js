const { SnipsIntent, SnipsIntentWrapper } = require('js/intents/snips_intent');
const Timer = require('js/skills/timer');

class SnipsTimerIntent extends SnipsIntent {
    constructor(name, data) {
        super(name, data);
    }

    parse(cmd) {
        // Basic parsing, special slot handling can be handled in subclasses
        if (cmd.hasOwnProperty("slots") && cmd.slots != null) {
            if(cmd.slots.length >= 1 && (cmd.slots[0].value.hours !== "" || cmd.slots[0].value.minutes !== "" || cmd.slots[0].value.seconds !== "")) {
                this.slots[0] = cmd.slots[0];
                this.duration = (cmd.slots[0].value.hours * 3600) + (cmd.slots[0].value.minutes * 60) + (cmd.slots[0].value.seconds);
            }
            else {
                this.validIntent = false;
            }
        }
        else {
            this.validIntent = false;
        }

        return this;
    }

    async perform() {
        if(this.validIntent) {
            let timer = new Timer(this.duration, 'seconds');
            await timer.startTimer(this.actor);
        }
        else {
            // This should show confused
            await super.perform();
        }
    }
}

module.exports = SnipsTimerIntent;