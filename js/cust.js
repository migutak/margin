var myapp = angular.module('myapp', [ "ui.router", 'starter.controllers','starter.services','ui-notification'])

myapp.config(function($stateProvider, $urlRouterProvider) {
	// For any unmatched url, send to /route1 
	$urlRouterProvider.otherwise("/home")

	$stateProvider
	.state('home', {
		url : "/home",
		templateUrl : "templates/home_cust.html",
		controller : 'custCtrl'
	}).state('homeswap', {
		url : "/homeswap",
		templateUrl : "templates/home_cust_swap.html",
		controller : 'custCtrl'
	}).state('homeforward', {
		url : "/homeforward",
		templateUrl : "templates/home_cust_forward.html",
		controller : 'custCtrl'
	}).state('homemoneymarket', {
		url : "/homemoneymarket",
		templateUrl : "templates/home_cust_mm.html",
		controller : 'custCtrl'
	})
	.state('newoffer', {
		url : "/newoffer/:orderid",
		templateUrl : "templates/newoffer.jsp",
		controller : 'newofferCtrl'
	})
	.state('login', {
		url : "/login",
		templateUrl : "login.html"
	})
	.state('offeraccept', {
		url : "/offeraccept/:offerid",
		templateUrl : "templates/offeraccept.html",
		controller : 'offeracceptCtrl'
	}).state('offeraccept_swap', {
		url : "/offeraccept_swap/:offerid",
		templateUrl : "templates/offeraccept_swap.html",
		controller : 'offeracceptswapCtrl'
	}).state('offeraccept_mm', {
		url : "/offeraccept_mm/:offerid",
		templateUrl : "templates/offeraccept_mm.html",
		controller : 'offeracceptmmCtrl'
	}).state('profile', {
		url : "/profile",
		templateUrl : "templates/profile_cust.html",
		controller : 'profileCtrl'
	}).state('report1', {
		url : "/report1",
		templateUrl : "templates/report1.html",
		controller : 'profileCtrl'
	}).state('report2', {
		url : "/report2",
		templateUrl : "templates/report2.html",
		controller : 'profileCtrl'
	}).state('custconfirmations', {
		url : "/custconfirmations",
		templateUrl : "templates/custconfirmations.html",
		controller : 'custconfirmationsCtrl'
	}).state('custconfirmations_swap', {
		url : "/custconfirmations_swap",
		templateUrl : "templates/custconfirmations_swap.html",
		controller : 'custconfirmations_swapCtrl'
	}).state('custconfirmations_forward', {
		url : "/custconfirmations_forward",
		templateUrl : "templates/custconfirmations_forward.html",
		controller : 'custconfirmations_forwardCtrl'
	}).state('custconfirmations_mm', {
		url : "/custconfirmations_mm",
		templateUrl : "templates/custconfirmations_mm.html",
		controller : 'custconfirmationsmmCtrl'
	}).state('acceptDetails', {
		url : "/acceptDetails/:offerid",
		templateUrl : "templates/acceptDetails.html",
		controller : 'acceptsdetailsCtrl'
	}).state('neworder', {
		url : "/neworder",
		templateUrl : "templates/neworder.html",
		controller : 'neworderCtrl'
	}).state('newswap', {
		url : "/newswap",
		templateUrl : "templates/newswap.html",
		controller : 'newswaporderCtrl'
	}).state('newforward', {
		url : "/newforward",
		templateUrl : "templates/newforward.html",
		controller : 'newforwardorderCtrl'
	}).state('newmoneymarket', {
		url : "/newmoneymarket",
		templateUrl : "templates/newmoneymarket.html",
		controller : 'newmmorderCtrl'
	}).state('confirmDetails', {
		url : "/confirmDetails",
		templateUrl : "templates/payment.html",
		controller : 'paymentCtrl'
	}).state('confirmoffer', {
		url : "/confirmoffer/:offerid",
		templateUrl : "templates/confirmbooking.html",
		controller : 'confirmofferCtrl'
	}).state('confirmoffermm', {
		url : "/confirmoffermm/:offerid",
		templateUrl : "templates/confirmbookingmm.html",
		controller : 'confirmoffermmCtrl'
	}).state('confirmswapoffer', {
		url : "/confirmswapoffer/:offerid",
		templateUrl : "templates/confirmbookingswap.html",
		controller : 'confirmswapofferCtrl'
	}).state('payments', {
		url : "/payments",
		templateUrl : "templates/custpayments.html",
		controller : 'custpaymentsCtrl'
	}).state('paymentswap', {
		url : "/paymentswap",
		templateUrl : "templates/custpaymentswap.html",
		controller : 'custpaymentsCtrl'
	}).state('paymentforward', {
		url : "/paymentforward",
		templateUrl : "templates/custpaymentforward.html",
		controller : 'custpaymentsCtrl'
	}).state('paymentmm', {
		url : "/paymentmm",
		templateUrl : "templates/custpaymentmm.html",
		controller : 'custpaymentsmmCtrl'
	})
})	
	

