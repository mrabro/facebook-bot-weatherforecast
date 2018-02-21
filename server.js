'use strict';
//create an API SERVER

const Restify = require('restify');
const server = Restify.createServer({
	name: 'VanillaMessenger'
});
const PORT = process.env.PORT || 3000;

server.use(Restify.jsonp());
server.use(Restify.bodyParser());

//TOKENS
const config = require('./config');

// FBeamer
const FBeamer = require('./fbeamer');
const f = new FBeamer(config);

// Register the webhooks
server.get('/', (req, res, next) => {
	f.registerHook(req, res);
	return next();
});

// Recieve All incoming Messages
server.post('/', (req,res,next) =>{
	f.incoming(req,res,msg=>{
		//process messages
		console.log(msg);
		console.log(msg.sender+`Hey, You just said ${msg.message.text}`);
		f.text(msg.sender, `Hey, You just said ${msg.message.text}`);
	});
	return next();
});
server.listen(PORT, () => console.log(`Vanilla Running on port ${PORT}`)); 