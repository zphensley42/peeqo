const { SnipsIntent, SnipsIntentWrapper } = require('js/intents/snips_intent');
const PeeqoGithub = require('js/skills/github');

class SnipsGithubIntent extends SnipsIntent {
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
        }

        return this;
    }

    async perform() {
        if(this.validIntent) {
            let gh = new PeeqoGithub();

            if(targetSlot === "pulls") {
                gh.listUserPulls('zphensley42');
            }
            else if(targetSlot === "repos") {
                gh.listUserRepos('zphensley42');
            }
        }
        else {
            await super.perform();
        }
    }
}

module.exports = SnipsGithubIntent;
