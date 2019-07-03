'use strict';

const common = require('js/helpers/common');
const media = require('js/helpers/media');
const event = require('js/events/events');
const speak = require('js/senses/speak');

const intentName = function(cmd) {
    if(cmd.intent != null && cmd.intent.intentName != null) {
        let intentSplit = cmd.intent.intentName.split(':');
        if(intentSplit.length === 2) {
            return intentSplit[1];
        }
    }
};

class SnipsIntent {
    constructor(name, data) {
        this.name = name;
        this.slots = [];
        this.confusedData = require('json/intents/Confused.json');

        this.validIntent = true;
        this.data = data;
    }

    // Additional builders
    override(overrides = {}) {
        this.overrides = overrides;
        return this;
    }

    before(cb) {
        this.beforeCb = cb;
        return this;
    }

    during(cb) {
        this.duringCb = cb;
        return this;
    }

    after(cb) {
        this.afterCb = cb;
        return this;
    }

    confused(cb) {
        this.confusedCb = cb;
        return this;
    }

    parse(cmd) {
        // Basic parsing, special slot handling can be handled in subclasses
        if (cmd.hasOwnProperty("slots") && cmd.slots != null) {
            let forEachFunc = function(value, index, array) {
                if(value.value.value !== "") {
                    this.slots[index] = value.value.value;
                }
            };
            forEachFunc = forEachFunc.bind(this);
            cmd.slots.forEach(forEachFunc);
        }

        return this;
    }

    playSound() {
        if(this.data == null || this.data === undefined) {
            return;
        }

        if(this.data.hasOwnProperty('sound') && this.data.sound !== null) {
            if(this.data.hasOwnProperty('volume') && this.data.volume != null) {
                event.emit('play-sound', this.data.sound, this.data.volume);
            }
            else {
                event.emit('play-sound', this.data.sound, 0.5)
            }
        }
    }

    async readMedia() {
        let q = await common.setQuery(this.data);
        console.log(`LOCAL FILE OR SEARCH QUERY > ${q}`);

        let r = null;

        if(this.data.type === 'remote'){
            r = await media.findRemoteGif(q);
            console.log(`MEDIA URL > ${r}`);
        } else {
            // local response
            r = q
        }

        this.mediaType = await media.findMediaType(r);
        this.mediaDuration = await media.findMediaDuration(r);
        console.log(`MEDIA DURATION > ${this.mediaDuration}`);
    }

    showLed() {
        if(this.data.hasOwnProperty('led') && Object.keys(this.data.led).length !== 0) {
            // run led animation
            event.emit('led-on', {anim: this.data.led.anim , color: this.data.led.color });
        }
    }

    playServo() {
        if(this.data.hasOwnProperty('servo') && this.data.servo !== null) {
            // move servo
            event.emit('servo-move', this.data.servo);
        }
    }

    showMedia() {
        let showMedia = common.transitionToMedia(this.mediaDuration, this.mediaType);

        if(this.data.hasOwnProperty('text') && this.data.text) {
            text.showText(this.data.text);
        }
    }

    async finishMedia() {
        let o = await common.transitionFromMedia(this.mediaDuration);

        if(this.data.hasOwnProperty('text')) {
            text.removeText();
        }
    }

    execBefore() {
        if(!this.validIntent) {
            return;
        }
        console.log('Intent media display started');
        if(this.beforeCb != null && this.beforeCb !== undefined) {
            this.beforeCb = this.beforeCb.bind(this);
            this.beforeCb();
        }
    }

    execDuring() {
        if(!this.validIntent) {
            return;
        }
        console.log('Intent media display running');
        if(this.duringCb != null && this.duringCb !== undefined) {
            this.duringCb = this.duringCb.bind(this);
            this.duringCb();
        }
    }

    execAfter() {
        if(!this.validIntent) {
            return;
        }
        console.log('Intent media display completed');
        if(this.afterCb != null && this.afterCb !== undefined) {
            this.afterCb = this.afterCb.bind(this);
            this.afterCb();
        }
    }

    async perform() {

        // If we are confused, just use confused data and return (also call the callback)
        if(!this.validIntent) {
            if(this.confusedCb != null) {
                console.log('confusedCb exists, executing...');
                this.confusedCb = this.confusedCb.bind(this);
                this.confusedCb();
            }

            console.log('assigning confused data');
            this.data = this.confusedData;
        }

        // merge overridden values and new values
        Object.assign(this.data, this.overrides);

        console.log('data in perform');
        console.log(this.data);

        this.playSound();

        await this.readMedia();

        this.showLed();
        this.playServo();

        this.execBefore();
        this.showMedia();
        this.execDuring();
        await this.finishMedia();
        this.execAfter();
    }
}

class SnipsIntentWrapper {
    constructor(cmd) {
        let name = intentName(cmd);
        let data = this.readIntent(name);
        let intentType = data.intentType;
        let IntentType = data.hasOwnProperty("intentType") ? require(`js/intents/snips_intent_${intentType}`) : SnipsIntent;
        this.intent = new IntentType(name, data).parse(cmd);
    }

    readIntent(name) {
        return require(`json/intents/${name}.json`);
    }
}

module.exports = {
    SnipsIntent : SnipsIntent,
    SnipsIntentWrapper : SnipsIntentWrapper
};