angular.module('myApp').controller('profileCtrl', ['$scope','$http','$rootScope','localStorageService','$state', function($scope,$http,$rootScope,localStorageService,$state){
	// console.log($rootScope.isAuth);
	$scope.user = {};
	if(localStorageService.get('userData'))
	{
		// $rootScope.isAuth = true;
		// console.log(localStorageService.get('userData'));
	}	
	getUser();


	function getUser()
	{
		$http({
			method : 'POST',
			url : api+'log.php',
			data : { 'action' : 'profile' }
		}).then(function(res){
		// console.log(res.data);
		var d = res.data.message;
		console.log(d);
		$scope.user.no = d[0]['u_No'];
		$scope.user.fname = d[0]['f_Name'];
		$scope.user.lname  = d[0]['l_Name'];
		$scope.user.mail  = d[0]['e_Mail'];
		$scope.user.age  = d[0]['age'];
		$scope.user.phone  = d[0]['phone'];
		$scope.user.address  = d[0]['address'];
		$scope.user.profile = d[0]['profile_Pic'];


	},function(res){
		console.log(res.data);
		alert(res.data.message);
		$state.go('/home',{});
	}).finally(function(){

	});
};

	$scope.updateUser = function(){
		var fd = new FormData();
		fd.append('action','updateUser');
		fd.append('profile',$scope.proPic);
		fd.append('fname',$scope.user.fname);
		fd.append('lname',$scope.user.lname);
		fd.append('mail',$scope.user.mail);
		fd.append('age',$scope.user.age);
		fd.append('phone',$scope.user.phone);
		fd.append('address',$scope.user.address);
		fd.append('pro',$scope.user.profile);
		fd.append('no',$scope.user.no);	
		// console.log(fd);

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
			getUser();
			// $scope.regDet = {};
		},function errorCallBack(res){
			console.log(res.data);
			alert(res.data.message);
		}).finally(function(){

		});
	};
}]);