/**
 * 
 */
angular.module('login.controller', [])

.controller('loginCtrl', function($scope,$state,$window){
	console.log('In loginCtrl');
	$scope.loginData = {};
	$scope.login = function(){
		console.log($scope.loginData);
		var user = $scope.loginData.username;
		var pass = $scope.loginData.password;
		
		if(user=="user@kengen.com"){
			$window.open('index_cust.html','_self');
		}else if(user=="user@bank.com"){
			$window.open('index_bank.html','_self');
		}else{
			$state.go('login');
		}
		$scope.loginData = {};
	}
})