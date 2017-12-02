'use strict';

var app = angular.module('appW', []);

app.controller('controlWi', ['$window', '$scope', function($window, $scope){
	var mainCtrl = this;
	mainCtrl.test = 'testing mainController';

    // Method suggested in @Baconbeastnz's answer
    $(window).resize(function() {
      $scope.$apply(function() {
        $scope.windowWidth = $( window ).width();
      });
    });
}]);
