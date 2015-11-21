var app = angular.module('starter.controllers', ['firebase','ngAnimate','cgBusy']);

app.controller('indexCtrl', function($scope,$stateParams,$firebaseArray,$interval,Data,ordersService){
	var username = sessionStorage.getItem('bankuser');
	$scope.user = sessionStorage.getItem('bankuser');
	console.log("Logged in users >"+username);
	$scope.size = 0;
	$scope.offernotification;
	$scope.declinednotification;
	$scope.acceptedoffersnotification;
	
	$scope.Data = Data;
	$scope.Data.pagetitle = 'Dashboard';	

	ordersService.all_offers('bank1').then(function(d) {
	    $scope.offernotification = d.data.length;
	});
	ordersService.accepted_offers(username).then(function(d){
		console.log('Accepted indicator '+d.data.length);
		$scope.acceptedoffersnotification = d.data.length;
	})
})

app.controller('bankCtrl', function($scope,$stateParams,$firebaseArray,$interval,Notification,Data,ordersService){
	var username = sessionStorage.getItem('bankuser');
	$scope.Data = Data;
	$scope.Data.pagetitle = 'Dashboard';
	
	$interval(reload, 3000);
	
	function reload(){
		ordersService.getallorders(username).then(function(d) {
			console.log(d);
	    $scope.orders = d;
	});
	  console.log('Refresh data on home page');
	}

})

app.controller('indexcustCtrl', function($scope,ordersService,Data,Notification){
	var username = sessionStorage.getItem('customer');
	$scope.user = window.sessionStorage.getItem('customer');
	$scope.size = 0;
	$scope.Data = Data;
	$scope.Data.pagetitle = 'Dashboard';
	
	$scope.confimnotification = 0;
	
	ordersService.to_confirm_offers(1).then(function(d){
		//console.log(d.data);
		$scope.confimnotification = d.data.length;
	})
	
	//var refalerts = new Firebase("https://luminous-heat-9368.firebaseio.com/alertcust");
	//var query = refalerts.orderByChild("seen").equalTo('N');
	  // create a synchronized array
	//$scope.alerts = $firebaseArray(query);
	
	//$scope.alerts.$loaded().then(function(notes) {
		//$scope.size = notes.length;
		//console.log('Notes size is ....'+notes.length); // data is loaded here
	//});
	
	//$scope.alerts.$watch(function(snapshot) {
		//console.log(snapshot);
		//$scope.size = $scope.alerts.length;
		//console.log("New Order Added");
		//Notification.success({message: 'New Offer<br><a href="#/home">Click here to view</a>', title: 'Notification', delay: 20000,positionY:"bottom"});
	//});	
})

app.controller('custCtrl', function($scope,$interval,Data,Notification,ordersService,Login){
	var username = window.sessionStorage.getItem('customer');
	$scope.user = window.sessionStorage.getItem('customer');
	$scope.orderdetails = [];
	$scope.offertitle = '';
	
	$scope.Data = Data;
	$scope.Data.pagetitle = 'Dashboard';
//var ref = new Firebase("https://luminous-heat-9368.firebaseio.com/messages");
	
//	$scope.xcustorders = $firebaseArray(ref);
//	$scope.xcustorders.$loaded().then(function(data){
		//console.log(data);
//	});
	
	$scope.viewoffers = function(orderid){
		var x = orderid;
		ordersService.offer(x).then(function(d) {
		  	console.log(d.data);
		    $scope.orderdetails = d.data;
		    $scope.offertitle = 'for order ID: '+d.data[0].orderidfk;
		});
	};

	$interval(reload, 2000);
	
	function reload(){
		ordersService.async(username).then(function(d) {
		//console.log(d)
	    $scope.custorders = d;
	    //console.log('custCtrl .. logged in as ..' +Login.getloginname());
	  });	
	}
	
	$scope.withdrawOrder =function(){
		alert('Function not yet operational');
	}
	
})

