module.exports = {
	giphy:{
		key:'', // get your own from https://developers.giphy.com/docs/
		max_gif_size: 800000, // max gif size it should try to download
        max_mp4_size: 700000  // max video size it should try to download
	},
	speech: {
        projectId: 'peeqo', // your dialogflow project name
        dialogflowKey: 'dialogflow.json', // *.json - name of your dialogflow key file - should be stored in app/config/
        wakeword: "peeqo", // you can change this wakeword if you record a differnt one on snowboy.kitt.ai
        language: "en-US", // find supported language codes - https://cloud.google.com/dialogflow-enterprise/docs/reference/language
        model: "Peeqo.pmdl", // The name of your model - name model downloaded from snowboy.kitt.ai - should be stored in app/config
        sensitivity: 0.5, // Keyword getting too many false positives or not detecting? Change this.
        continuous: false // After a keyword is detected keep listening until speech is not heard
    },
    fileExtensions: [".gif", ".mp4", ".webp"], // list of supported file types
    server: "", //"http://localhost:3000"
    openweather: {
        key: "", // please get api key from https://openweathermap.org/api
        city: 'New York' // default city to search - change it to your city of choice
    },
    spotify:{
        clientId:"", // get from https://developer.spotify.com/dashboard/applications
        clientSecret:""
    },
    vlipsy:{
        key:"" // request for api key by emailing api@vlipsy.com
    },
    hue: {
        bridgeUser: "", // 'user' of the bridge, output during setup of hue with peeqo (TODO: This needs to be smoother somehow)
        bridgeIp: "",   // the ip of the Phillips Hue bridge
        groups: [], // list of names of groups in the phillips hue setup
        lights: []  // list of names of lights in the phillips hue setup
    },
    snips: {
        mqtt: {
            hostname: "mqtt://localhost"    // Where the mqtt server is running to talk with snips's audio server
        }
    },
    github: {
        accessToken: "",    // Access token from GH for auth
        baseUrl: '',        // API url of the GH instance (can be set to an enterprise API url)
        user: ''            // User to auth / make calls with
    },
    socket: {
        host: ''            // socket.io server for web communication with peeqo
    }
};