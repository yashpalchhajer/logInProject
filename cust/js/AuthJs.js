'use strict';
// console.log(logApp);
logApp.factory('authService', ['$http', '$q', 'localStorageService','$rootScope', function ($http, $q, localStorageService,$rootScope) {
	
	var authServiceFactory = {};

	var _authentication = {
		isAuth: false,
		userName: ""
	};

	var _saveRegistration = function (registration) {

		_logOut();

		return $http.post(baseUrl + 'api/Account/Register', registration).then(function (response) {
			return response;
		});

	};

	var _login = function (loginData) {
		// console.log(loginData);

		var data = {
			'grant_type': 'password',
			'username' : loginData.userName, 
			'password' : loginData.password
		};

		var deferred = $q.defer();

		$http.post(baseUrl+'users.php',data,
			{	headers:
				{
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			})
		.then(function (response) {
			console.log(response);
			// $rootScope.curSess = response.data.curSess;
			localStorageService.set('authData', 
			{ 
				token: response.data.access_token,
				userName:response.data.userName,
				curSess:response.data.curSess,
				userType:response.data.userType
			});
			
			_authentication.isAuth = true;
			_authentication.userName = loginData.userName;
			deferred.resolve(response);

		},function (err, status) {
			// _logOut();
			deferred.reject(err);
		});

		return deferred.promise;

	};

	var _logOut = function () {

		localStorageService.remove('userData');
		_authentication.isAuth = false;
		_authentication.userName = "";
		window.location = 'index.html';

	};

	var _fillAuthData = function () {

		var authData = localStorageService.get('authData');
		if (authData) {
			_authentication.isAuth = true;
			_authentication.userName = authData.userName;
		}
	}
	
	_fillAuthData();
	authServiceFactory.saveRegistration = _saveRegistration;
	authServiceFactory.login = _login;
	authServiceFactory.logOut = _logOut;
	authServiceFactory.fillAuthData = _fillAuthData;
	authServiceFactory.authentication = _authentication;   
	return authServiceFactory;
}]);

logApp.factory('authInterceptorService', ['$q', '$location','localStorageService','$rootScope', function ($q, $location,localStorageService,$rootScope) {

	var authInterceptorServiceFactory = {};
	
	var _request = function (config) {

		config.headers = config.headers || {};
		var authData = localStorageService.get('userData');
		// console.log(authData);
		if (authData) {
			config.headers.Authorization = 'Bearer,' + authData.token;
			// if($rootScope.uInfo.curSess !== undefined)
			config.headers.curSession = authData.curSess;
			// else
			// config.headers.curSession = $rootScope.uInfo.curSess;
		}else{
			console.log('NOT AUTHORISED');
		}
		// console.log(config);

		return config;
	}

	var _responseError = function (rejection) {

		// if (rejection.status === 401) {
		// 	// window.location = "login.html";
		// 	console.log("Unauthorised");
		// 	alert("Invalid UserName or Password");
		// }
		if(rejection.status === 504){
			alert("Session Timeout login again");
			// authService.logOut();
			$rootScope.uInfo.curSess = undefined;
			window.location = "login.html";
		}
		// return $q.reject(rejection);
		return $q.reject(rejection);
	}


	// var _responseError = function (rejection) {

	// 	if (rejection.status === 401) {
	// 		console.log(rejection.statusText);
	// 		console.log("Unauthorised Access login again");
	// 		// window.location = "login.html?returnUrl=" + window.location;
	// 	}
	// 	return $q.reject(rejection);
	// }   

	authInterceptorServiceFactory.request = _request;
	authInterceptorServiceFactory.responseError = _responseError;

	return authInterceptorServiceFactory;
}]);