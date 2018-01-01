angular.module('myApp')
.controller('homeCtrl', ['$scope','$http','$state','localStorageService','$rootScope', function($scope,$http,$state,localStorageService,$rootScope){
	// $scope.msgHome = "Hello Home tab";
	$scope.logData = {};
	$scope.regDet = {};
	$rootScope.isAuth = false;

	$scope.login = function(){
		$http({
			method : 'POST',
			url : api+'log.php',
			data : { action : 'login', data : $scope.logData },
			headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
		}).then(function(res){
			console.log(res.data);
			console.log(res.data.message);

			localStorageService.set('userData', 
			{ 
				token: res.data.token
			});
			$rootScope.isAuth = true;
			// console.log('Yash');
			$state.go('/profile',{});
			// console.log('Chhajer');
			console.log($rootScope.isAuth);
		},function(res){
			localStorageService.remove('userData');
			alert(res.data.message);
		});
	};

	$scope.register = function(){
		var fd = new FormData();
		fd.append('action','register');
		fd.append('profile',$scope.proPic);
		fd.append('fname',$scope.regDet.fname);
		fd.append('lname',$scope.regDet.lname);
		fd.append('mail',$scope.regDet.mail);
		fd.append('age',$scope.regDet.age);
		fd.append('pass',$scope.regDet.pass);
		fd.append('phone',$scope.regDet.phone);
		fd.append('address',$scope.regDet.address);
	
		console.log(fd);

		$http({
			method : 'POST',
			url : api+'log.php',
			data : fd,
			headers : {
				'Content-Type' : undefined	
			}
		}).then(function successCallBack(res){
			console.log(res.data);
			alert(res.data.message);
			$scope.regDet = {};
		},function errorCallBack(res){
			console.log(res.data);
			alert(res.data.message);
		}).finally(function(){

		});
	};

}]);