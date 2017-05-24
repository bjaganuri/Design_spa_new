module.exports = Object.freeze({
	initServerData:{
		port:3000,
		dbURI:'mongodb://bbj:bbj@localhost/NodeApp'
	},
    login:{
		maxAttempts:3,
		lockoutHours:2*60*60*1000
	}
});