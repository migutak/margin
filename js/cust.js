var myapp = angular.module('myapp', [ "ui.router", 'starter.controllers','starter.services','ui-notification'])

myapp.config(function($stateProvider, $urlRouterProvider) {
	// For any unmatched url, send to /route1
	$urlRouterProvider.otherwise("/home")

	$stateProvider.state('home', {
		url : "/home",
		templateUrl : "templates/home_cust.html",
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
	}).state('acceptDetails', {
		url : "/acceptDetails/:offerid",
		templateUrl : "templates/acceptDetails.html",
		controller : 'acceptsdetailsCtrl'
	}).state('neworder', {
		url : "/neworder",
		templateUrl : "templates/neworder.html",
		controller : 'neworderCtrl'
	}).state('newforward', {
		url : "/newforward",
		templateUrl : "templates/newforward.html",
		controller : 'neworderCtrl'
	}).state('newswap', {
		url : "/newswap",
		templateUrl : "templates/newswap.html",
		controller : 'neworderCtrl'
	}).state('confirmDetails', {
		url : "/confirmDetails",
		templateUrl : "templates/payment.html",
		controller : 'paymentCtrl'
	}).state('confirmoffer', {
		url : "/confirmoffer/:offerid",
		templateUrl : "templates/confirmbooking.html",
		controller : 'confirmofferCtrl'
	})
})	
	

