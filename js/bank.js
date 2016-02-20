var myapp = angular.module('myapp', [ "ui.router", 'starter.controllers', 'starter.services','ui-notification'])

myapp.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise("/home")

	$stateProvider
	.state('home', {
		url : "/home",
		templateUrl : "templates/home_bank.html",
		controller : 'bankCtrl'
	}).state('homeswap', {
		url : "/homeswap",
		templateUrl : "templates/home_bank_swap.html",
		controller : 'bankCtrl'
	}).state('homeforward', {
		url : "/homeforward",
		templateUrl : "templates/home_bank_forward.html",
		controller : 'bankCtrl'
	}).state('homemm', {
		url : "/homemm",
		templateUrl : "templates/home_bank_mm.html",
		controller : 'bankCtrl'
	}).state('newoffer', {
		url : "/newoffer/:indexid",
		templateUrl : "templates/newoffer.html",
		controller : 'newofferCtrl'
	})
	.state('newmmoffer', {
		url : "/newmmoffer/:indexid",
		templateUrl : "templates/newmmoffer.html",
		controller : 'newmmofferCtrl'
	}).state('newswapoffer', {
		url : "/newswapoffer/:indexid",
		templateUrl : "templates/newswapoffer.html",
		controller : 'newswapofferCtrl'
	}).state('newforwardoffer', {
		url : "/newforwardoffer/:indexid",
		templateUrl : "templates/newforwardoffer.html",
		controller : 'newforwardofferCtrl'
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
	}).state('offersswap', {
		url : "/offersswap",
		templateUrl : "templates/offersswap.html",
		controller : 'offersCtrl'
	}).state('offersmm', {
		url : "/offersmm",
		templateUrl : "templates/offersmm.html",
		controller : 'offersmmCtrl'
	}).state('acceptedoffers', {
		url : "/acceptedoffers",
		templateUrl : "templates/acceptedoffers.html",
		controller : 'acceptedoffersCtrl'
	}).state('acceptedofferswap', {
		url : "/acceptedofferswap",
		templateUrl : "templates/acceptedofferswap.html",
		controller : 'acceptedoffersCtrl'
	}).state('acceptedofferforward', {
		url : "/acceptedofferforward",
		templateUrl : "templates/acceptedofferforward.html",
		controller : 'acceptedoffersCtrl'
	}).state('acceptedoffermm', {
		url : "/acceptedoffermm",
		templateUrl : "templates/acceptoffermm.html",
		controller : 'acceptedmmoffersCtrl'
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
	}).state('bookmmdeal', {
		url : "/bookmmdeal/:offerid",
		templateUrl : "templates/bookmmdeal.html",
		controller : 'bookmmdealCtrl'
	}).state('bookswapdeal', {
		url : "/bookswapdeal/:offerid",
		templateUrl : "templates/bookswapdeal.html",
		controller : 'bookswapdealCtrl'
	}).state('confirmDetails', {
		url : "/confirmDetails/:id",
		templateUrl : "templates/payment.html",
		controller : 'paymentCtrl'
	}).state('editOffer', {
		url : "/editOffer/:offerid",
		templateUrl : "templates/editoffer.html",
		controller : 'editofferCtrl'
	}).state('editmmOffer', {
		url : "/editmmOffer/:offerid",
		templateUrl : "templates/editmmoffer.html",
		controller : 'editmmofferCtrl'
	})
})
