'use strict';
const request = require('request');

class FBeamer {
	constructor(config){
		try {
			if(!config || config.PAGE_ACCESS_TOKEN === undefined || config.VERIFY_TOKEN === undefined){
				throw new ERROR("Unable to access tokens!");
			}else{
				this.PAGE_ACCESS_TOKEN = config.PAGE_ACCESS_TOKEN;
				this.VERIFY_TOKEN = config.VERIFY_TOKEN;
			}
		}catch(e){
			console.log(e);
		}
	}
	registerHook(req, res){
		// if req.query.hub.mode is 'subscribe'
		// and if req.query.verify_token is same as the verify_token
		// then send back HTTP status 200 and req.query.hub.challenge
		let {mode, verify_token, challenge} = req.query.hub;
		if(mode === 'subscribe' && verify_token === this.VERIFY_TOKEN){
			return res.end(challenge);
		}else{
			console.log("Could not register webhook!");
			return res.status(403).end();
		}
	}

	subscribe(){
		request({
			uri: 'https://graph.facebook.com/v2.6/me/subscribed_apps',
			qs: {
				access_token: this.PAGE_ACCESS_TOKEN
			},
			method: 'POST'
		}, (error, response, body) =>{
			if(!error && JSON.parse(body).success){
				console.log("Subscribed to the Page");
			}else{
				console.log(error);
			}
		});
	}

	incoming(req, res, cb){
		//Extract the body of the POST request
		let data = req.body;
		if(data.object === 'page'){
			//iterate through the page entry array
			data.entry.forEach(pageObj => {
				// iterate through the messaging arrays
				pageObj.messaging.forEach(msgEvent => {
					let messageObj = {
						sender: msgEvent.sender.id,
						timeOfMessage: msgEvent.timestamp,
						message: msgEvent.message
					}
					// console.log(req);
					cb(messageObj);
				});
			});
		} 
		res.send(200);
	}

	sendMessage(payload){
		return new Promise((resolve, reject) => {
			// Create an HTTP POST request
			request({
				uri: 'https://graph.facebook.com/v2.6/me/messages',
				qs: {
					access_token: this.PAGE_ACCESS_TOKEN
				},
				method: 'POST',
				json: payload
			}, (error, response, body) =>{
				if(!error && response.statusCode === 200){
					// resolve({
					// 	messageId: body.message_id
					// });
					resolve();
				}else{
					reject(error);
				}
			});
		});
	}

	// Send a text message
	text(id, text){
		let obj = {
			recipient: {
				id
			},
			message: {
				text
			}
		}
		this.sendMessage(obj)
			.catch(error => console.log(error));
	}

	// Sending Img
	img(id, url){
		let obj = {
			recipient: {
				id
			},
			message: {
				attachment: {
					type: 'image',
					payload: {
						url
					}
				}
			}
		}
		this.sendMessage(obj)
			.catch(error => console.log(error));
	}
}

module.exports = FBeamer;