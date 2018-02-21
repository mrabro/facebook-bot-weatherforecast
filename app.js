'use strict';

const Readline = require('readline');
const rl = Readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
});
const matcher = require('./matcher');
const weather = require('./weather');
const {currentWeather, forecastWeather} = require('./parser');

rl.setPrompt('> ');
rl.prompt();
rl.on('line', reply =>{
	matcher(reply, data => {
		switch(data.intent){
			case 'Hello':
				console.log(`${data.entities.greeting} to you too`);
				rl.prompt();
				break;
			case 'Exit':
				console.log('Have a great Day!');
				process.exit(0);
				break;
			case 'CurrentWeather':
				console.log(`Checking weather for ${data.entities.city}...`);
				//get weather data from an API
				weather(data.entities.city, 'current')
					.then(response => {
						let parseResult = currentWeather(response);
						// console.log(response);
						console.log(parseResult);
						rl.prompt();
					})
					.catch(error =>{
						console.log("There seems to be a problem connecting to weather service");
						rl.prompt();
					});
				break;
			case 'WeatherForecast':
				console.log(`Let me check weather for ${data.entities.city}...`);
				//get weather data from an API
				weather(data.entities.city)
					.then(response => {
						let parseResult = forecastWeather(response, data.entities);
						// console.log(response);
						console.log(parseResult);
						rl.prompt();
					})
					.catch(error =>{
						console.log(error);
						console.log("There seems to be a problem connecting to weather service");
						rl.prompt();
					});
				break;
			default: {
				console.log("I don't know what you mean to say");
				rl.prompt();
			}
		}
	});
	// console.log(`You said: ${reply}`);
	// rl.prompt();
}); //event listener