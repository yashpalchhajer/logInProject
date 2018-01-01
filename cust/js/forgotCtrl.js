angular.module('myApp').controller('forgotCtrl', ['$scope','$http','$rootScope','authService','localStorageService', function($scope,$http,$rootScope,authService,localStorageService){
	$scope.umail = '';
	

	$scope.forPass = function(){
		$http({
			method : 'POST',
			url : api+'log.php',
			data :  {'action' : 'forgot','data' : $scope.umail}
		}).then(function(res){
			console.log(res.data.message);
			alert(res.data.message);
		},function(res){
			alert(res.data.message);
		}).finally(function(){

		});
	};

}]);