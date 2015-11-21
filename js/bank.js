var myapp = angular.module('myapp', [ "ui.router", 'starter.controllers', 'starter.services','ui-notification'])

myapp.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise("/home")

	$stateProvider.state('home', {
		url : "/home",
		templateUrl : "templates/home_bank.html",
		controller : 'bankCtrl'
	})
	.state('newoffer', {
		url : "/newoffer/:indexid",
		templateUrl : "templates/newoffer.html",
		controller : 'newofferCtrl'
	}).state('profile', {
		url : "/profile",
		templateUrl : "templates/profile.html",
		controller : 'profileCtrl'
	}).state('logout', {
		url : "/logout",
		templateUrl : "index.html"
	}).state('offers', {
		url : "/offers",
		templateUrl : "templates/offers.html",
		controller : 'offersCtrl'
	}).state('acceptedoffers', {
		url : "/acceptedoffers",
		templateUrl : "templates/acceptedoffers.html",
		controller : 'acceptedoffersCtrl'
	}).state('approvals', {
		url : "/ofapprovalsfers",
		templateUrl : "templates/approvals.html",
		controller : 'approvedCtrl'
	}).state('declines', {
		url : "/declines",
		templateUrl : "templates/declines.html",
		controller : 'approvedCtrl'
	}).state('rptconfirmation', {
		url : "/rptconfirmation",
		templateUrl : "templates/rptconfirmation.html"
	}).state('rptdonedeals', {
		url : "/rptdonedeals",
		templateUrl : "templates/rptdonedeals.html"
	}).state('rptmaturity', {
		url : "/rptmaturity",
		templateUrl : "templates/rptmaturity.html"
	}).state('rptammendments', {
		url : "/rptammendments",
		templateUrl : "templates/rptammendments.html"
	}).state('rptcancellations', {
		url : "/rptcancellations",
		templateUrl : "templates/rptcancellations.html"
	}).state('rptaudit', {
		url : "/rptaudit",
		templateUrl : "templates/rptaudit.html"
	}).state('rptcurrencypostn', {
		url : "/rptcurrencypostn",
		templateUrl : "templates/rptcurrencypostn.html"
	}).state('rptexceptions', {
		url : "/rptexceptions",
		templateUrl : "templates/rptexceptions.html"
	}).state('bookdeal', {
		url : "/bookdeal/:offerid",
		templateUrl : "templates/bookdeal.html",
		controller : 'bookdealCtrl'
	}).state('confirmDetails', {
		url : "/confirmDetails/:id",
		templateUrl : "templates/payment.html",
		controller : 'paymentCtrl'
	}).state('editOffer', {
		url : "/editOffer/:offerid",
		templateUrl : "templates/editoffer.html",
		controller : 'editofferCtrl'
	})
})
