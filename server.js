// Get the package we need
var express = require('express')
, mongoose = require('mongoose')
, bodyParser = require('body-parser')
, Sensor = require('./models/sensor')

// Create our Express application
var app = express();
// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json())
// Use environment defined port or 3005
var port = process.env.PORT || 3005;

// Create our Express router
var router = express.Router();

mongoose.connect('mongodb://localhost:27017/testdb')

// Initial dummy router for testing
// http://localhost:3001/api
router.get('/',function(req, res){
	res.json({ message: ' first message responded !'});
});
var sensorsRouter = router.route('/sensors');
sensorsRouter.post(function(req,res){
	var sensor = new Sensor();

	sensor.deviceID = req.body.deviceID;
	sensor.temp = req.body.temp;
	sensor.humidity = req.body.humidity;
	sensor.airspeed = req.body.airspeed;
	sensor.current = req.body.current;
	sensor.zipcode = req.body.zipcode;

	sensor.save(function(err){
		if(err)
			res.send(err);
		res.json({message: ' Sensor added to the database', data: sensor})
	});
});
sensorsRouter.get(function(req, res){
	Sensor.find(function(err, sensors){
		if(err)
			res.send(err)
		res.json(sensors)
	})
});
var sensorRouter = router.route('/sensors/:sensor_id');
sensorRouter.get(function(req, res){
	Sensor.findById(req.params.sensor_id,function(err,sensor){
		if(err)
			res.send(err);
		res.json(sensor);
	});
});
// Register all our routes with /api
app.use('/api', router);

// Start the server
app.listen(port);
console.log('Connecting to port' + port);
