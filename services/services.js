var app = angular.module('starter.services', []);

app.factory('ordersService', function($http) {
  var myService = {
    async: function(username) {
      // $http returns a promise, which has a then function, which also returns a promise
      var promise = $http({
          method: 'get',
          url : './rest/get_all_orders.php',
          headers: {'Content-Type': 'application/json'},
          params:{username:username}
      }).then(function (response) {
        return response.data;
      });
      // Return the promise to the controller
      return promise;
    },
    getallorders: function(bankid) {
      // $http returns a promise, which has a then function, which also returns a promise
      var promise = $http({
          method : 'GET',
          url : './rest/get_bank_orders.php',
          headers: {'Content-Type': 'application/json'},
          params:{bankid:bankid}
      }).then(function (response) {
        return response.data;
      });
      // Return the promise to the controller
      return promise;
    },
    order: function(indexid) {
      var promise = $http({
      		method:'GET',
      		url:'./rest/get_an_order.php',
      		headers: {'Content-Type': 'application/json'},
      		params:{id:indexid}
      }).success(function (response) {
      			//console.log(response);
        		return response;
      		}).error(function(error){
      			console.log("Error: "+error);
      		});
      return promise;
    },
    all_offers: function(username) {
      var promise = $http({
      		method:'GET',
      		url:'./rest/all_offers.php',
      		headers: {'Content-Type': 'application/json'},
      		params:	 {id:username}
      }).success(function (response) {
      		//console.log(response);
        	return response;
      }).error(function(error){
      		alert("Error: "+ error);
      });
      return promise;
    },
    accepted_offers: function(username) {
      var promise = $http({
      		method:'GET',
      		url:'./rest/accepted_offers.php',
      		headers: {'Content-Type': 'application/json'},
      		params:	 {id:username}
      }).success(function (response) {
      		//console.log(response);
        	return response;
      }).error(function(error){
      		alert("Error: "+ error);
      });
      return promise;
    },
    accepted_buy_offers: function(username) {
      var promise = $http({
      		method:'GET',
      		url:'./rest/accepted_buy_offers.php',
      		headers: {'Content-Type': 'application/json'},
      		params:	 {id:username}
      }).success(function (response) {
      		//console.log(response);
        	return response;
      }).error(function(error){
      		alert("Error: "+ error);
      });
      return promise;
    },
    to_confirm_offers: function(x) {
      var promise = $http({
      		method:'GET',
      		url:'./rest/to_confirm_offers.php',
      		headers: {'Content-Type': 'application/json'},
      		params:	 {id:x}
      }).success(function (response) {
      		//console.log(response);
        	return response;
      }).error(function(error){
      		alert("Error: "+ error);
      });
      return promise;
    },
    confirmed_offers: function(x) {
      var promise = $http({
      		method:'GET',
      		url:'./rest/confirmed_offers.php',
      		headers: {'Content-Type': 'application/json'},
      		params:	 {id:x}
      }).success(function (response) {
      		console.log(response);
        	return response;
      }).error(function(error){
      		alert("Error: "+ error);
      });
      return promise;
    },
    offer: function(x) {
      var promise = $http({
      		method:'GET',
      		url:'./rest/get_offer.php',
      		headers: {'Content-Type': 'application/json'},
      		params:{id:x}
      }).success(function (response) {
      			//console.log(response);
        		return response;
      }).error(function(error){
      			console.log("Error: "+error);
      });
      return promise;
    },
    offerdetails: function(x) {
      var promise = $http({
      		method:'GET',
      		url:'./rest/get_an_offer.php',
      		headers: {'Content-Type': 'application/json'},
      		params:{id:x}
      }).success(function (response) {
      			//console.log(response);
        		return response;
      		}).error(function(error){
      			console.log("Error: "+error);
      		});
      return promise;
    },
    notes: function(x) {
      var promise = $http({
      		method:'GET',
      		url:'./rest/order_notes.php',
      		headers: {'Content-Type': 'application/json'},
      		params:{id:x}
      }).success(function (response) {
      			//console.log(response);
        		return response;
      		}).error(function(error){
      			console.log("Error: "+error);
      		});
      return promise;
    },
    getbanks: function() {
      var promise = $http({
      		method:'GET',
      		url:'./rest/get_banks.php',
      		headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
      			//console.log(response);
        		return response;
      		}).error(function(error){
      			console.log("Error: "+error);
      		});
      return promise;
    },
    addnote: function(orderid,owner,comment) {
      var promise = $http({
      		method:'GET',
      		url:'./rest/add_note.php',
      		headers: {'Content-Type': 'application/json'},
      		params:{orderid:orderid,owner:owner,comment:comment}
      }).success(function (response) {
      			//console.log(response);
        		return response;
      		}).error(function(error){
      			console.log("Error: "+error);
      		});
      return promise;
    },
    updateorder: function(orderindex) {
      var promise = $http({
      		method:'GET',
      		url:'./rest/updateorder.php',
      		headers: {'Content-Type': 'application/json'},
      		params:{orderindex:orderindex}
      }).success(function (response) {
      			//console.log(response);
        		return response;
      		}).error(function(error){
      			console.log("Error: "+error);
      		});
      return promise;
    },
    addcustorder: function(orderid,usernamefk,ccypair,buyorderamount,sellorderamount,buysell,buysellbank,recipient,settlementdate,custcomment,ordertypefk) {
      var promise = $http({
      		method:'POST',
      		url:'./rest/add_order.php',
      		headers: {'Content-Type': 'application/json'},
      		data:{orderid:orderid,usernamefk:usernamefk,ccypair:ccypair,buyorderamount:buyorderamount,sellorderamount:sellorderamount,buysell:buysell,buysellbank:buysellbank,recipient:recipient,settlementdate:settlementdate,custcomment:custcomment,ordertypefk:ordertypefk}
      }).success(function (response) {
      			//console.log(response);
        		return response;
      		}).error(function(error){
      			console.log("Error: "+error);
      		});
      return promise;
    }
  };
  return myService;
});

app.factory("Projects", function($firebaseArray,$http) {
    //var ref = new Firebase("https://luminous-heat-9368.firebaseio.com").child('messages');
    //return $firebaseArray(ref);
     return $http.get('/assets/get_all_orders.php').success(function(data){
        	console.log(data);
     });
});

app.factory('Data', function () {

    var data = {
        pagetitle: ''
    };

    return {
        getFirstName: function () {
            return data.pagetitle;
        },
        setFirstName: function (pagetitle) {
            data.pagetitle = pagetitle;
        }
    };
});

app.factory('Login', function () {

    var data = {
        loginname: ''
    };

    return {
        getloginname: function () {
            return data.loginname;
        },
        setloginname: function (loginname) {
            data.loginname = loginname;
        }
    };
});