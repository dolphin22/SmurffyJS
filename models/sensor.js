// Load required packages
var mongoose = require('mongoose');

// Define our sensor schema
var SensorSchema = new mongoose.Schema({
	deviceID: String,
	datetime: {type: Date, default: Date.now},
	temp: Number,
	humidity: Number,
	airspeed: Number,
	current: Number,
	zipcode: Number
});

// Export the Mongoose model
module.exports = mongoose.model('Sensor',SensorSchema);