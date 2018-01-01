var api = 'apis/';

var logApp = angular.module('myApp',[
	'ui.bootstrap',
	'ui.router',
	'oc.lazyLoad',
	'LocalStorageModule'
	]);
// console.log(logApp);

// myApp.config(function ($httpProvider) {
// 	$httpProvider.interceptors.push('authInterceptorService');
// });



logApp.config(function($stateProvider,$urlRouterProvider,$locationProvider,$ocLazyLoadProvider,$httpProvider){
	// $urlRouterProvider.hashPrefix('');
	// $locationProvider.html5Mode(true);
	$httpProvider.interceptors.push('authInterceptorService');

	$urlRouterProvider.otherwise('/home');
	$stateProvider
	.state('/',{
		url : '/home',
		templateUrl: 'views/home.html',
		controller: 'homeCtrl',
		resolve: {
			lazy: ['$ocLazyLoad',function($ocLazyLoad){
				return $ocLazyLoad.load([{
					files: ['cust/js/homeCtrl.js']
				}]);
			}]
		}
	})
	.state('/profile',{
		url : '/Profile',
		templateUrl: 'views/profile.html',
		controller: 'profileCtrl',
		resolve: {
			lazy: ['$ocLazyLoad',function($ocLazyLoad){
				return $ocLazyLoad.load([{
					files: ['cust/js/profCtrl.js']
				}]);
			}]
		}
	})
	.state('/forgot',{
		url : '/Forgot Password',
		templateUrl: 'views/forgot.html',
		controller: 'forgotCtrl',
		resolve: {
			lazy: ['$ocLazyLoad',function($ocLazyLoad){
				return $ocLazyLoad.load([{
					files: ['cust/js/forgotCtrl.js']
				}]);
			}]
		}
	}).state('/changePass',{
		url : '/Change Password',
		templateUrl: 'views/change.html',
		controller: 'changeCtrl',
		resolve: {
			lazy: ['$ocLazyLoad',function($ocLazyLoad){
				return $ocLazyLoad.load([{
					files: ['cust/js/changeCtrl.js']
				}]);
			}]
		}
	});	// .otherwise({
});


//  Directive to upload file
logApp.directive('fileModel', ['$parse', function ($parse) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;

			element.bind('change', function(){
				scope.$apply(function(){
					modelSetter(scope, element[0].files[0]);
				});
			});
		}
	};
}]);

logApp.controller('mCtrl',function($scope,$rootScope,$http,localStorageService,authService,$rootScope,$uibModal,$state) {

	$rootScope.isAuth = true;

	$scope.logout = function(){
		authService.logOut();
	}

	$scope.changePassword = function(){
		$state.go('/changePass',{});
	};
});
