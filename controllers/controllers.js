var app = angular.module('starter.controllers', ['ngAnimate','cgBusy','firebase']);

//timesago filter
app.filter('timeago', function(){
	return function(input, p_allowFuture) {
            var substitute = function (stringOrFunction, number, strings) {
                    var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, dateDifference) : stringOrFunction;
                    var value = (strings.numbers && strings.numbers[number]) || number;
                    return string.replace(/%d/i, value);
                },
                nowTime = (new Date()).getTime(),
                date = (new Date(input)).getTime(),
                //refreshMillis= 6e4, //A minute
                allowFuture = p_allowFuture || false,
                strings= {
                    prefixAgo: null,
                    prefixFromNow: null,
                    suffixAgo: "ago",
                    suffixFromNow: "from now",
                    seconds: "less than a minute",
                    minute: "about a minute",
                    minutes: "%d Minutes",
                    hour: "about an hour",
                    hours: "about %d hours",
                    day: "a day",
                    days: "%d Days",
                    month: "about a month",
                    months: "%d Months",
                    year: "about a year",
                    years: "%d years"
                },
                dateDifference = nowTime - date,
                words,
                seconds = Math.abs(dateDifference) / 1000,
                minutes = seconds / 60,
                hours = minutes / 60,
                days = hours / 24,
                years = days / 365,
                separator = strings.wordSeparator === undefined ?  " " : strings.wordSeparator,
            
                // var strings = this.settings.strings;
                prefix = strings.prefixAgo,
                suffix = strings.suffixAgo;
                
            if (allowFuture) {
                if (dateDifference < 0) {
                    prefix = strings.prefixFromNow;
                    suffix = strings.suffixFromNow;
                }
            }

            words = seconds < 45 && substitute(strings.seconds, Math.round(seconds), strings) ||
            seconds < 90 && substitute(strings.minute, 1, strings) ||
            minutes < 45 && substitute(strings.minutes, Math.round(minutes), strings) ||
            minutes < 90 && substitute(strings.hour, 1, strings) ||
            hours < 24 && substitute(strings.hours, Math.round(hours), strings) ||
            hours < 42 && substitute(strings.day, 1, strings) ||
            days < 30 && substitute(strings.days, Math.round(days), strings) ||
            days < 45 && substitute(strings.month, 1, strings) ||
            days < 365 && substitute(strings.months, Math.round(days / 30), strings) ||
            years < 1.5 && substitute(strings.year, 1, strings) ||
            substitute(strings.years, Math.round(years), strings);

            return $.trim([prefix, words, suffix].join(separator));
            // conditional based on optional argument
            // if (somethingElse) {
            //     out = out.toUpperCase();
            // }
            // return out;
        }
})

app.directive('cloading', function () {
      return {
        restrict: 'C',
        replace:true,
        template: '<div class="loading"><img src="images/ajax-loader.gif" width="40" height="40" />Please Wait, Processing...</div>',
        link: function (scope, element, attr) {
              scope.$watch('loading', function (val) {
                  if (val)
                      $(element).show();
                  else
                      $(element).hide();
              });
        }
      }
  })

app.controller('indexCtrl', function($scope,$stateParams,$interval,Data,ordersService){
	var username = sessionStorage.getItem('bankuser');
	$scope.user = sessionStorage.getItem('bankuser');
	console.log("Logged in users >"+username);
	$scope.size = 0;
	$scope.offernotification;
	$scope.declinednotification;
	$scope.acceptedoffersnotification;
	
	$scope.Data = Data;
	$scope.Data.pagetitle = 'Dashboard';	

	ordersService.all_offers(username).then(function(d) {
	    $scope.offernotification = d.data.length;
	});
	
	ordersService.accepted_offers(username).then(function(d){
		//console.log('Accepted indicator '+d.data.length);
		$scope.acceptedoffersnotification = d.data.length;
	})
	
	$interval(reload_offernotification, 1000);
	$interval(reload_acceptedoffersnotification, 1000);
	
	function reload_offernotification(){
		ordersService.all_offers(username).then(function(d) {
		    $scope.offernotification = d.data.length;
		});
	  console.log('Refresh reload_offernotification');
	}
	
	function reload_acceptedoffersnotification(){
		ordersService.accepted_offers(username).then(function(d){
			$scope.acceptedoffersnotification = d.data.length;
		})
	  console.log('Refresh reload_acceptedoffersnotification');
	}
})

app.controller('bankCtrl', function($scope,$stateParams,$interval,$firebaseArray,Notification,Data,ordersService){
	var username = sessionStorage.getItem('bankuser');
	var ref = new Firebase("https://luminous-heat-9368.firebaseio.com/margin/Moneymarketorders");
    $scope.mmorders = $firebaseArray(ref);
    
    ref.on("value", function(snapshot) {
	  // This isn't going to show up in the DOM immediately, because
	  // Angular does not know we have changed this in memory.
	  // $scope.data = snapshot.val();
	  // To fix this, we can use $scope.$apply() to notify Angular that a change occurred.
	  $scope.$apply(function() {
	    //$scope.data = snapshot.val();
	    $scope.mmorders = $firebaseArray(ref);
	  });
	});
    
	$scope.Data = Data;
	$scope.orders = [];
	$scope.orders_swap = [];
	$scope.orders_mm = [];
	$scope.swapnotification = 0;
	$scope.spotnotification = 0;
	$scope.forwardnotification = 0;
	
	$scope.mmorders.$loaded().then(function(notes) {
	   $scope.mmnotification = notes.length;
	});
	
	$scope.Data.pagetitle = 'Dashboard';
	$scope.loading = true;
	$interval(reload_orders, 3000);
	$interval(reload_orders_swap, 3000);
	//$interval(reload_orders_mm, 3000);
	reload_orders_mm();
	
	function reload_orders(){
		ordersService.getallorders(username).then(function(d) {
	    	$scope.orders = d;
	    	$scope.spotnotification = d.length;
		});
		
		$scope.loading = false;
	  //console.log('refresh reload_orders');
	}
	
	function reload_orders_swap(){
		ordersService.getallorders_swap(username).then(function(d) {
			console.log(d);
	    	$scope.orders_swap = d;
	    	$scope.swapnotification = d.length;
		});
		
		$scope.loading = false;
	  //console.log('Refresh reload_orders_swap');
	}
	
	function reload_orders_mm(){
		ordersService.getallorders_mm(username).then(function(d) {
	    	$scope.orders_mm = d;
	    	//$scope.mmnotification = d.length;
		});
		$scope.loading = false;
	  //console.log('Refresh reload_orders_swap');
	}

})

app.controller('indexcustCtrl', function($scope,$interval,ordersService,Data,Notification){
	var username = sessionStorage.getItem('customer');
	$scope.user = window.sessionStorage.getItem('customer');
	
	$scope.size = 0;
	$scope.Data = Data;
	$scope.Data.pagetitle = 'Dashboard';
	
	$scope.confimnotification = 0;
	$scope.paymentsnotification = 0;
	
	ordersService.to_confirm_offers(1).then(function(d){
		$scope.confimnotification = d.data.length;
	})
	
	ordersService.payments_confirm(1).then(function(d){
		//console.log('no of payments '+d.data.length);
		$scope.paymentsnotification = d.data.length;
	})
	
	$interval(reload_paymentsnotification, 5000);
	$interval(reload_confimnotification, 5000);
	
	function reload_paymentsnotification(){
		ordersService.payments_confirm(1).then(function(d) {
		$scope.paymentsnotification = d.data.length;
		console.log('paymentsnotification refreshed');
	  });	
	}
	
	function reload_confimnotification(){
		ordersService.to_confirm_offers(1).then(function(d) {
		$scope.confimnotification = d.data.length;
		console.log('confimnotification refreshed');
	  });	
	}
})

