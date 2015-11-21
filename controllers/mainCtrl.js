/**
 * 
 */

var app = angular.module('App', ['firebase','ui.router','login.controller']);

app.config(function($stateProvider, $urlRouterProvider) {
	  $stateProvider
	  .state('homecust', {
	      url: '/homecust',
	      templateUrl: 'index_cust.html',
	      controller: 'custCtrl'
	    })
	    .state('homebank', {
	      url: '/homebank',
	      templateUrl: 'index_bank.html',
	      controller: 'bankCtrl'
	    })
	    .state('login', {
	      url: '/login',
	      templateUrl: 'login.html',
	      controller: 'loginCtrl'
	    })
	  .state('product', {
	      url: '/product/:productId',
	      templateUrl: 'templates/details.html',
	      controller: 'DetailsCtrl'
	    });
	  $urlRouterProvider.otherwise('/login');
	})

app.value('fbURL', 'https://luminous-heat-9368.firebaseio.com/');

app.service('fbRef', function(fbURL) {
  return new Firebase(fbURL)
})