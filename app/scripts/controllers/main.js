'use strict';

angular.module('angularApp').controller('MainCtrl', function ($scope, $http) {//, $templateCache) {
  var url = '/todo';

  $scope.todolist = [];
  $scope.getTodo = function() {
    $http.get(url).success(function(data) {
      $scope.todolist = data;
    });
  };

  $scope.createTodo = function() {
    var todo = {};
    todo.checked = false;
    todo.data = this.newtodo;

    var senddata = 'mydata=' + JSON.stringify(todo);
    $http({
      method: 'POST',
      url: url,
      data: senddata,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
//      cache: $templateCache
    }).success(function(response) {
      $scope.getTodo();
    }).error(function(response) {
    });
    this.newtodo = "";
  };

  $scope.updateTodo = function(todo) {
    //todo.checked = !todo.checked;
    var senddata = 'mydata=' + JSON.stringify(todo);
    console.log(senddata);
    $http({
      method: 'PUT',
      url: url + '/' + todo._id,
      data: senddata,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
//      cache: $templateCache
    }).success(function(response) {
      $scope.getTodo();
    }).error(function(response) {
    });
  };

  $scope.deleteTodo = function(todo) {
    var senddata = 'mydata=' + JSON.stringify(todo);
    console.log(senddata);
    $http({
      method: 'DELETE',
      url: url + '/' + todo._id,
      data: senddata,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
//      cache: $templateCache
    }).success(function(response) {
      $scope.getTodo();
    }).error(function(response) {
    });
  };

  $scope.getTodo();
});
