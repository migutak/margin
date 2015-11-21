//
var app = angular.module('myApp',['starter.services']);

app.controller("loginCtrl", function($scope,$http,$window,Login){
    $scope.loginData = {};
    $scope.message = "";
    //console.log('LoginCtrl controller');
    
    $scope.delay = 10;
	$scope.minDuration = 0;
	$scope.message = 'Please Wait...';
	$scope.backdrop = true;
	$scope.promise = null;
	
	$scope.demo = function(){

		$scope.promise = $http.get('./rest/connect.php');

	};
    
    $scope.login = function(){
        //console.log($scope.loginData);
        $http({
          method: 'POST',
          url: './assets/login.php',
          data: $scope.loginData
        }).success(function(data) {
            //console.log(data);
            var resp = data.result;
            var type = data.usertype;
            if(resp=='NO'){
                $scope.msg = "Wrong Username/Password";
            }else{
                Login.setloginname($scope.loginData.username);
                //console.log("Logged in users >"+Login.getloginname());
                if(type=='Bank'){
                    //console.log('Showing bank page');
                    //window.localStorage.setItem('bankuser', Login.getloginname());
                    window.sessionStorage.setItem('bankuser', Login.getloginname());
                    $window.open('index_bank.html','_self'); 
                }else if(type=='User'){
                    //console.log('Showing customer page');
                    window.sessionStorage.setItem('customer', Login.getloginname());
                    $window.open('index_cust.html','_self');
                    //console.log(Login.getloginname());
                }else if(type=='Backoffice'){
                    $window.open('index_boffice.html','_self');
                }else{
                    $window.open('index_admin.html','_self');
                }
              // 
            }
        }).error(function(error){
            console.log('Error log');
        });
    }
})