app.controller('newofferCtrl', function($scope,$state,$stateParams,$firebaseObject,Data,$http,ordersService,$filter){
	var username = window.sessionStorage.getItem('bankuser');
	var orderid = $stateParams.indexid;
	var indexid = $stateParams.indexid;
	$scope.Data = Data;
	$scope.Data.pagetitle = 'New Offer';
	$scope.newoffer = {};
	//$scope.newoffer = $firebaseObject(ref);
	//$scope.alertcust = $firebaseArray(alertlist);
	
	
	ordersService.order(indexid).then(function(d) {
	    $scope.newoffer = d.data[0];
	    //$scope.newoffer.orderindex = d.data[0].orderid;
	    $scope.newoffer.orderindex = d.data[0].orderindex;
	    $scope.newoffer.orderidfk = d.data[0].orderid;
	    $scope.newoffer.offeredby = username;
	    $scope.newoffer.reqamount = 0;
	    $scope.newoffer.buysell = d.data[0].buysell;
	    $scope.newoffer.buyorderamount = d.data[0].buyorderamount;
	    $scope.newoffer.sellorderamount = d.data[0].sellorderamount;
	    if($scope.newoffer.buysell == 'BUY' && $scope.newoffer.buyorderamount > 0){
	    	$scope.holder = 3;
	    	$scope.newoffer.ccysettleamount = $filter('limitTo')($scope.newoffer.ccypair,-3);
	    }else if($scope.newoffer.buysell == 'SELL' && $scope.newoffer.sellorderamount > 0){
	    	$scope.holder = 3;
	    	$scope.newoffer.ccysettleamount = $filter('limitTo')($scope.newoffer.ccypair,-3);
	    }else{
	    	$scope.holder = -3;
	    	$scope.newoffer.ccysettleamount = $filter('limitTo')($scope.newoffer.ccypair,3);
	    }
	}); 
	
	$scope.fill = function(){
		//console.log($scope.newoffer.buysellbank);
		//console.log($scope.newoffer.sellorderamount);
		if($scope.newoffer.buysellbank == 'BUY'){
			$scope.newoffer.offeredrate = parseFloat($scope.newoffer.spotrate) - parseFloat($scope.newoffer.magin/100);
		}else{
			$scope.newoffer.offeredrate = parseFloat($scope.newoffer.spotrate) + parseFloat($scope.newoffer.magin/100);
		}
		
		
		if($scope.newoffer.buysell == 'BUY' && $scope.newoffer.buyorderamount > 0){
			//console.log('multiply');
			$scope.newoffer.settleamount = ($scope.newoffer.orderamount*$scope.newoffer.offeredrate);
			//console.log($scope.newoffer.ccysettleamount);
		}else if($scope.newoffer.buysell == 'SELL' && $scope.newoffer.sellorderamount > 0){
			$scope.newoffer.settleamount = ($scope.newoffer.orderamount*$scope.newoffer.offeredrate);
		}else{
			//console.log('division');
			$scope.newoffer.settleamount = ($scope.newoffer.orderamount/$scope.newoffer.offeredrate);
			//console.log($scope.newoffer.ccysettleamount);
		}
	};

	$scope.newOffer =function(){
		$scope.newoffer.offeredby = username;
		
				$http({
		              method: 'get',
		              url: './rest/new_offer.php',
		              headers: {'Content-Type': 'application/json'},
		              params:{orderindex:$scope.newoffer.orderindex,orderidfk:$scope.newoffer.orderid,spotrate:$scope.newoffer.spotrate,magin:$scope.newoffer.magin,offeredrate:$scope.newoffer.offeredrate,
		              		settlementdate:$scope.newoffer.settlementdate,offeredby:$scope.newoffer.offeredby,reqamount:$scope.newoffer.reqamount,settleamount:$scope.newoffer.settleamount,
		              		comment:$scope.newoffer.comment,ccysettleamount:$scope.newoffer.ccysettleamount}
		            }).success(function (data) {
		              alert("Offer Submitted");
		              $scope.newoffer = {};
					  $state.go('home');
		            }).error(function (error) {
		                alert("Error when making an offer");
		                $scope.newoffer = {};
						$state.go('home');
		            });	
		
		ordersService.updateorder(indexid).then(function(d){
			//console.log(d);
		})
		            
		var note_orderid = $scope.newoffer.orderidfk;
		var owner = 'bank1';
		var comment = 'New offer: Amount ';
					
		ordersService.addnote(note_orderid,owner,comment).then(function(d){
			//console.log(d);
		})
	}
})

app.controller('profileCtrl', function($scope){
	
})

