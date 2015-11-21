var myapp = angular.module('myapp', [ "ui.router", 'starter.controllers','starter.services','ui-notification'])

myapp.config(function($stateProvider, $urlRouterProvider) {
	// For any unmatched url, send to /route1
	$urlRouterProvider.otherwise("/home")

	$stateProvider.state('home', {
		url : "/home",
		templateUrl : "templates/home_backoffice.html",
		controller : 'backofficeCtrl'
	})
	.state('profile', {
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
	}).state('dealsconfirmed', {
		url : "/dealsconfirmed",
		templateUrl : "templates/dealsconfirmed.html",
		controller : 'dealsconfirmedCtrl'
	}).state('rejected', {
		url : "/rejected",
		templateUrl : "templates/rejected.html",
		controller : 'rejectedCtrl'
	}).state('payments', {
		url : "/payments",
		templateUrl : "templates/payments.html",
		controller : 'paymentsCtrl'
	}).state('settlement', {
		url : "/settlement/:offerid",
		templateUrl : "templates/settlement.html",
		controller : 'settlementCtrl'
	}).state('operations', {
		url : "/operations",
		templateUrl : "templates/operations.html",
		controller : 'operationsCtrl'
	}).state('dealmanagement', {
		url : "/dealmanagement",
		templateUrl : "templates/dealmanagement.html",
		controller : 'operationsCtrl'
	}).state('bookdeal', {
		url : "/bookdeal/:offerid",
		templateUrl : "templates/bookdealf.html",
		controller : 'bookdealCtrl'
	}).state('confirmoffer', {
		url : "/confirmoffer/:offerid",
		templateUrl : "templates/confirmbookingf.html",
		controller : 'confirmofferCtrl'
	})
})	
	

