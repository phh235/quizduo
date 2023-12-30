var myApp = angular.module("myApp", ["ngRoute"]);

myApp.controller("myControl", function ($scope) {});

myApp.config(function ($routeProvider) {
  $routeProvider
    .when("/home", {
      templateUrl: "assets/html/home.html",
    })
    .when("/subject", {
      templateUrl: "assets/html/subject.html",
    })
    .when("/account", {
      templateUrl: "assets/html/account.html",
    })
    .when("/account/signIn", {
      templateUrl: "assets/html/login.html",
    })
    .when("/account/signUp", {
      templateUrl: "assets/html/register.html",
    })
    .when("/account/forgot", {
      templateUrl: "assets/html/forgot.html",
    })
    .otherwise({
      redirectTo: "/home",
    });
});

myApp.run(function ($rootScope) {
  $rootScope.$on("$routeChangeStart", function () {
    $rootScope.loading = true;
  });
  $rootScope.$on("$routeChangeSuccess", function () {
    $rootScope.loading = false;
  });
  $rootScope.$on("$routeChangeError", function () {
    $rootScope.loading = false;
    alert("Lỗi");
  });
});