app.controller('offeracceptCtrl', function($scope,$state,$stateParams,$firebaseArray,$firebaseObject,$http,ordersService){
	var orderid = $stateParams.orderidfk;
	var offerid = $stateParams.offerid;
	

	$scope.acceptoffer = [];
	
	ordersService.offerdetails(offerid).then(function(d) {
	    $scope.acceptoffer = d.data[0];
	});
	
	//var refaccepts = new Firebase("https://luminous-heat-9368.firebaseio.com/messages/"+orderid+"/offers/"+offerid);
	//$scope.acceptoffer = $firebaseObject(refaccepts);
	
	//var refaccepted = new Firebase("https://luminous-heat-9368.firebaseio.com/messages/acceptedoffers");
	//$scope.accepted = $firebaseArray(refaccepted);
	
	$scope.accept = function(){
		var note_orderid = $scope.acceptoffer.orderidfk;
		var owner = 'customer1';
		var comment = 'Offer Accepted ';
					
		//ordersService.addnote(note_orderid,owner,comment).then(function(d){
			//console.log(d);
		//})
		
		$http({
		    method: 'GET',
		    url: './rest/accept_offer.php',
		    headers: {'Content-Type': 'application/json'},
		    params : {orderid:$scope.acceptoffer.orderidfk,offerid:offerid}
		    }).success(function (data) {
		      alert('Offer '+offerid+' Accepted');
			  $state.go('home');
		    }).error(function (error) {
		       alert("Error when accepting offer");
			   $state.go('home');
		    });
	}
	
	$scope.x_accept = function(){
		$scope.accepted.$add({
			orderid:orderid,
			offerid:offerid,
			settlementamount:$scope.acceptoffer.settleamount,
			offeredby:$scope.acceptoffer.offeredby,
			offeredrate: $scope.acceptoffer.offeredrate,
			status: 'Book Deal'
	    });
		alert('Offer '+offerid+' Accepted');
		$state.go('home');
	}
})

app.controller('custconfirmationsCtrl', function($scope,$firebaseArray,ordersService){
	$scope.toconfirmoffers = [];
	ordersService.to_confirm_offers(1).then(function(d){
		//console.log(d.data);
		$scope.toconfirmoffers = d.data;
	})
	
})

app.controller('acceptsdetailsCtrl', function($scope,$state,$stateParams,$firebaseArray,$firebaseObject){
	var offerid = $stateParams.offerid;
	$scope.acceptedOfferdetails = {};
	//var ref = new Firebase("https://luminous-heat-9368.firebaseio.com/messages/acceptedoffers");
	//$scope.acceptedOfferdetails = $firebaseObject(ref.child(offerid));
	
	$scope.confirmOffer = function(){
		//console.log('Offer confirmed by customer');
		$scope.acceptedOfferdetails.$loaded().then(function(data){
			$scope.acceptedOfferdetails.status = "Customer Confirmation Received";
			$scope.acceptedOfferdetails.$save();
		});
		alert('Offer Successfully confirmed');
		$state.go('accepts');
	}
	
})

app.controller('offersCtrl', function($scope,ordersService){
	var username = window.sessionStorage.getItem('bankuser');
	console.log(username);
	$scope.offers=[];
	ordersService.all_offers(username).then(function(d) {
		console.log(d.data);
	    $scope.offers = d.data;
	});
	
})

app.controller('editofferCtrl',function($scope,$stateParams,$http,$window,$state,ordersService){
	$scope.editoffer = [];
	var id = $stateParams.offerid;
	$scope.offerid = $stateParams.offerid;
	ordersService.offerdetails(id).then(function(d) {
	    $scope.editoffer = d.data[0];
	});
	
	$scope.editOffer = function(){
		if ($window.confirm("This will ammend Offer. Do you want to Proceed?")) {
               console.log("You clicked YES.");
               		$http({
		              method: 'POST',
		              url: '/rest/edit_offer.php',
		              headers: {'Content-Type': 'application/json'},
		              data : $scope.editoffer
		            }).success(function (data) {
		            	console.log(data);
		              alert("Offer ammended");
					  $state.go('offers');
		            }).error(function () {
		                alert("Error when ammending Offer");
						$state.go('offers');
		            });
		            
            } else {
               console.log("You clicked NO.");
            }
	};
	
	$scope.deleteOffer = function(){
			if ($window.confirm("This will withdraw Offer. Do you want to Proceed?")) {
               console.log("You clicked YES.");
               		$http({
		              method: 'POST',
		              url: '/rest/delete_offer.php',
		              headers: {'Content-Type': 'application/json'},
		              data : {id:$scope.offerid}
		            }).success(function (data) {
		            	//console.log(data);
		              alert("Offer Withdrawn "+$scope.offerid);
					  $state.go('offers');
		            }).error(function () {
		                alert("Error withdrawing Offer");
						$state.go('offers');
		            });
		            
            } else {
               console.log("You clicked NO.");
            }
	};
	
	$scope.fill = function(){
		$scope.editoffer.offeredrate = ($scope.editoffer.spotrate|0) + ($scope.editoffer.magin)/100|0;
		$scope.editoffer.settleamount = ($scope.editoffer.orderamount*$scope.editoffer.offeredrate);
	};
})