app.controller('custCtrl', function($scope,$interval,Data,Notification,ordersService,Login){
	$scope.loading = true;
  
	var username = window.sessionStorage.getItem('customer');
	$scope.user = window.sessionStorage.getItem('customer');
	
	$scope.timestamp = '2012-09-06 22:21:15';
    $scope.loadtime = (new Date()).getTime();
    $scope.fiddletime = '2015-12-08 10:21:15';
    
	$scope.orderdetails = [];
	$scope.custorders = [];
	$scope.custorders_swap = [];
	$scope.custorders_mm = [];
	$scope.offertitle = '';
	
	
	$scope.Data = Data;
	$scope.Data.pagetitle = 'Home';
	
	reload_custorders();
	reload_custorders_mm();
	
	$scope.viewoffers = function(orderid){
		var x = orderid;
		ordersService.offer(x).then(function(d) {
		  	//console.log(d.data);
		    $scope.orderdetails = d.data;
		    $scope.offertitle = 'for Deal Number: '+d.data[0].orderidfk;
		});
	};
	
	$scope.viewswapoffers = function(orderid){
		console.log('Details of swap offer loading');
		var x = orderid;
		ordersService.offer_s_swap(x).then(function(d) {
		  	//console.log(d.data);
		    $scope.orderdetails = d.data;
		    $scope.offertitle = 'for Deal Number: '+d.data[0].orderidfk;
		});
	};
	
	$scope.viewmmoffers = function(orderid){
		console.log('Details of mm offer loading');
		$scope.loading = true;
		var x = orderid;
		ordersService.offer_s_mm(x).then(function(d) {
			console.log(d);
		    $scope.orderdetails = d.data;
		    $scope.offertitle = 'for Deal Number: ' + d.data[0].orderidfk;
		});
	};
	
	//Receive Offer Notification broadcast
	console.log('About to receive broadcast');
	$scope.$on('offernotification', function (event, args) {
		console.log('Broadcast received');
	 	$scope.custorders.offernotification = args.message;
	 });

	$interval(reload_custorders, 5000);
	$interval(reload_custorders_swap, 5000);
	
	function reload_custorders(){
		//$scope.loading = true;
		ordersService.async(username).then(function(d) {
	    $scope.custorders = d;
	    $scope.loading = false;
	    console.log($scope.custorders);
	  });	
	}
	
	function reload_custorders_swap(){
		ordersService.swap_orders(username).then(function(d) {
	    	$scope.custorders_swap = d;
	  	});	
	}
	
	function reload_custorders_mm(){
		ordersService.mm_orders(username).then(function(d) {
	    $scope.custorders_mm = d;
	  });	
	}
	
	$scope.withdrawOrder =function(){
		alert('Function not yet operational');
	}
	
})

app.controller('newswapofferCtrl', function($scope,$state,$stateParams,Data,$http,ordersService,$filter){
	var username = window.sessionStorage.getItem('bankuser');
	var orderid = $stateParams.indexid;
	var indexid = $stateParams.indexid;
	$scope.Data = Data;
	$scope.Data.pagetitle = 'New Swap Offer';
	$scope.newswapoffer = {};
	$scope.holder = 0;
	
	ordersService.swaporder(indexid).then(function(d) {
		//console.log(d.data[0]);
		$scope.newswapoffer = d.data[0];
		
		$scope.newswapoffer.orderindex = d.data[0].orderindex;
	    $scope.newswapoffer.orderidfk = d.data[0].orderid;
	    $scope.newswapoffer.offeredby = username;
	    $scope.newswapoffer.buysell = d.data[0].buysell;
	    $scope.newswapoffer.neardate = d.data[0].neardate;
	    $scope.newswapoffer.fardate = d.data[0].fardate;
	    $scope.newswapoffer.nearmagin = 0;
	    if($scope.newswapoffer.buysellbank == 'BUY'){
	    	$scope.holder = 3;
	    	$scope.newswapoffer.buysellbank_disp = 'BUY(leg 1) - SELL(leg 2)';
	    	$scope.newswapoffer.nearbuyorderamountccy_disp = $scope.newswapoffer.nearsellorderamountccy;
	    	$scope.newswapoffer.nearsellorderamountccy_disp = $scope.newswapoffer.nearbuyorderamountccy;
	    	$scope.newswapoffer.nearbuyorderamount_disp = $scope.newswapoffer.nearsellorderamount;
	    	$scope.newswapoffer.nearsellorderamount_disp = $scope.newswapoffer.nearbuyorderamount;
	    	//far leg
	    	$scope.newswapoffer.farbuyorderamountccy_disp = $scope.newswapoffer.farsellorderamountccy;
	    	$scope.newswapoffer.farsellorderamountccy_disp = $scope.newswapoffer.farbuyorderamountccy;
	    	$scope.newswapoffer.farbuyorderamount_disp = $scope.newswapoffer.farsellorderamount;
	    	$scope.newswapoffer.farsellorderamount_disp = $scope.newswapoffer.farbuyorderamount;
	    	
	    }else{
	    	$scope.holder = -3;
	    	$scope.newswapoffer.buysellbank_disp = 'SELL(leg 1) - BUY(leg 2)';
	    	$scope.newswapoffer.nearbuyorderamountccy_disp = $scope.newswapoffer.nearsellorderamountccy;
	    	$scope.newswapoffer.nearsellorderamountccy_disp = $scope.newswapoffer.nearbuyorderamountccy;
	    	$scope.newswapoffer.nearbuyorderamount_disp = $scope.newswapoffer.nearsellorderamount;
	    	$scope.newswapoffer.nearsellorderamount_disp = $scope.newswapoffer.nearbuyorderamount;
	    	//far leg
	    	$scope.newswapoffer.farbuyorderamountccy_disp = $scope.newswapoffer.farsellorderamountccy;
	    	$scope.newswapoffer.farsellorderamountccy_disp = $scope.newswapoffer.farbuyorderamountccy;
	    	$scope.newswapoffer.farbuyorderamount_disp = $scope.newswapoffer.farsellorderamount;
	    	$scope.newswapoffer.farsellorderamount_disp = $scope.newswapoffer.farbuyorderamount;
	    }
	    $scope.newswapoffer.nearlegamount1 = $filter('limitTo')(d.data[0].ccypair,$scope.holder)+d.data[0].orderamount;
	    $scope.newswapoffer.farlegamount1 = $filter('limitTo')(d.data[0].ccypair,$scope.holder)+d.data[0].orderamount;
	    
	    	$scope.newswapoffer.nearlegamount_1ccy = $filter('limitTo')(d.data[0].ccypair,$scope.holder);
			$scope.newswapoffer.nearlegamount_1 = d.data[0].orderamount;
			$scope.newswapoffer.farlegamount_1ccy = $filter('limitTo')(d.data[0].ccypair,$scope.holder);
			$scope.newswapoffer.farlegamount_1 = d.data[0].orderamount;
	})
	
	$scope.fill = function(){
		if($scope.newswapoffer.buysellbank == 'BUY' && $scope.newswapoffer.nearsellorderamount>0){
			$scope.newswapoffer.nearofferedrate = parseFloat($scope.newswapoffer.nearspotrate) - parseFloat($scope.newswapoffer.nearmagin/10000);
			$scope.newswapoffer.nearsellorderamount_disp = $filter('number')(($scope.newswapoffer.nearsellorderamount*$scope.newswapoffer.nearofferedrate),2);
		}else if($scope.newswapoffer.buysellbank == 'BUY' && $scope.newswapoffer.nearbuyorderamount>0){
			$scope.newswapoffer.nearofferedrate = parseFloat($scope.newswapoffer.nearspotrate) - parseFloat($scope.newswapoffer.nearmagin/10000);
			$scope.newswapoffer.nearbuyorderamount_disp = $filter('number')(($scope.newswapoffer.nearbuyorderamount/$scope.newswapoffer.nearofferedrate),2);
		}else if($scope.newswapoffer.buysellbank == 'SELL' && $scope.newswapoffer.nearsellorderamount>0){
			$scope.newswapoffer.nearofferedrate = parseFloat($scope.newswapoffer.nearspotrate) + parseFloat($scope.newswapoffer.nearmagin/10000);
			$scope.newswapoffer.nearsellorderamount_disp = $filter('number')(($scope.newswapoffer.nearsellorderamount/$scope.newswapoffer.nearofferedrate),2);
		}else if($scope.newswapoffer.buysellbank == 'SELL' && $scope.newswapoffer.nearbuyorderamount>0){
			$scope.newswapoffer.nearofferedrate = parseFloat($scope.newswapoffer.nearspotrate) + parseFloat($scope.newswapoffer.nearmagin/10000);
			$scope.newswapoffer.nearbuyorderamount_disp = $filter('number')(($scope.newswapoffer.nearbuyorderamount*$scope.newswapoffer.nearofferedrate),2);
		}
	}
	
	$scope.fill_far = function(){
		if($scope.newswapoffer.buysellbank == 'BUY' && $scope.newswapoffer.nearsellorderamount>0){
			$scope.newswapoffer.farofferedrate = parseFloat($scope.newswapoffer.farspotrate) + parseFloat($scope.newswapoffer.farmagin/10000);
			$scope.newswapoffer.farbuyorderamount_disp = $filter('number')(($scope.newswapoffer.farbuyorderamount*$scope.newswapoffer.farofferedrate),2);
		}else if($scope.newswapoffer.buysellbank == 'BUY' && $scope.newswapoffer.nearbuyorderamount>0){
			$scope.newswapoffer.farofferedrate = parseFloat($scope.newswapoffer.farspotrate) + parseFloat($scope.newswapoffer.farmagin/10000);
			$scope.newswapoffer.farsellorderamount_disp = $filter('number')(($scope.newswapoffer.farsellorderamount/$scope.newswapoffer.farofferedrate),2);
		}else if($scope.newswapoffer.buysellbank == 'SELL' && $scope.newswapoffer.nearsellorderamount>0){
			$scope.newswapoffer.farofferedrate = parseFloat($scope.newswapoffer.nearspotrate) - parseFloat($scope.newswapoffer.nearmagin/10000);
			$scope.newswapoffer.farbuyorderamount_disp = $filter('number')(($scope.newswapoffer.nearsellorderamount/$scope.newswapoffer.farofferedrate),2);
		}else if($scope.newswapoffer.buysellbank == 'SELL' && $scope.newswapoffer.nearbuyorderamount>0){
			$scope.newswapoffer.farofferedrate = parseFloat($scope.newswapoffer.farspotrate) - parseFloat($scope.newswapoffer.farmagin/10000);
			$scope.newswapoffer.farsellorderamount_disp = $filter('number')(($scope.newswapoffer.farsellorderamount*$scope.newswapoffer.farofferedrate),2);
		}
	}
		
	$scope.newswapOffer =function(){
		$scope.newswapoffer.offeredby = username;
				$http({
		              method: 'get',
		              url: './rest/new_swap_offer.php',
		              headers: {'Content-Type': 'application/json'},
		              params:{orderindex:$scope.newswapoffer.orderindex,orderidfk:$scope.newswapoffer.orderid,nearspotrate:$scope.newswapoffer.nearspotrate,nearmargin:$scope.newswapoffer.nearmagin,nearfinal:$scope.newswapoffer.nearofferedrate,
		              		nearbuyorderamountccy:$scope.newswapoffer.nearbuyorderamountccy_disp,nearbuyorderamount:$scope.newswapoffer.nearbuyorderamount_disp,nearsellorderamountccy:$scope.newswapoffer.nearsellorderamountccy_disp,nearsellorderamount:$scope.newswapoffer.nearsellorderamount_disp,
		              		neardate:$scope.newswapoffer.neardate,farspot:$scope.newswapoffer.farspotrate,farmargin:$scope.newswapoffer.farmagin,farfinal:$scope.newswapoffer.farofferedrate
		              	,farbuyorderamountccy:$scope.newswapoffer.farbuyorderamountccy_disp,farbuyorderamount:$scope.newswapoffer.farbuyorderamount_disp,farsellorderamountccy:$scope.newswapoffer.farsellorderamountccy_disp,farsellorderamount:$scope.newswapoffer.farsellorderamount_disp
		              	,fardate:$scope.newswapoffer.fardate,comment:$scope.newswapoffer.bankcomment,offeredby:$scope.newswapoffer.offeredby
		              }
		            }).success(function (data) {
		              alert("FxSwap Offer Submitted");
		              $scope.newswapoffer = {};
					  $state.go('homeswap');
		            }).error(function (error) {
		                alert("Error when making Fxswap offer");
		                console.log('Error when making Fxswap offer')
		                $scope.newswapoffer = {};
						$state.go('homeswap');
		            });	
	}
       
})

