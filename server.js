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


// Vanilla 
const matcher = require('./matcher');
const weather = require('./weather');
const {currentWeather, forecastWeather} = require('./parser');

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
		// console.log(req);
		// console.log(res);
		// console.log(msg.sender+`Hey, You just said ${msg.message.text}`);
		// f.text(msg.sender, `Hey, You just said ${msg.message.text}`);
		// f.img(msg.sender, "https://upload.wikimedia.org/wikipedia/en/thumb/6/63/IMG_%28business%29.svg/1200px-IMG_%28business%29.svg.png");
		if(msg.message.text){
			//if a text message is received
			matcher(msg.message.text, data =>{
				switch(data.intent){
					case 'Hello':
						f.text(msg.sender, `${data.entities.greeting} to you too!`);
					break;
					case 'CurrentWeather':
						weather(data.entities.city, 'current')
							.then(response =>{
								let parseResult = currentWeather(response);
								f.text(msg.sender, parseResult);
							})
							.catch(error =>{
								console.log("there seems to be a problem with connecting to weather service");
							 	f.text(msg.sender, "Hmm, Something's not right with my servers! Do check back in a while.. Sorry! :(");
							});
					break;
					case 'WeatherForecast':
						weather(data.entities.city)
							.then(response =>{
								let parseResult = forecastWeather(response, data.entities);
								f.text(msg.sender, parseResult);
							})
							.catch(error =>{
								console.log("there seems to be a problem with connecting to weather service");
							 	f.text(msg.sender, "Hmm, Something's not right with my servers! Do check back in a while.. Sorry! :(");
							});
					break;
					case 'Image':
						f.img(msg.sender, "https://upload.wikimedia.org/wikipedia/en/thumb/6/63/IMG_%28business%29.svg/1200px-IMG_%28business%29.svg.png");
					break;
					default: {
						f.text(msg.sender, "Ja yaar, tang na kar :p");
					}
				}
			});
		}
	});
	return next();
});
// Subscribe
f.subscribe();
server.listen(PORT, () => console.log(`Vanilla Running on port ${PORT}`)); 