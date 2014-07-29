var app = angular.module('VLC', [
	'ngStorage'
]);

app.filter('floor', function() {
	return function (n) {
		return Math.floor(n);
	};
});

app.filter('zeropad', function() {
	return function (n, len) {
		var num = parseInt(n, 10);
		len = parseInt(len, 10);
		if (isNaN(num) || isNaN(len)) {
			return n;
		}
		num = '' + num;
		while (num.length < len) {
			num = '0' + num;
		}
		return num;
	};
});

app.controller('VLCController', function($scope, $http, $interval, $localStorage) {
	// constants
	var URI_STATUS = '/requests/status.json';
	var URI_PLAYLIST = '/requests/playlist.json';
	var URI_BROWSE = '/requests/browse.json?dir=';
	
	var CMD_STOP = '?command=pl_stop';
	var CMD_NEXT = '?command=pl_next';
	var CMD_SEEK = '?command=seek&val=';
	var CMD_VOLUME = '?command=volume&val=';
	var CMD_PLAY = '?command=in_play&input=';
	var CMD_PAUSE = '?command=pl_forcepause';
	var CMD_PREVIOUS = '?command=pl_previous';
	var CMD_RESUME = '?command=pl_forceresume';
	var CMD_FULLSCREEN = '?command=fullscreen';

	// defaults
	$scope.status = {
		time: 0,
		length: 0,
		volume: 0,
	};
	$scope.playlist = [];
	$scope.settings = $localStorage.$default({
		port: 8080,
		username: '',
		method: 'jsonp',
	});

	$scope.request = function(path) {
		var url = '';
		var config = {};
		var method = undefined;

		switch ($scope.settings.method) {
			case 'get':
				method = $http.get;
				url = 'http://' + $scope.settings.host + ':' + $scope.settings.port + path;
				config.headers = { 'Authorization': 'Basic ' + btoa($scope.settings.username + ':' + $scope.settings.password) };
				break;

			case 'jsonp':
				method = $http.jsonp;
				url = 'http://' + $scope.settings.username + ':' + $scope.settings.password;
				url += '@' + $scope.settings.host + ':' + $scope.settings.port + path;
				url += ((url.search('\\?') == -1) ? '?' : '&') + 'callback=JSON_CALLBACK';
				break;

			default:
				console.log('Invalid request method.');
				break;
		}

		//console.log(url);
		return method(url, config);
	};

	$scope.request_browse = function(path) {
		path = (typeof path !== 'undefined') ? path : '';

		$scope.request(URI_BROWSE + escape(path)).success(function(data, status, headers, config) {
			//console.log(data);
			$scope.search = '';
			$scope.files = data;
		});
	};

	$scope.request_status = function(parameters) {
		parameters = (typeof parameters !== 'undefined') ? parameters : '';

		return $scope.request(URI_STATUS + parameters);
	};

	$scope.request_playlist = function() {
		$scope.request(URI_PLAYLIST).success(function(data, status, headers, config) {
			//console.log(data);
			$scope.playlist = data;
		});
	};

	$scope.open = function(file) {
		if (file.type == 'dir') {
			$scope.request_browse(file.path);
		} else if (file.type == 'file') {
			$scope.request_status(CMD_PLAY + file.uri).success(function(data, status, headers, config) {
				$scope.request_playlist();
			});
		}
	};

	$scope.seek = function() {
		console.log($scope.status.time);
		$scope.request_status(CMD_SEEK + $scope.status.time);
	};
	
	$scope.volume = function() {
		console.log($scope.status.volume);
		$scope.request_status(CMD_VOLUME + $scope.status.volume);
	};
	
	$scope.togglePlay = function() {
		switch ($scope.status.state) {
			case 'playing':
				$scope.request_status(CMD_PAUSE);
				break;

			case 'paused':
				$scope.request_status(CMD_RESUME);
				break;
		}
	};
	
	$scope.stop = function() {
		$scope.request_status(CMD_STOP);
	};
	
	$scope.next = function() {
		$scope.request_status(CMD_NEXT);
	};
	
	$scope.previous = function() {
		$scope.request_status(CMD_PREVIOUS);
	};
	
	$scope.toggleFullscreen = function() {
		$scope.request_status(CMD_FULLSCREEN);
	};

	// timer
	$interval(function() {
		$scope.request_status().success(function(data, status, headers, config) {
			$scope.status = data;
		});/*.error(function(data, status, headers, config) {
			if (($scope.status.state == 'playing') && ($scope.status.time < $scope.status.length)) {
				$scope.status.time++;
			}
		});*/
	}, 1000);
});
