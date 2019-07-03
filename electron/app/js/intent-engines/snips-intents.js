const event = require('js/events/events');
const IntentEngine = require('js/intent-engines/base-intents');
const speak = require('js/senses/speak');

const { SnipsIntent, SnipsIntentWrapper } = require('js/intents/snips_intent');

class SnipsIntentEngine extends IntentEngine {
    constructor() {
        super();
        this.intentDetected = false;

        this.wakewordIntent = new SnipsIntent("Wakeword", require('json/intents/Wakeword.json'));
    }

    interceptEvents() {
        let self = this;
        event.on('snips-onConnect', function() {
            event.emit('led-on', {anim: 'circle', color: 'aqua'});
            speak.speak('Snips MQTT connected!');
        });

        event.on('snips-finalCommand', function(intent) {
            self.intentDetected = true;
            self.parseIntent(intent);
        });

        event.on('snips-wakeword', function() {
            self.intentDetected = false;
            let promise = self.wakewordIntent.perform();
        });

        event.on('snips-listening', function(listening) {
            if(!self.intentDetected) {
                if(!listening) {
                    event.emit('no-command');
                    return;
                }
            }

            event.emit('listening', listening);
        });
    }

    /* param {cmd} - response object from speech to text engine */
    parseIntent(cmd) {
        console.log(`cmd`);
        console.log(cmd);

        let intent = new SnipsIntentWrapper(cmd);
        let promise = intent.intent.perform();
    }
}


module.exports = SnipsIntentEngine;