app.controller('paymentCtrl', function($scope,$state,$stateParams,$firebaseArray,$firebaseObject){
	
	
})

app.controller('approvedCtrl', function($scope,$state,$stateParams,$firebaseArray,$firebaseObject){
	$scope.confirmed = {};
	var ref = new Firebase("https://luminous-heat-9368.firebaseio.com/messages/acceptedoffers");
	var query = ref.orderByChild("status").equalTo('Customer Confirmation Received');//Awaiting Customer Confirmation
	$scope.confirmed = $firebaseArray(query);
	
})

app.controller('acceptedoffersCtrl', function($scope,$firebaseArray,ordersService){
	$scope.offers = [];
	$scope.buyoffers = [];
	var username = window.sessionStorage.getItem('bankuser');
	//var ref = new Firebase("https://luminous-heat-9368.firebaseio.com/messages/acceptedoffers");
	//var query = ref.orderByChild("status").equalTo('Awaiting Customer Confirmation');
	//$scope.offers= $firebaseArray(query);
	ordersService.accepted_offers(username).then(function(d){
		//console.log(d.data);
		$scope.offers = d.data;
	})
	ordersService.accepted_buy_offers(username).then(function(d){
		//console.log(d.data);
		$scope.buyoffers = d.data;
	})
})

app.controller('offerdetailsCtrl', function($scope,$state,$stateParams,$firebaseObject,$firebaseArray){
	//var ref = new Firebase("https://luminous-heat-9368.firebaseio.com/messages/acceptedoffers");
	
	var orderid = $stateParams.orderid;
	var id = $stateParams.offerid;
	
	$scope.custconfirm = function(){
		//console.log(id);
		$scope.acceptedofferid = $firebaseObject(ref.child(id));
		
		$scope.acceptedofferid.$loaded().then(function() {
			$scope.acceptedofferid.status = "Awaiting Customer Confirmation";
			$scope.acceptedofferid.$save();
		});
		
		alert('Deal Booked '+orderid);
		//console.log('alert customer to confirm order');
		$state.go('acceptedoffers');
	}
	
})

