var app = angular.module('app', []);
 
 app.controller("firstCtrl", function ($scope) {
     $scope.handleClick = function (msg) {
        $scope.$broadcast('eventName', { message: msg });
     };
 
 });
 
 app.controller("secondCtrl", function ($scope) {
     $scope.$on('eventName', function (event, args) {
         $scope.message = args.message;
         console.log($scope.message);
     });
 });