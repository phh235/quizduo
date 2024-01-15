var myApp = angular.module("myApp", ["ngRoute"]);

myApp.controller("myCtrl", function ($scope) {});

myApp.controller("subjectCtrl", function ($scope, $http) {
  $scope.list_subject = [];
  $http.get("db/Subjects.js").then(function (reponse) {
    $scope.list_subject = reponse.data;
    console.log($scope.list_subject);  
  });

  $scope.begin = 0;
  $scope.pageCount = Math.ceil($scope.list_subject.length / 8);

  $scope.first = function () {
    $scope.begin = 0;
  };
  $scope.prev = function () {
    if ($scope.begin > 0) {
      $scope.begin -= 8;
    }
  };
  $scope.next = function () {
    if ($scope.begin < ($scope.pageCount - 1) * 8) {
      $scope.begin += 8;
    }
  };
  $scope.last = function () {
    $scope.begin = ($scope.pageCount - 1) * 8;
  };
});

myApp.config(function ($routeProvider) {
  $routeProvider
    .when("/home", {
      templateUrl: "assets/html/home.html",
    })
    .when("/subject", {
      templateUrl: "assets/html/subject-test.html",
      controller: "subjectCtrl",
    })
    .when("/quiz/:subjectId", {
      templateUrl: "assets/html/quiz.html",
    })
    .when("/account", {
      templateUrl: "assets/html/account.html",
    })
    .when("/user:accountId", {
      templateUrl: "assets/html/user_details.html",
    })
    .when("/contact", {
      templateUrl: "assets/html/contact.html",
    })
    .when("/services", {
      templateUrl: "assets/html/services.html",
    })
    .when("/faq", {
      templateUrl: "assets/html/faq.html",
    })
    .when("/about", {
      templateUrl: "assets/html/about.html",
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
    .when("/account/change", {
      templateUrl: "assets/html/changePass.html",
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

