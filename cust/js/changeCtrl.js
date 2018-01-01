angular.module('myApp').controller('changeCtrl', ['$scope','$http','authService','localStorageService', function($scope,$http,authService,localStorageService){
	$scope.upass = {};
		var authData = localStorageService.get('userData');
		// alert(authData);
		if (!authData) {
			authService.logOut();
		}

	$scope.change = function(){
		$http({
			method : 'POST',
			url : api+'log.php',
			data : {'action' : 'change', 'data' : $scope.upass},
			headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
		}).then(function(res){
			console.log(res.data);
			alert(res.data.message);
			authService.logOut();
		},function(res){
			alert(res.data.message);
		}).finally(function(){

		});
	};
}])