app.controller('newofferCtrl', function($scope,$state,$stateParams,$rootScope,Data,$http,ordersService,$filter){
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
	    	$scope.newoffer.buy_sell1 = "Sell";
	    	$scope.newoffer.buy_sell = "Buy";
	    	$scope.newoffer.ccysettleamount = $filter('limitTo')($scope.newoffer.ccypair,-3);
	    }else if($scope.newoffer.buysell == 'BUY' && $scope.newoffer.sellorderamount > 0){
	    	$scope.holder = -3;
	    	$scope.newoffer.buy_sell1 = "Buy";
	    	$scope.newoffer.buy_sell = "Sell";
	    	$scope.newoffer.ccysettleamount = $filter('limitTo')($scope.newoffer.ccypair,-3);
	    }else if($scope.newoffer.buysell == 'SELL' && $scope.newoffer.sellorderamount > 0){
	    	$scope.holder = 3;
	    	$scope.newoffer.buy_sell1 = "Buy";
	    	$scope.newoffer.buy_sell = "Sell";
	    	$scope.newoffer.ccysettleamount = $filter('limitTo')($scope.newoffer.ccypair,-3);
	    }else if($scope.newoffer.buysell == 'SELL' && $scope.newoffer.buyorderamount > 0){
	    	$scope.holder = -3;
	    	$scope.newoffer.buy_sell1 = "Sell";
	    	$scope.newoffer.buy_sell = "Buy";
	    	$scope.newoffer.ccysettleamount = $filter('limitTo')($scope.newoffer.ccypair,-3);
	    }else{
	    	$scope.holder = -3;
	    	$scope.newoffer.buy_sell1 = "Buy";
	    	$scope.newoffer.buy_sell = "Sell";
	    	$scope.newoffer.ccysettleamount = $filter('limitTo')($scope.newoffer.ccypair,3);
	    }
	}); 
	
	$scope.fill = function(){
		//console.log($scope.newoffer.buysellbank);
		//console.log($scope.newoffer.sellorderamount);
		if($scope.newoffer.buysellbank == 'BUY'){
			$scope.newoffer.offeredrate = $filter('number')(parseFloat($scope.newoffer.spotrate) - parseFloat($scope.newoffer.magin/100),2);
		}else{
			$scope.newoffer.offeredrate = parseFloat($scope.newoffer.spotrate) + parseFloat($scope.newoffer.magin/100);
		}
		
		
		if($scope.newoffer.buysell == 'BUY' && $scope.newoffer.buyorderamount > 0){
			//console.log('multiply');
			$scope.newoffer.settleamount = ($scope.newoffer.orderamount*$scope.newoffer.offeredrate);
			console.log($scope.newoffer.ccysettleamount);
		}else if($scope.newoffer.buysell == 'BUY' && $scope.newoffer.sellorderamount > 0){
			$scope.newoffer.settleamount = ($scope.newoffer.orderamount/$scope.newoffer.offeredrate);
			$scope.newoffer.ccysettleamount = $filter('limitTo')($scope.newoffer.ccypair,3);
			//console.log('Currency In: '+$scope.newoffer.ccysettleamount);
		}else if($scope.newoffer.buysell == 'SELL' && $scope.newoffer.sellorderamount > 0){
			$scope.newoffer.settleamount = ($scope.newoffer.orderamount*$scope.newoffer.offeredrate);
			console.log($scope.newoffer.ccysettleamount);
			//
		}else if($scope.newoffer.buysell == 'SELL' && $scope.newoffer.buyorderamount > 0){
			$scope.newoffer.settleamount = $filter('number')(($scope.newoffer.orderamount/$scope.newoffer.offeredrate),2);
			$scope.newoffer.ccysettleamount = $filter('limitTo')($scope.newoffer.ccypair,3);
			console.log('Testing settleamount ... with '+$scope.newoffer.offeredrate);
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
		
		//Broadcast Notification
		//$rootScope.$broadcast('s_offerNotification', { message: 'NaN' });
	}
	
		$scope.handleClick = function (msg) {
	        $scope.$broadcast('s_offerNotification', { message: 'NaN' });
	        console.log('Broadcast');
	    };
})