app.controller('neworderCtrl', function($state,$scope,$http,Data,ordersService){
	var username = window.sessionStorage.getItem('customer');
	console.log(username);
	$scope.neworder = {};
	$scope.ccytitle = {};
	$scope.banks = [];
	
	$scope.Data = Data;
	$scope.Data.pagetitle = 'New FXSPOT Order';
	
	ordersService.getbanks().then(function(d){
		//console.log(d.data);
		$scope.banks = d.data;
	})
	
	
	$scope.saveOrder = function(){
		//console.log($scope.neworder);
		var i = $scope.neworder.recipient.length;
		for(x=0; x<=i-1;x++){
			$scope.orders.$add({
				owner:'KENGEN',
		    	orderamount:$scope.neworder.orderamount,
		    	recipient: $scope.neworder.recipient[x],
		    	buysell:$scope.neworder.buysell,
		    	ccypair: $scope.neworder.ccypair,
		    	settledate:$scope.neworder.settledate,
		    	comment:$scope.neworder.comment
		    });
			
			$scope.alerts.$add({
				recipient:$scope.neworder.recipient[x],
				message:'New Order '+$scope.neworder.orderamount,
				createdAt:Firebase.ServerValue.TIMESTAMP,
				link:'home',
				seen:'N',
				from:'KENGEN'
			});
		}
		
		alert('Order Saved');
		$scope.neworder = {};
		$state.go('home');
	};

	$scope.save_c9_Order = function(){
		$scope.promise = $http.get('./rest/connect.php');
		var i = $scope.neworder.bank.length;
		//console.log(i);
		var d = new Date();
		var n = d.getTime();

				for(x=0; x<=i-1;x++){
					var rescp = $scope.neworder.bank[x];
					var inbuysell = $scope.neworder.buysell;
					
					//console.log(rescp);
					
					$scope.neworder.orderid = n;
					$scope.neworder.usernamefk = username;
					$scope.neworder.recipient = rescp;
					$scope.neworder.ordertypefk = 'FXSPOT';
					$scope.neworder.buysellbank = '';
					
					if(inbuysell=='SELL'){
						$scope.neworder.buysellbank = "BUY";
					}else{
						$scope.neworder.buysellbank = "SELL";
					}
					
					var note_orderid = n;
					var owner = username;
					var comment = 'New order: Amount ';
					
					//ordersService.addcustorder($scope.neworder.orderid,$scope.neworder.usernamefk,$scope.neworder.ccypair,$scope.neworder.buyorderamount,$scope.neworder.sellorderamount,
					//$scope.neworder.buysell,$scope.neworder.buysellbank,rescp,$scope.neworder.settlementdate,$scope.neworder.custcomment,$scope.neworder.ordertypefk)
					//		.then(function(){})
				
					
					$http({
		              method: 'GET',
		              url: './rest/add_order.php',
		              headers: {'Content-Type': 'application/json'},
		              params:{orderid:$scope.neworder.orderid,usernamefk:$scope.neworder.usernamefk,ccypair:$scope.neworder.ccypair,buyorderamount:$scope.neworder.buyorderamount,
		              		sellorderamount:$scope.neworder.sellorderamount,buysell:$scope.neworder.buysell,buysellbank:$scope.neworder.buysellbank,recipient:rescp,settlementdate:$scope.neworder.settlementdate,
		              		custcomment:$scope.neworder.custcomment,ordertypefk:$scope.neworder.ordertypefk}
      				}).success(function (data) {
		              //console.log(data);
		              //alert("New Order Submitted ");
		              //$scope.neworder = {};
		              //$state.go('home');
					  //
					  /*ordersService.addnote(note_orderid,owner,comment).then(function(d){
						alert('Order submitted plus note saved');
						$scope.neworder = {}
						$state.go('home');
					})*/
		            }).error(function () {
		                alert("Error making new order");
		                $scope.neworder = {};
						$state.go('home');
		            });	
				}
		alert("New Order(s) Submitted Successfully");
		$state.go('home');
	}
	
				$scope.num = 3;
				$scope.s_buy = false;
				$scope.s_sell = false;
				
				$scope.$watch("neworder.buysell", function (newval) {
	               if(newval == 'BUY'){
	               		$scope.num = 3;
						
	               }else{
	               		$scope.num = -3;
						
	               };
	            }, true);
	            
				$scope.$watch("neworder.ccypair", function (newval) {
	               $scope.ccytitle = newval;
	            }, true);
	            
	            $scope.setfunct = function(){
	            	if($scope.neworder.buyorderamount !== ""){
	            		$scope.neworder.sellorderamount = '';
	            	}
	            }
	            
	            $scope.setfunct2 = function(){
	            	if($scope.neworder.sellorderamount !== ""){
	            		$scope.neworder.buyorderamount = '';
	            	}
					
	            }
	               
});

app.controller('bookdealCtrl',function($scope,$http,$state,$stateParams,ordersService){
	$scope.booking = {};
	var offerid = $stateParams.offerid;
	
	ordersService.offerdetails(offerid).then(function(d){
		$scope.booking = d.data[0];
		if($scope.booking.buysellbank == 'SELL'){
			$scope.booking.rec = "PAY";
			$scope.booking.pay = "REC";
		}else if($scope.booking.buysellbank == 'BUY'){
			$scope.booking.rec = "PAY";
			$scope.booking.pay = "REC";
		}else{
			$scope.booking.rec = "REC";
			$scope.booking.pay = "PAY";
		}
		
	})
	
	$scope.custconfirm = function(){
		//update offers - confirm and confirmdate column
					$http({
		              method: 'POST',
		              url: '/rest/confirm_offer.php',
		              headers: {'Content-Type': 'application/json'},
		              data : {id: offerid}
		            }).success(function (data) {
		              alert("Deal Successfully Booked");
					  $state.go('acceptedoffers');
		            }).error(function (error) {
		                alert("Error booking a deal");
						$state.go('acceptedoffers');
		            });
		            
		var note_orderid = $scope.booking.orderidfk;
		var owner = 'bank1';
		var comment = 'Deal Booked ';
		            
		ordersService.addnote(note_orderid,owner,comment).then(function(){})
	}
	
});

