const patternDict = [{
	pattern: '\\b(?<greeting>Hi|Hello|Hey)\\b',
	intent: 'Hello'
}, {
	pattern: '\\b(Bye|exit)\\b',
	intent: 'Exit'
}, {
	pattern: 'like\\sin\\s\\b(?<city>.+)',
	intent: 'CurrentWeather'
}, {
	pattern: '\\bweather\\s?\\bin\\b(?<city>.+)',
	intent: 'CurrentWeather'
}, {
	pattern: '\\b(?<weather>hot|cold|rain|rainy|sunny|snow|thunderstorms|windy|drizzle)\\b\\sin\\s\\b(?<city>[a-z]+[ a-z]+?)\\b(?<time>day\\safter\\stomorrow|tomorrow|today)$',
	intent: 'WeatherForecast'
}, {
	pattern: '\\b(?<weather>hot|cold|rain|rainy|sunny|snow|thunderstorms|windy|drizzle)\\b\\s\\b(?<time>day\\safter\\stomorrow|tomorrow|today)\\sin\\s\\b(?<city>[a-z]+[ a-z]+?)$',
	intent: 'WeatherForecast'
}, {
	pattern: '\\bsend\\s?\\bimage\\b',
	intent: 'Image'
}];

module.exports = patternDict;