app.controller('newmmofferCtrl', function($scope, $stateParams, $filter,$state,$http,$timeout, Data, ordersService) {
	var username = window.sessionStorage.getItem('bankuser');
	var orderid = $stateParams.indexid;
	var indexid = $stateParams.indexid;
	$scope.Data = Data;
	$scope.Data.pagetitle = 'New MM Offer';
    $scope.newmmoffer = [];
    $scope.intdays = 365;
    
    
    
    
    ordersService.mmorder(indexid).then(function(d) {
	    $scope.newmmoffer = d.data[0];
	    $scope.newmmoffer.orderindex = d.data[0].orderindex;
	    $scope.newmmoffer.orderidfk = d.data[0].orderid;
	    $scope.newmmoffer.dealtype = d.data[0].mmtypebank;
	    $scope.Data.pagetitle = 'New '+d.data[0].mmtypebank+' Offer';
	    //for interest rate currency days
	    ordersService.get_a_currency(d.data[0].ccy).then(function(d) {
	    	//console.log('CCy int days is '+d.data[0].intdays);
	    	$scope.intdays = d.data[0].intdays;
	    })
    })
    
    $scope.fill = function(){
    	$scope.newmmoffer.totalinterest = $filter('number')($scope.newmmoffer.orderamount * ($scope.newmmoffer.rate/100) * $scope.newmmoffer.tenuredays/$scope.intdays,2);
    	$scope.newmmoffer.totalinterest2 = $scope.newmmoffer.orderamount * ($scope.newmmoffer.rate/100) * $scope.newmmoffer.tenuredays/$scope.intdays;
    	$scope.newmmoffer.tax = $filter('number')(($scope.newmmoffer.orderamount * ($scope.newmmoffer.rate/100) * $scope.newmmoffer.tenuredays/$scope.intdays) * 0.15,2);
    	$scope.newmmoffer.tax2 = ($scope.newmmoffer.orderamount * ($scope.newmmoffer.rate/100) * $scope.newmmoffer.tenuredays/$scope.intdays) * 0.15;
    	$scope.newmmoffer.netinterest = $filter('number')(($scope.newmmoffer.orderamount * ($scope.newmmoffer.rate/100) * $scope.newmmoffer.tenuredays/$scope.intdays) - ($scope.newmmoffer.orderamount * ($scope.newmmoffer.rate/100) * $scope.newmmoffer.tenuredays/$scope.intdays) * 0.15,2);
    }
    
    $scope.newmmOffer = function(){
    	$scope.loading = true;
				$http({
		              method: 'get',
		              url: './rest/new_mm_offer.php',
		              headers: {'Content-Type': 'application/json'},
		              params:{orderindex:$scope.newmmoffer.orderindex,orderidfk:$scope.newmmoffer.orderidfk,fixedrate:$scope.newmmoffer.rate,orderamount:$scope.newmmoffer.orderamount,daycount:$scope.newmmoffer.tenuredays,
		              		totalinterest:$scope.newmmoffer.totalinterest2,tax:$scope.newmmoffer.tax2,netinterest:$scope.newmmoffer.netinterest,
		              		bankcomment:$scope.newmmoffer.bankcomment,offeredby:username}
		            }).success(function (data) {
		            	$timeout(function(){
		            		$scope.loading = false;
		            		alert("Offer Submitted");
		              		$scope.newmmoffer = {};
					  		$state.go('homemm');
		            	},300,true)
		              
		            }).error(function (error) {
		                alert("Error when making an offer");
		                $scope.newmmoffer = {};
						$state.go('homemm');
		            });	
		
		ordersService.updateordermm(indexid).then(function(d){
			//console.log(d);
		})
    }
})

app.controller('profileCtrl', function($scope){
	$scope.message = 0;
	$scope.$on('s_offerNotification', function (event, args) {
         $scope.message = args.message;
         console.log($scope.message);
         //$scope.$apply(function(args){
         	
         //})
     });
})

app.controller('offeracceptmmCtrl', function($scope, $stateParams, $http, $state, Data,ordersService) {
	$scope.Data.pagetitle = 'Accept MM Offer';
    var orderid = $stateParams.orderidfk;
	var offerid = $stateParams.offerid;
	
	$scope.acceptoffermm = [];
	
	ordersService.offerdetails_mm(offerid).then(function(d) {
	    $scope.acceptoffermm = d.data[0];
	})
	
	$scope.accept = function(){
		$http({
		    method: 'GET',
		    url: './rest/accept_mm_offer.php',
		    headers: {'Content-Type': 'application/json'},
		    params : {orderid:$scope.acceptoffermm.orderidfk,offerid:offerid}
		    }).success(function (data) {
		      alert('Offer '+offerid+' Accepted');
			  $state.go('homemoneymarket');
		    }).error(function (error) {
		       alert("Error when accepting mm offer");
			   $state.go('homemoneymarket');
		    });
	}
})

app.controller('offeracceptswapCtrl', function($scope, $stateParams, $http,$state, ordersService) {
    var orderid = $stateParams.orderidfk;
	var offerid = $stateParams.offerid;
	
	$scope.acceptofferswap = [];
	
	ordersService.offerdetails_swap(offerid).then(function(d) {
	    $scope.acceptofferswap = d.data[0];
	    //seems both login are the same and working kindly check ???????
	    if($scope.acceptofferswap.buysell=="BUY" && $scope.acceptofferswap.nearsellorderamount>0){
	    	$scope.acceptofferswap.buysell_disp='BUY - SELL';
	    	$scope.acceptofferswap.nearsellorderamountccy_disp = $scope.acceptofferswap.nearbuyorderamountccy;
	    	$scope.acceptofferswap.farbuyorderamountccy_disp = $scope.acceptofferswap.farsellorderamountccy;
	    	$scope.acceptofferswap.nearsellorderamount_disp = $scope.acceptofferswap.nearbuyorderamount;
	    	$scope.acceptofferswap.farbuyorderamount_disp = $scope.acceptofferswap.farsellorderamount;
	    	
	    	$scope.acceptofferswap.nearbuyorderamountccy_disp = $scope.acceptofferswap.nearsellorderamountccy;
	    	$scope.acceptofferswap.farsellorderamountccy_disp = $scope.acceptofferswap.farbuyorderamountccy;
	    	$scope.acceptofferswap.nearbuyorderamount_disp = $scope.acceptofferswap.nearsellorderamount;
	    	$scope.acceptofferswap.farsellorderamount_disp = $scope.acceptofferswap.farbuyorderamount;
	    	
	    }else if($scope.acceptofferswap.buysell=="SELL" && $scope.acceptofferswap.nearbuyorderamount>0){
	    	$scope.acceptofferswap.buysell_disp='SELL - BUY';
	    	
	    	$scope.acceptofferswap.nearsellorderamountccy_disp = $scope.acceptofferswap.nearbuyorderamountccy;
	    	$scope.acceptofferswap.farbuyorderamountccy_disp = $scope.acceptofferswap.farsellorderamountccy;
	    	$scope.acceptofferswap.nearsellorderamount_disp = $scope.acceptofferswap.nearbuyorderamount;
	    	$scope.acceptofferswap.farbuyorderamount_disp = $scope.acceptofferswap.farsellorderamount;
	    	
	    	$scope.acceptofferswap.nearbuyorderamountccy_disp = $scope.acceptofferswap.nearsellorderamountccy;
	    	$scope.acceptofferswap.farsellorderamountccy_disp = $scope.acceptofferswap.farbuyorderamountccy;
	    	$scope.acceptofferswap.nearbuyorderamount_disp = $scope.acceptofferswap.nearsellorderamount;
	    	$scope.acceptofferswap.farsellorderamount_disp = $scope.acceptofferswap.farbuyorderamount;
	    }
	    
	});
	
	$scope.accept = function(){
		$http({
		    method: 'GET',
		    url: './rest/accept_swap_offer.php',
		    headers: {'Content-Type': 'application/json'},
		    params : {orderid:$scope.acceptofferswap.orderidfk,offerid:offerid}
		    }).success(function (data) {
		      alert('Offer '+offerid+' Accepted');
			  $state.go('homeswap');
		    }).error(function (error) {
		       alert("Error when accepting offer");
			   $state.go('homeswap');
		    });
	}
})

