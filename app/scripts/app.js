'use strict';

angular.module('angularApp', [])
//  .config(function ($routeProvider) {
  .config(function ($routeProvider, $locationProvider, $httpProvider) {
    $locationProvider.html5Mode(true);

    /*
      HTTPレスポンスを確認して、401エラーが含まれていればログインページに飛ばす処理。
      http://code.angularjs.org/1.0.8/docs/api/ng.$http
      http://code.angularjs.org/1.0.8/docs/api/ng.$q
      あたりを参考。
      使う前に「$q and deferred/promise APIs」の理解が必要とあるがまだわかってない
     */
    // []で囲わないと、gruntでminifyした際にエラーとなる
    $httpProvider.responseInterceptors.push(['$q', '$location',function($q, $location) {
      return function(promise) {
        return promise.then(function(response) {
            // Success: 成功時はそのまま返す
            return response;
          }, function(response) {
            // Error: エラー時は401エラーならば/loginに遷移
            if (response.status === 401) {
              $location.url('/login');
            }
            return $q.reject(response);
          }
        );
      };
    }]);


    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'MainCtrl'
//      })
//      .otherwise({
//        redirectTo: '/'
      });
  });
