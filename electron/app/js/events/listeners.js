const event = require('js/events/events')
const action = require('js/actions/actions')
const common = require('js/helpers/common')
const power = require('js/power/power')
const speak = require('js/senses/speak')
// const intentsEngine = require('js/intent-engines/dialogflow-intents')
const IntentsEngine = require('js/intent-engines/snips-intents')
const mic = require('js/senses/mic')

function forceHue() {
    intentsEngine.parseIntent({intent: 'hue', params: {hue: {groupName: 'Kitchen', state: 'off'}}})
}

// TODO: Add debug buttons to display for the top 4 buttons on peeqo
// TODO: Setup utility for handling button triggers and how to pass to "actions" or so on

const intentEngine = new IntentsEngine();

module.exports = () => {

	// Explicit for now, others are through the engine
	event.on('wakeword', action.wakeword);
	event.on('hue', forceHue);

    intentEngine.interceptEvents();

	// event.on('no-command', () => {
	// 	event.emit("led-on", {anim:'fadeOutError',color:'red'})
	// });
    //
	// event.on('end-speech-to-text', () => {
	//
	// 	if(process.env.OS == "unsupported"){
	// 		document.getElementById("wakeword").style.backgroundColor = ""
	// 	}
    //
	// 	event.emit('pipe-to-wakeword')
	// })

	// passes id of div to show
	event.on('show-div', common.showDiv)


	// POWER CONTROL
	event.on('shutdown', power.shutdown)

	event.on('reboot', power.reboot)

	event.on('refresh', power.refresh)


	// AUDIO PLAYBACK
	event.on('play-sound', speak.playSound)

	event.on('set-volume', speak.setVolume)

	// BUTTON PRESSES
	event.on('btn-4-short-press',()=>{
		console.log('btn 4 short press')
	})
	event.on('btn-4-long-press',()=>{
		console.log('btn 4 long press')
	})

	event.on('btn-16-short-press',()=>{
		console.log('btn 16 short press')
		power.refresh()
	})
	event.on('btn-16-long-press',()=>{
		console.log('btn 16 long press')
		power.shutdown()
	})

	event.on('btn-17-short-press',()=>{
		console.log('btn 17 short press')
	})
	event.on('btn-17-long-press',()=>{
		console.log('btn 17 long press')
	})

	event.on('btn-23-short-press',()=>{
		console.log('btn 23 short press')
	})
	event.on('btn-23-long-press',()=>{
		console.log('btn 23 long press')
	})

}