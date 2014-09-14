// Get the package we need
var express = require('express')
, morgan = require('morgan')
, mongoose = require('mongoose')
, bodyParser = require('body-parser')
, Sensor = require('./models/sensor')

// Create our Express application
var app = express()
// Use the body-parser package in our application
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({
	extended: true
}))
app.use(bodyParser.json())
app.set('view engine', 'ejs')

// Use environment defined port or 3005
var port = process.env.PORT || 3000

app.get('/', function(req, res) {
	res.render('index', { title: "Homepage" })
})

// Create our Express router
var router = express.Router()

mongoose.connect('mongodb://smurffy:amo5elU5Q3pjOG1KcFkrOVR1czVRaUZ5dVFwdzFOMFdEdWpXb1JiMHJxZz0K@172.17.0.2:27017/smurffy-production')

// Initial dummy router for testing
// http://localhost:3001/api
router.get('/',function(req, res){
	res.json({ message: 'Welcome to Smurffy\'s API !'});
})
var sensorsRouter = router.route('/sensors');
sensorsRouter.post(function(req,res){
	var sensor = new Sensor();

	sensor.deviceID = req.body.deviceID;
	sensor.temp = req.body.temperature;
	sensor.humidity = req.body.humidity;
	sensor.airspeed = req.body.airspeed;
	sensor.current = req.body.current;
	sensor.zipcode = req.body.zipcode;

	sensor.save(function(err){
		if(err)
			res.send(err);

		res.json({ message: 'Data added to the database', data: sensor })
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
console.log('Server is running on port ' + port);
