
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var Future = require('fibers/future');
var _ = require('underscore');
var exec = require('child_process').exec;
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}



var server = http.createServer(app);
var io = require('socket.io').listen(server); //https://github.com/LearnBoost/Socket.IO/wiki/Configuring-Socket.IO


io.set('log level', 1);


server.listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

app.get('/', routes.index);
app.get('/users', user.list);

io.sockets.on('connection', function (socket) {
	var updates = setInterval(function () {
		socket.emit('statusEvt', { status: fetchStatus() });
	}, 5*1000);
	socket.on('disconnect', function () {
    clearInterval(updates);
  });
	// socket.emit('news', { hello: 'world' });
	socket.on('forceEvt', function (data) {
		var ret = updateZone(data);
		console.log('forceEvt', data, ret);
		// { zone: '0', action: 'On' }
		// { zone: '0', action: 'Off' }
		// { zone: '0', action: 'Thermostat' }
		// updateZone
	});
});
// Somehow we need to persist the times and then act on them later?
// I wonder if setTimeout would be too slow on the rpi

//-----------------------------------------------------------------------------
function updateZone(args) {
	var opts = {
		msg:_buildMessage(args)
	};
	return _i2cset(opts)
}

function _buildMessage(args) {
	args.zone = args.zone - 1; //zones are zero indexed in the i2c link. @todo

	// console.log(args);
	var message = 0;
	if (args.action == "On")
		message |= 1<<4;
	if (args.action == "Off")
		message |= 1<<5;
	// if action == Thermostat then 0

	if (args.zone >= 16)
		return -1

	message |= args.zone;
	return message;
}

function _i2cset(args) {
	var defaults = {
		bus: 1
		,addy: 0x04	//hex
		,msg: 0x00	//hex
	}
	var opts = _.extend({}, defaults, args);

	var fut = new Future();
	if (process.env.NODE_ENV == 'prod')
	{
		child = exec('/usr/sbin/i2cset -y 1 0x04 0x'+opts.msg, //
		function (error, stdout, stderr) {
			if (error !== null) {
				console.log('exec error: ' + error);
			}
			fut['return'](error||0);
		});

		return fut.wait();
	}
	return 0;
}
//-----------------------------------------------------------------------------
function fetchStatus() {
	return _i2cget();
}
function _i2cget(args) {
	var defaults = {
		bus: 1
		,addy: 0x04
	}
	var opts = _.extend({}, defaults, args);

	var fut = new Future();
	if (process.env.NODE_ENV == 'prod')
	{
		child = exec('/usr/sbin/i2cget -y '+opts.bus+' '+opts.addy,
		function (error, stdout, stderr) {
			if (error !== null) {
				console.log('exec error: ' + error);
			}
			fut['return'](stdout||error||0);
		});

		return fut.wait();
	}
	return 0;
}