app.controller('confirmofferCtrl', function($scope, $stateParams,$http,$state, ordersService) {
    var offerid = $stateParams.offerid;
    $scope.reject = {};
    $scope.showAccept = false;
    $scope.showReject = false;
    
    ordersService.offerdetails(offerid).then(function(d){
		$scope.booking = d.data[0];
		if($scope.booking.buysellbank == 'SELL'){
			$scope.booking.rec = "PAY";
			$scope.booking.pay = "REC";
		}else{
			$scope.booking.rec = "REC";
			$scope.booking.pay = "PAY";
		}
	})
	
	$scope.accept = function(){
		//accept booked deal
		$http({
		   method: 'POST',
		   url: './rest/accept_deal.php',
		   headers: {'Content-Type': 'application/json'},
		   data : {id:offerid}
		}).success(function (data) {
		    alert("Deal Accepted");
			$state.go('custconfirmations');
		}).error(function (error) {
		    alert("Error accepting deal");
			$state.go('custconfirmations');
		});	
		
		var note_orderid = $scope.booking.orderidfk;
		var owner = 'customer1';
		var comment = 'Offer Confimed - Accept';
		            
		ordersService.addnote(note_orderid,owner,comment).then(function(){})
	}
	
	$scope.reject = function(){
		//reject booked deal
		$http({
		    method: 'POST',
		    url: './rest/reject_deal.php',
		    headers: {'Content-Type': 'application/json'},
		    data : {id:offerid,reason:$scope.reject.rejectreason}
		 }).success(function (data) {
		    alert("Deal Rejected Submitted");
			$state.go('custconfirmations');
		 }).error(function (error) {
		    alert("Error rejecting deal");
			$state.go('custconfirmations');
		});	
		
		var note_orderid = $scope.booking.orderidfk;
		var owner = 'customer1';
		var comment = 'Offer Confimed - Declined';
		            
		ordersService.addnote(note_orderid,owner,comment).then(function(){})
	}
	
				$scope.$watch("booking.confirm", function (newval) {
	               if(newval=="Reject"){
	                    $scope.showAccept = false;
    					$scope.showReject = true;
	                 }else{
	              	 	$scope.showAccept = true;
    					$scope.showReject = false;
	                 }
	               }, true);
})

/****
*Back Office Controllers
*START
*/

app.controller('dealsconfirmedCtrl',function($scope, $stateParams, ordersService) {
    
})

app.controller('rejectedCtrl',function($scope, $stateParams, ordersService) {
    
})

app.controller('paymentsCtrl',function($scope, $stateParams, ordersService) {
    
})

app.controller('settlementCtrl',function($scope, $stateParams, ordersService) {
    var offerid = $stateParams.offerid;
    $scope.confirmedoffers = [];
    $scope.notehis = [];
    $scope.settlement ={};
    $scope.cancelfrm = {};
    
    $scope.showCancelfrm = false;
    $scope.showAcceptfrm = false;
    
    ordersService.confirmed_offers().then(function(d){
    	$scope.confirmedoffers = d.data
    })
    
    
    $scope.viewdeal = function(orderid){
    	notes(orderid);
    	console.log('VIew history');
    }
    
    function notes(orderid){
    	ordersService.notes(orderid).then(function(d){
    		console.log(d.data);
    		$scope.notehis = d.data
    	})
    }
    
    			$scope.$watch("settlement.confirm", function (newval) {
	               if(newval=="Done"){
	                    $scope.showCancelfrm = false;
    					$scope.showAcceptfrm = true;
	                 }else{
	              	 	$scope.showCancelfrm = true;
    					$scope.showAcceptfrm = false;
	                 }
	               }, true);
    
    $scope.pay = function(){
    	alert('Payment Done')
    }
    
    $scope.cancel = function(){
    	alert('Deal Cancelled');
    }
})

app.controller('backofficeCtrl',function($scope, ordersService) {
	$scope.confirmedoffers = [];
    ordersService.confirmed_offers().then(function(d){
    	//console.log(d.data);
    	$scope.confirmedoffers = d.data
    })
})

app.controller('operationsCtrl',function($scope, $state,ordersService) {
    
})