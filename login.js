var myapp = angular.module('app', ['ui.router','ngAnimate','cgBusy','starter.services']);

myapp.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise("/login")
	
	$stateProvider
	.state('login', {
		url : "/login",
		templateUrl : "templates/login.html",
		controller : 'loginCtrl'
	}).state('price', {
		url : "/price",
		templateUrl : "templates/price.html",
		controller : 'loginCtrl'
	}).state('signup', {
		url : "/signup/:typeid",
		templateUrl : "templates/signup.html",
		controller : 'signupCtrl'
	}).state('success', {
		url : "/success",
		templateUrl : "templates/success.html",
		controller : 'signupCtrl'
	})
	
});

myapp.controller('signupCtrl', function($scope, $http,$stateParams, $window, $state,ordersService) {
    var typeid = $stateParams.typeid;
    $scope.signup = {};
    $scope.signup.typeid = typeid;
    
    $scope.countries = [];
    
    ordersService.getCountries().then(function(response){
		$scope.countries =response.data;
	});
	
	$scope.success = function(){
		$state.go('success');
	}
})

myapp.controller('loginCtrl',function($scope,$http,Login,$window,ordersService){

	$scope.delay = 0;
	$scope.minDuration = 3000;
	$scope.message = 'Please Wait...';
	$scope.backdrop = true;
	$scope.promise = null;

	$scope.login = function(){
		$scope.msg = "";
		$scope.promise = $http({
			method : 'post',
			url: './assets/login.php',
          	data: $scope.loginData
			}).then(function(response) {
			    //console.log(response.data);
	            var resp = response.data.result;
	            var type = response.data.usertype;
	            var domain = response.data.domain;
	            if(resp=='NO'){
	                $scope.msg = "Wrong Username/Password";
	            }else{
	                Login.setloginname($scope.loginData.username);
	                Login.setdomain(domain);
	                
	                if(type=='Bank'){
	                    window.sessionStorage.setItem('bankuser', Login.getloginname());
	                    window.sessionStorage.setItem('bankdomain', Login.getdomain());
	                    $window.open('index_bank.html','_self'); 
	                }else if(type=='User'){
	                    //console.log('Showing customer page');
	                    window.sessionStorage.setItem('customer', Login.getloginname());
	                    window.sessionStorage.setItem('custdomain', Login.getdomain());
	                    $window.open('index_cust.html','_self');
	                    //console.log(Login.getloginname());
	                }else if(type=='Backoffice'){
	                    $window.open('backoffice.html','_self');
	                }else{
	                    //$window.open('index_admin.html','_self');
	                }
	              // 
	            }
			});
	};
});