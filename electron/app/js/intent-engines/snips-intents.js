const actions = require('js/actions/actions')
const weather = require('js/skills/weather')
const PeeqoHue = require('js/skills/hue')
const Timer = require('js/skills/timer')
const event = require('js/events/events')
const responses = require('js/responses/responses')

function parseIntent(cmd){

    /* param {cmd} - response object from speech to text engine */

    // this one is for google dialogflow, you might need to make adjustments for a different engine

    console.log('cmd')
    console.log(cmd)

    switch(cmd.intent){

        case "greeting":
            actions.setAnswer(responses.greeting, {type: 'remote'})
            break

        case "camera":
            event.emit(`camera-${cmd.params.on.stringValue}`)
            break

        case "timer":
            let timer = new Timer(cmd.params.time.numberValue, cmd.params.timeUnit.stringValue)
            timer.startTimer()
            break

        case "weather":
            weather.getWeather(cmd.params.city.stringValue)
            break

        case "changeGlasses":
            event.emit("change-glasses")
            break

        case "goodbye":
            actions.setAnswer(responses.bye, {type: 'local'})
            break

        case "cat":
            let callbackDuringResponse = () => {
                speak.speak(`${cmd.responseText}`)
                console.log(`responseText: ${cmd.responseText}`)
            }

            actions.setAnswer(responses.cat, {type: 'remote', cbDuring: callbackDuringResponse})
            break

        case "hue":
            let hue = new PeeqoHue()
            hue.discoverNearbyBridges()
            hue.changeGroupState(cmd.params.hue_group.stringValue, {on: cmd.params.hue_state.stringValue === "on"})
            break

        default:
            actions.setAnswer(responses.confused, {type:'local'})
            break
    }

    // setAnswer(responses[cmd.intent], {type:'remote'})
}

module.exports = {
    parseIntent
}