app.controller('offeracceptCtrl', function($scope,$state,$stateParams,$http,ordersService){
	var orderid = $stateParams.orderidfk;
	var offerid = $stateParams.offerid;
	
	$scope.acceptofferswap = [];
	$scope.acceptoffer = [];
	$scope.acceptoffer.limit_num = 0;
	
	ordersService.offerdetails(offerid).then(function(d) {
	    $scope.acceptoffer = d.data[0];
	    console.log($scope.acceptoffer);
	    if($scope.acceptoffer.buysell == "BUY" && $scope.acceptoffer.buyorderamount>0){
	    	$scope.acceptoffer.limit_num = 3;
	    	$scope.acceptoffer._buysell ="Buy";
	    	$scope.acceptoffer._buysell2 ="Sell";
	    }else if($scope.acceptoffer.buysell == "BUY" && $scope.acceptoffer.sellorderamount>0){
	    	$scope.acceptoffer.limit_num = -3;
	    	$scope.acceptoffer._buysell ="Sell";
	    	$scope.acceptoffer._buysell2 ="Buy";
	    }else if($scope.acceptoffer.buysell == "SELL" && $scope.acceptoffer.buyorderamount>0){
	    	$scope.acceptoffer.limit_num = -3;
	    	$scope.acceptoffer._buysell ="Buy"
	    	$scope.acceptoffer._buysell2 ="Sell";
	    }else if($scope.acceptoffer.buysell == "SELL" && $scope.acceptoffer.sellorderamount>0){
	    	$scope.acceptoffer.limit_num = 3;
	    	$scope.acceptoffer._buysell ="Sell"
	    	$scope.acceptoffer._buysell2 ="Buy";
	    }
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

app.controller('custconfirmationsCtrl', function($scope,ordersService){
	$scope.toconfirmoffers = [];
	$scope.Data.pagetitle = 'FxSpot Confirmations';
	ordersService.to_confirm_offers(1).then(function(d){
		//console.log(d.data);
		$scope.toconfirmoffers = d.data;
	})
	
})

app.controller('custconfirmations_swapCtrl', function($scope,ordersService){
	$scope.toconfirmoffers = [];
	$scope.Data.pagetitle = 'Swap Confirmations';
	$scope.swapnotification = 0;
	ordersService.to_confirm_offers_swap(1).then(function(d){
		$scope.toconfirmoffers = d.data;
		$scope.swapnotification = d.data.length;
	})
	
})

app.controller('custconfirmations_swapCtrl', function($scope,ordersService){
	$scope.toconfirmoffers = [];
	$scope.Data.pagetitle = 'Swap Confirmations';
	$scope.swapnotification = 0;
	ordersService.to_confirm_offers_swap(1).then(function(d){
		$scope.toconfirmoffers = d.data;
		$scope.swapnotification = d.data.length;
	})
	
})

app.controller('custconfirmationsmmCtrl', function($scope,ordersService){
	$scope.toconfirmoffers = [];
	$scope.Data.pagetitle = 'MM Confirmations';
	$scope.mmnotification = 0;
	$scope.loading = true;
	ordersService.to_confirm_offers_mm(1).then(function(d){
		$scope.toconfirmoffers = d.data;
		$scope.mmnotification = d.data.length;
		$scope.loading = false;
	})
	
})

app.controller('acceptsdetailsCtrl', function($scope,$state,$stateParams){
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
	$scope.loading = true;
	$scope.offers=[];
	ordersService.all_offers(username).then(function(d) {
		//console.log(d.data);
	    $scope.offers = d.data;
	    $scope.loading = false;
	});
	
})

app.controller('offersmmCtrl', function($scope,ordersService){
	var username = window.sessionStorage.getItem('bankuser');
	$scope.loading = true;
	$scope.mm_offers=[];
	ordersService.all_mm_offers(username).then(function(d) {
		console.log(d.data);
	    $scope.mm_offers = d.data;
	    $scope.loading = false;
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

app.controller('editmmofferCtrl',function($scope,$stateParams,$http,$window,$state,$filter,$timeout,ordersService){
	var username = window.sessionStorage.getItem('bankuser');
	var orderid = $stateParams.indexid;
	var indexid = $stateParams.indexid;
	$scope.newmmoffer = [];
	var id = $stateParams.offerid;
	$scope.offerid = $stateParams.offerid;
	
	ordersService.offerdetails_mm(id).then(function(d) {
		//console.log(d.data[0]);
	    $scope.newmmoffer = d.data[0];
	});
	
	$scope.editOffer = function(){
		if ($window.confirm("This will ammend Offer. Do you want to Proceed?")) {
               $scope.loading = true;
				$http({
		              method: 'get',
		              url: './rest/new_mm_offer.php',
		              headers: {'Content-Type': 'application/json'},
		              params:{orderindex:$scope.newmmoffer.orderindex,orderidfk:$scope.newmmoffer.orderidfk,fixedrate:$scope.newmmoffer.rate,orderamount:$scope.newmmoffer.orderamount,daycount:$scope.newmmoffer.tenuredays,
		              		totalinterest:$scope.newmmoffer.totalinterest2,tax:$scope.newmmoffer.tax2,netinterest:$scope.newmmoffer.netinterest,
		              		bankcomment:$scope.newmmoffer.bankcomment,offeredby:username}
		            }).success(function (data) {
		            	$timeout(function(){
		            		$scope.loading = false;
		            		alert("Offer ammended");
		              		$scope.newmmoffer = {};
					  		$state.go('homemm');
		            	},3000,true)
		              
		            }).error(function (error) {
		                alert("Error when making an offer");
		                $scope.newmmoffer = {};
						$state.go('homemm');
		            });	
		
		ordersService.updateordermm(indexid).then(function(d){
			//console.log(d);
		})
		            
            } else {
               console.log("You clicked NO.");
            }
	};
	
	$scope.deleteOffer = function(){
			if ($window.confirm("This will withdraw Offer. Do you want to Proceed?")) {
               console.log("You clicked YES.");
               		$http({
		              method: 'POST',
		              url: '/rest/delete_mm_offer.php',
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
    	$scope.newmmoffer.totalinterest = $filter('number')($scope.newmmoffer.orderamount * ($scope.newmmoffer.fixedrate/100) * $scope.newmmoffer.tenuredays/$scope.intdays,2);
    	$scope.newmmoffer.totalinterest2 = $scope.newmmoffer.orderamount * ($scope.newmmoffer.fixedrate/100) * $scope.newmmoffer.tenuredays/$scope.intdays;
    	$scope.newmmoffer.tax = $filter('number')(($scope.newmmoffer.orderamount * ($scope.newmmoffer.fixedrate/100) * $scope.newmmoffer.tenuredays/$scope.intdays) * 0.15,2);
    	$scope.newmmoffer.tax2 = ($scope.newmmoffer.orderamount * ($scope.newmmoffer.fixedrate/100) * $scope.newmmoffer.tenuredays/$scope.intdays) * 0.15;
    	$scope.newmmoffer.netinterest = $filter('number')(($scope.newmmoffer.orderamount * ($scope.newmmoffer.fixedrate/100) * $scope.newmmoffer.tenuredays/$scope.intdays) - ($scope.newmmoffer.orderamount * ($scope.newmmoffer.rate/100) * $scope.newmmoffer.tenuredays/$scope.intdays) * 0.15,2);
    }
})

app.controller('paymentCtrl', function($scope,$state,$stateParams){
	
	
})

app.controller('approvedCtrl', function($scope,$state,$stateParams){
	$scope.confirmed = {};
	var ref = new Firebase("https://luminous-heat-9368.firebaseio.com/messages/acceptedoffers");
	var query = ref.orderByChild("status").equalTo('Customer Confirmation Received');//Awaiting Customer Confirmation
	$scope.confirmed = $firebaseArray(query);
	
})

app.controller('acceptedoffersCtrl', function($scope,ordersService){
	$scope.offers = [];
	$scope.buyoffers = [];
	$scope.swapoffers = [];
	var username = window.sessionStorage.getItem('bankuser');
	
	ordersService.accepted_offers(username).then(function(d){
		//console.log(d.data);
		$scope.offers = d.data;
	})
	ordersService.accepted_buy_offers(username).then(function(d){
		//console.log(d.data);
		$scope.buyoffers = d.data;
	})
	
	ordersService.accepted_swap_offers(username).then(function(d){
		//console.log(d.data);
		$scope.swapoffers = d.data;
		$scope.swapnotification = d.data.length;
	})
})

app.controller('acceptedmmoffersCtrl', function($scope,ordersService){
	$scope.mmoffers = [];
	var username = window.sessionStorage.getItem('bankuser');
	$scope.loading = true;
	ordersService.accepted_mm_offers(username).then(function(d){
		//console.log(d.data);
		$scope.mmoffers = d.data;
		$scope.loading = false;
	})
})

app.controller('offerdetailsCtrl', function($scope,$state,$stateParams){
	//var ref = new Firebase("https://luminous-heat-9368.firebaseio.com/messages/acceptedoffers");
	
	var orderid = $stateParams.orderid;
	var id = $stateParams.offerid;
	
	$scope.custconfirm = function(){
		//console.log(id);
		//$scope.acceptedofferid = $firebaseObject(ref.child(id));
		
		$scope.acceptedofferid.$loaded().then(function() {
			$scope.acceptedofferid.status = "Awaiting Customer Confirmation";
			$scope.acceptedofferid.$save();
		});
		
		alert('Deal Booked '+orderid);
		//console.log('alert customer to confirm order');
		$state.go('acceptedoffers');
	}
	
})

app.controller('newswaporderCtrl', function($state,$scope,$http,$filter,Data,ordersService){
	var username = window.sessionStorage.getItem('customer');
	console.log('newswaporderCtrl '+username);
	$scope.newswaporder = {};
	$scope.ccytitle = {};
	$scope.banks = [];
	
	$scope.Data = Data;
	$scope.Data.pagetitle = 'New SWAP Order';
	
	ordersService.getbanks().then(function(d){
		$scope.banks = d.data;
	})
	
				$scope.setfunct = function(){
	            	if($scope.newswaporder.nearbuyorderamount !== ""){
	            		$scope.newswaporder.nearsellorderamount = '';
	            		$scope.newswaporder.farbuyorderamount = '';
	            		$scope.newswaporder.farsellorderamount = $scope.newswaporder.nearbuyorderamount;
	            	}
	            }
	            
	            $scope.setfunct2 = function(){
	            	if($scope.newswaporder.nearsellorderamount !== ""){
	            		$scope.newswaporder.nearbuyorderamount = '';
	            		$scope.newswaporder.farsellorderamount = '';
	            		$scope.newswaporder.farbuyorderamount = $scope.newswaporder.nearsellorderamount;
	            	}
					
	            }
	
	$scope.save_swapOrder = function(){
		console.log($scope.newswaporder);
		$scope.loading = true;
		var i = $scope.newswaporder.bank.length;
		var d = new Date();
		var n = d.getTime();
		
		for(x=0; x<=i-1;x++){
					var rescp = $scope.newswaporder.bank[x];
					var inbuysell = $scope.newswaporder.buysell;
					
					$scope.newswaporder.orderid = n;
					$scope.newswaporder.usernamefk = username;
					$scope.newswaporder.recipient = rescp;
					$scope.newswaporder.ordertypefk = 'FXSWAP';
					$scope.newswaporder.buysellbank = '';
					
					if(inbuysell=='SELL'){
						$scope.newswaporder.buysellbank = "BUY";
					}else{
						$scope.newswaporder.buysellbank = "SELL";
					}
					
					$http({
		              method: 'GET',
		              url: './rest/add_swap_order.php',
		              headers: {'Content-Type': 'application/json'},
		              params:{orderid:$scope.newswaporder.orderid,usernamefk:$scope.newswaporder.usernamefk,ccypair:$scope.newswaporder.ccypair,neardate:$scope.newswaporder.neardate,
		              		nearbuyorderamountccy:$scope.newswaporder.nearbuyorderamountccy,nearbuyorderamount:$scope.newswaporder.nearbuyorderamount,nearsellorderamountccy:$scope.newswaporder.nearsellorderamountccy,
		              		nearsellorderamount:$scope.newswaporder.nearsellorderamount,buysell:$scope.newswaporder.buysell,buysellbank:$scope.newswaporder.buysellbank,recipient:rescp,fardate:$scope.newswaporder.fardate,farbuyorderamountccy:$scope.newswaporder.farbuyorderamountccy,
		              		farbuyorderamount:$scope.newswaporder.farbuyorderamount,farsellorderamountccy:$scope.newswaporder.farsellorderamountccy,farsellorderamount:$scope.newswaporder.farsellorderamount,
		              		custcomment:$scope.newswaporder.custcomment,ordertypefk:$scope.newswaporder.ordertypefk}
      				}).success(function (data) {
      					$scope.loading = false;
		              alert("New FxSwap Order Submitted ");
		              $scope.newswaporder = {};
		              $state.go('homeswap');
		            }).error(function () {
		                alert("Error making FxSwap order");
		                $scope.newswaporder = {};
						$state.go('homeswap');
		            });	
				}
	}
	
				$scope.$watch("newswaporder.buysell", function (newval) {
	               if(newval == 'BUY'){
	               		$scope.newswaporder.nearbuyorderamountccy = $filter('limitTo')($scope.newswaporder.ccypair,3);
	               		$scope.newswaporder.nearsellorderamountccy = $filter('limitTo')($scope.newswaporder.ccypair,-3);
	               		$scope.newswaporder.farsellorderamountccy = $filter('limitTo')($scope.newswaporder.ccypair,3);
	               		$scope.newswaporder.farbuyorderamountccy = $filter('limitTo')($scope.newswaporder.ccypair,-3);
	               }else{
	               		$scope.newswaporder.nearbuyorderamountccy = $filter('limitTo')($scope.newswaporder.ccypair,-3);
	               		$scope.newswaporder.nearsellorderamountccy = $filter('limitTo')($scope.newswaporder.ccypair,3);
	               		$scope.newswaporder.farsellorderamountccy = $filter('limitTo')($scope.newswaporder.ccypair,-3);
	               		$scope.newswaporder.farbuyorderamountccy = $filter('limitTo')($scope.newswaporder.ccypair,3);
	               };
	            }, true);
	
})

app.controller('newforwardorderCtrl', function($state,$scope,$http,$filter,$timeout,Data,ordersService){
	var username = window.sessionStorage.getItem('customer');
	$scope.newforwardorder = [];
	$scope.ccytitle = {};
	$scope.banks = [];
	
	$scope.Data = Data;
	$scope.Data.pagetitle = 'New FxForward Order';
	
	ordersService.getbanks().then(function(d){
		$scope.banks = d.data;
	})
	
	$scope.schedule = function(){
		var date = moment();
		var date2 = $scope.newforwardorder.startdate;
		console.log(date.add(2, 'days').format('L'));
		
		var x = $scope.newforwardorder.nofrequency;
		for (var i = 0; i < x; i++) {
			$scope.newforwardorder.push({ bank: $scope.newforwardorder.bank, buyorderamount: $scope.newforwardorder.buyorderamount, buyorderamountccy: $scope.newforwardorder.buyorderamountccy,
				sellorderamount: $scope.newforwardorder.sellorderamount, sellorderamountccy: $scope.newforwardorder.sellorderamountccy,buysell: $scope.newforwardorder.buysell,
				ccypair: $scope.newforwardorder.ccypair, custcomment: $scope.newforwardorder.custcomment,startdate: $scope.newforwardorder.startdate
			});
		}
		console.log($scope.newforwardorder);
	}
	
	$scope.saveforwardorder = function(){
		console.log($scope.newforwardorder);
		$scope.loading = true;
		
		var i = $scope.newforwardorder.bank.length;
		var freq = $scope.newforwardorder.frequency;
		var nofreq = $scope.newforwardorder.nofrequency;
		
		var d = new Date();
		var n = d.getTime();
	
    	for(f=0; f<=nofreq-1;f++){
				for(x=0; x<=i-1;x++){
					var rescp = $scope.newforwardorder.bank[x];
					var inbuysell = $scope.newforwardorder.buysell;
					
					$scope.newforwardorder.orderid = n;
					$scope.newforwardorder.forwardid = n;
					$scope.newforwardorder.usernamefk = username;
					$scope.newforwardorder.recipient = rescp;
					$scope.newforwardorder.ordertypefk = 'FXFORWARD';
					$scope.newforwardorder.buysellbank = '';
					$scope.newforwardorder.settlementdate = $scope.newforwardorder.startdate;
					
					if(inbuysell=='SELL'){
						$scope.newforwardorder.buysellbank = "BUY";
					}else{
						$scope.newforwardorder.buysellbank = "SELL";
					}
					
					$http({
		              method: 'GET',
		              url: './rest/add_forward_order.php',
		              headers: {'Content-Type': 'application/json'},
		              params:{orderid:$scope.newforwardorder.orderid,forwardid:$scope.newforwardorder.forwardid,usernamefk:$scope.newforwardorder.usernamefk,ccypair:$scope.newforwardorder.ccypair,buyorderamountccy:$scope.newforwardorder.buyorderamountccy,buyorderamount:$scope.newforwardorder.buyorderamount,
		              		sellorderamountccy:$scope.newforwardorder.sellorderamountccy,sellorderamount:$scope.newforwardorder.sellorderamount,buysell:$scope.newforwardorder.buysell,buysellbank:$scope.newforwardorder.buysellbank,recipient:rescp,settlementdate:$scope.newforwardorder.settlementdate,
		              		custcomment:$scope.newforwardorder.custcomment,ordertypefk:$scope.newforwardorder.ordertypefk}
      				}).success(function (data) {
		              //console.log(data);
		              	$timeout(function() {
		              		alert("New FxForward Order Submitted ");
					        $scope.newforwardorder = {};
		              		$state.go('homeforward');
					        $scope.loading = false;
					   	}, 3000);
		            }).error(function () {
		                alert("Error making new FxForward order");
		                $scope.newforwardorder = {};
						$state.go('homeforward');
		            });	
				}
    	}		
	}
	
				$scope.$watch("newforwardorder.buysell", function (newval) {
	               if(newval == 'BUY'){
	               		$scope.newforwardorder.buyorderamountccy = $filter('limitTo')($scope.newforwardorder.ccypair,3);
	               		$scope.newforwardorder.sellorderamountccy = $filter('limitTo')($scope.newforwardorder.ccypair,-3);
	               }else{
	               		$scope.newforwardorder.buyorderamountccy = $filter('limitTo')($scope.newforwardorder.ccypair,-3);
	               		$scope.newforwardorder.sellorderamountccy = $filter('limitTo')($scope.newforwardorder.ccypair,3);
	               };
	            }, true);
	
})

app.controller('newmmorderCtrl', function($scope, $stateParams,$state,$http,Data,$interval,$timeout,$firebaseArray,$firebaseObject, ordersService) {
    var username = window.sessionStorage.getItem('customer');
    var ref = new Firebase("https://luminous-heat-9368.firebaseio.com/margin/Moneymarketorders");
    $scope.mmorder = $firebaseArray(ref);
    
    
    $scope.newmmorder = {};
	$scope.ccytitle = 'CCY';
	$scope.banks = [];
	$scope.currency = [];
	
	$scope.Data = Data;
	$scope.Data.pagetitle = 'New Money Market Order';
	
	ordersService.getcurrency().then(function(d){
		//console.log(d.data[0].code);
		$scope.currency = d.data;
	})
	
	ordersService.getbanks().then(function(d){
		$scope.banks = d.data;
	})
	
	$scope.$watch("newmmorder.ccy", function (newval) {
		//console.log('New Value received ....'+newval);
	    $scope.ccytitle = newval;
	}, true);
	
	
	$scope.$watch("newmmorder.mmto", function(newval) {
		$scope.formatString = function(format) {
		    var day   = parseInt(format.substring(0,2));
		    var month  = parseInt(format.substring(3,5));
		    var year   = parseInt(format.substring(6,10));
		    var date = new Date(year, month-1, day);
		    return date;
		}
		var date2 = new Date($scope.formatString($scope.newmmorder.mmto));
	    var date1 = new Date($scope.formatString($scope.newmmorder.mmfrom));
	    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
		
		console.log('Date 2 ..'+ date2);
		console.log('Date 1 ..'+ date1);
		
	    $scope.dayDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
	    //console.log('Diffrence ..'+ $scope.dayDifference);
	    $scope.newmmorder.tenure = $scope.dayDifference;
	    $scope.newmmorder.tenuredisp = $scope.dayDifference + "D";
	}, true)
	
	$scope.save_mm_Order = function(){
		$scope.loading = true;
		
		var i = $scope.newmmorder.bank.length;
		//console.log(i);
		var d = new Date();
		var n = d.getTime();

				for(x=0; x<=i-1;x++){
					var rescp = $scope.newmmorder.bank[x];
					var inmmtype = $scope.newmmorder.mmtype;
					
					
					$scope.newmmorder.orderid = n;
					$scope.newmmorder.usernamefk = username;
					$scope.newmmorder.recipient = rescp;
					$scope.newmmorder.ordertypefk = 'MM';
					
					if(inmmtype=='Placement'){
						$scope.newmmorder.mmtypebank = "Deposit";
					}else{
						$scope.newmmorder.mmtypebank = "Placement";
					}
					
					$http({
		              method: 'GET',
		              url: './rest/add_mm.php',
		              headers: {'Content-Type': 'application/json'},
		              params:{orderid:$scope.newmmorder.orderid,usernamefk:$scope.newmmorder.usernamefk,ccy:$scope.newmmorder.ccy,orderamount:$scope.newmmorder.orderamount,
		              		mmfrom:$scope.newmmorder.mmfrom,mmto:$scope.newmmorder.mmto,tenure:$scope.newmmorder.tenure,recipient:rescp,custcomment:$scope.newmmorder.custcomment,
		              		ordertypefk:$scope.newmmorder.ordertypefk,mmtype:$scope.newmmorder.mmtype,mmtypebank:$scope.newmmorder.mmtypebank}
      				}).success(function (data) {
		              //console.log(data);
		              //
					  $timeout(function(){
					  	$scope.loading = false;
					  	alert("New Money Market Order Submitted ");
					  	$scope.newmmorder = {};
					  	$state.go('homemoneymarket');
					  },3000)
		            }).error(function () {
		                alert("Error making new order");
		                $scope.newmmorder = {};
						$state.go('homemoneymarket');
		            });
		            
		            $scope.mmorder.$add({
				      orderid:$scope.newmmorder.orderid,
				      usernamefk:$scope.newmmorder.usernamefk,
				      ccy:$scope.newmmorder.ccy,
				      orderamount:$scope.newmmorder.orderamount,
		              mmfrom:$scope.newmmorder.mmfrom,
		              mmto:$scope.newmmorder.mmto,
		              tenure:$scope.newmmorder.tenure,
		              recipient:rescp,
		              custcomment:$scope.newmmorder.custcomment,
		              ordertypefk:$scope.newmmorder.ordertypefk,
		              mmtype:$scope.newmmorder.mmtype,
		              mmtypebank:$scope.newmmorder.mmtypebank
				    });
				}
	}
	
})

app.controller('neworderCtrl', function($state,$scope,$http,Data,ordersService){
	var username = window.sessionStorage.getItem('customer');
	//console.log(username);
	$scope.neworder = {};
	$scope.ccytitle = {};
	$scope.banks = [];
	
	$scope.Data = Data;
	$scope.Data.pagetitle = 'New FXSPOT Order';
	
	ordersService.getbanks().then(function(d){
		//console.log(d.data);
		$scope.banks = d.data;
	})
	
	
	/**$scope.saveOrder = function(){
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
	};*/

	$scope.save_c9_Order = function(){
		//console.log($scope.neworder);
		//$scope.promise = $http.get('./rest/connect.php');
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
		if($scope.booking.buysellbank == 'SELL' && $scope.booking.buyorderamount>0){
			$scope.lim = 3;
			$scope.booking.rec = "PAY";
			$scope.booking.pay = "REC";
			$scope.recamount = $scope.booking.orderamount;
			$scope.payamount = $scope.booking.settleamount;
			$scope.booking.buysellrec = $scope.booking.buysell;
			$scope.booking.buysellrec2 = $scope.booking.buysellbank;
		}else if($scope.booking.buysellbank == 'SELL' && $scope.booking.sellorderamount>0){
			$scope.lim = -3;
			$scope.booking.rec = "REC";
			$scope.booking.pay = "PAY";
			$scope.recamount = $scope.booking.orderamount;
			$scope.payamount = $scope.booking.settleamount;
			$scope.booking.buysellrec = $scope.booking.buysellbank;
			$scope.booking.buysellrec2 = $scope.booking.buysell;
		}else if($scope.booking.buysellbank == 'BUY' && $scope.booking.sellorderamount>0){
			$scope.lim = 3;
			$scope.booking.rec = "REC";
			$scope.booking.pay = "PAY";
			$scope.recamount = $scope.booking.orderamount;
			$scope.payamount = $scope.booking.settleamount;
			$scope.booking.buysellrec = $scope.booking.buysell;
			$scope.booking.buysellrec2 = $scope.booking.buysellbank;
		}else if($scope.booking.buysellbank == 'BUY' && $scope.booking.buyorderamount>0){
			$scope.lim = -3;
			$scope.booking.rec = "PAY";
			$scope.booking.pay = "REC";
			$scope.recamount = $scope.booking.orderamount;
			$scope.payamount = $scope.booking.settleamount;
			$scope.booking.buysellrec = $scope.booking.buysellbank;
			$scope.booking.buysellrec2 = $scope.booking.buysell;
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

app.controller('bookmmdealCtrl',function($scope,$http,$state,$stateParams,ordersService){
	$scope.booking = {};
	var offerid = $stateParams.offerid;
	
	ordersService.offerdetails_mm(offerid).then(function(d){
		$scope.booking = d.data[0];
		//console.log(d.data[0]);
	})
	
	$scope.custconfirm = function(){
		$http({
		              method: 'POST',
		              url: '/rest/confirm_mm_offer.php',
		              headers: {'Content-Type': 'application/json'},
		              data : {id: offerid}
		            }).success(function (data) {
		              alert("MM Deal Successfully Booked");
					  $state.go('acceptedoffermm');
		            }).error(function (error) {
		                alert("Error booking a deal");
						$state.go('acceptedoffermm');
		            });
	}
})

app.controller('bookswapdealCtrl', function($scope, $stateParams, $interval,$state,$http, ordersService) {
    $scope.booking = {};
	var offerid = $stateParams.offerid;
	
	ordersService.offerdetails_swap(offerid).then(function(d){
		$scope.booking = d.data[0];
		console.log(d.data[0]);
	})
	
	$scope.custconfirm = function(){
					$http({
		              method: 'POST',
		              url: '/rest/confirm_swap_offer.php',
		              headers: {'Content-Type': 'application/json'},
		              data : {id: offerid}
		            }).success(function (data) {
		              alert("FxSwap Deal Successfully Booked");
					  $state.go('acceptedofferswap');
		            }).error(function (error) {
		                alert("Error booking a deal");
						$state.go('acceptedofferswap');
		            });
	}
})

app.controller('confirmswapofferCtrl', function($scope, $stateParams,$state, $http,$interval, Data, ordersService) {
    var offerid = $stateParams.offerid;
    $scope.reject = {};
    $scope.showAccept = false;
    $scope.showReject = false;
    
    ordersService.offerdetails_swap(offerid).then(function(d){
		$scope.booking = d.data[0];
	})
	
	$scope.accept = function(){
		//accept booked deal
		$http({
		   method: 'POST',
		   url: './rest/accept_swap_deal.php',
		   headers: {'Content-Type': 'application/json'},
		   data : {id:offerid}
		}).success(function (data) {
		    alert("Deal Accepted");
			$state.go('custconfirmations_swap');
		}).error(function (error) {
		    alert("Error accepting deal");
			$state.go('custconfirmations_swap');
		});	
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

app.controller('confirmoffermmCtrl', function($scope, $stateParams,$http,$state, ordersService) {
	$scope.Data.pagetitle = 'MM Confirmations';
    var offerid = $stateParams.offerid;
    $scope.reject = {};
    $scope.showAccept = false;
    $scope.showReject = false;
    
    ordersService.offerdetails_mm(offerid).then(function(d){
    	//console.log(d.data[0]);
		$scope.booking = d.data[0];
    })
    
    $scope.accept = function(){
		//accept booked deal
		$http({
		   method: 'POST',
		   url: './rest/accept_mm_deal.php',
		   headers: {'Content-Type': 'application/json'},
		   data : {id:offerid}
		}).success(function (data) {
		    alert("Deal Accepted");
			$state.go('custconfirmations');
		}).error(function (error) {
		    alert("Error accepting deal");
			$state.go('custconfirmations');
		});	
	}
	
	$scope.reject = function(){
		alert('... will be rejected');
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

app.controller('confirmofferCtrl', function($scope, $stateParams,$http,$state, ordersService) {
    var offerid = $stateParams.offerid;
    $scope.reject = {};
    $scope.showAccept = false;
    $scope.showReject = false;
    
    ordersService.offerdetails(offerid).then(function(d){
    	//console.log(d.data[0]);
		$scope.booking = d.data[0];
		if($scope.booking.buysellbank == 'SELL' && $scope.booking.buyorderamount>0){
			$scope.lim = 3;
			$scope.booking.rec = "PAY";
			$scope.booking.pay = "REC";
			$scope.booking.recamount = $scope.booking.orderamount;
			$scope.booking.payamount = $scope.booking.settleamount;
		}
		else if($scope.booking.buysellbank == 'SELL' && $scope.booking.sellorderamount>0){
			$scope.lim = 3;
			$scope.booking.rec = "PAY";
			$scope.booking.pay = "REC";
			$scope.booking.recamount = $scope.booking.settleamount;
			$scope.booking.payamount = $scope.booking.orderamount;
		}
		else if($scope.booking.buysellbank == 'BUY' && $scope.booking.sellorderamount>0){
			//$scope.booking.rec = "REC";
			//$scope.booking.pay = "PAY";
			$scope.lim = -3;
			$scope.booking.recamount = $scope.booking.settleamount;
			$scope.booking.payamount = $scope.booking.orderamount;
		}
		else if($scope.booking.buysellbank == 'BUY' && $scope.booking.buyorderamount>0){
			//$scope.booking.rec = "REC";
			$scope.lim = -3;
			$scope.booking.recamount = $scope.booking.orderamount;
			$scope.booking.payamount = $scope.booking.settleamount;
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
	               if(newval=="Payment Done"){
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
	$scope.confirmedswapoffers = [];
	$scope.confirmedforwardoffers = [];
	$scope.confirmedmmoffers = [];
	
	$scope.loading = true;
	
    ordersService.confirmed_offers().then(function(d){
    	//console.log(d.data);
    	$scope.confirmedoffers = d.data
    })
    
    ordersService.confirmed_swap_offers().then(function(d){
    	$scope.confirmedswapoffers = d.data
    })
    
    ordersService.confirmed_mm_offers().then(function(d){
    	$scope.confirmedmmoffers = d.data
    })
    
    $scope.loading = false;
})

app.controller('operationsCtrl',function($scope, $state,ordersService) {
    
})

app.controller('custpaymentsCtrl', function($scope, $stateParams, $http, $window,$state, ordersService) {
    
    $scope.custpay = [];
    $scope.custswappay = [];
    $scope.custforwardpay = [];
    
    ordersService.payments_confirm().then(function(d){
    	$scope.custpay = d.data
    })
    
    ordersService.confirmed_swap_offers().then(function(d){
    	$scope.custswappay = d.data
    })
    
    $scope.pay = function(idx){
    	var deleteUser = $window.confirm('Are you sure you want to confirm payment?');
	    if(deleteUser){
	    	//console.log('CustPayments confirmations ...'+ idx);
	     	$http({
			   method: 'POST',
			   url: './rest/pay_deal.php',
			   headers: {'Content-Type': 'application/json'},
			   data : {id:idx}
			}).success(function (data) {
			    alert('Payment Confirmed. Thank You');
				ordersService.payments_confirm().then(function(d){
			    	$scope.custpay = d.data
			    })
			}).error(function (error) {
			    alert("Error making payment");
			});	
	    }
    }
})

app.controller('custpaymentsmmCtrl', function($scope, $stateParams, $http, $window,$state, ordersService) {
    $scope.Data.pagetitle = 'MM Payments';
    $scope.custmmpay = [];
    $scope.loading = true;
    ordersService.payments_mm_confirm().then(function(d){
    	$scope.custmmpay = d.data;
    	$scope.loading = false;
    })
    
    $scope.pay = function(idx){
    	var deleteUser = $window.confirm('Are you sure you want to confirm payment?');
	    if(deleteUser){
	     	$http({
			   method: 'POST',
			   url: './rest/pay_mm_deal.php',
			   headers: {'Content-Type': 'application/json'},
			   data : {id:idx}
			}).success(function (data) {
			    alert('MM Payment Confirmed. Thank You');
				ordersService.payments_mm_confirm().then(function(d){
			    	$scope.custmmpay = d.data
			    })
			}).error(function (error) {
			    alert("Error making MM payment");
			});	
	    }
    }
})