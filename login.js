angular.module('app', ['ngAnimate','cgBusy','starter.services']);

angular.module('app').controller('DemoCtrl',function($scope,$http,Login,$window){

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
			    console.log(response.data);
	            var resp = response.data.result;
	            var type = response.data.usertype;
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
	                    //$window.open('index_admin.html','_self');
	                }
	              // 
	            }
			});

	};


});