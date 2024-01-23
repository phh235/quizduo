var myApp = angular.module("myApp", ["ngRoute"]);

myApp.controller("myCtrl", function ($scope) {});


myApp.controller("subjectCtrl", function ($scope, $http) {
  $scope.list_subject = [];
  $http.get("db/Subjects.js").then(function (reponse) {
    $scope.list_subject = reponse.data;
    console.log($scope.list_subject);
  });

  $scope.begin = 0;
  $scope.pageCount = Math.ceil($scope.list_subject.length / 4);

  $scope.prev = function () {
    if ($scope.begin > 0) {
      $scope.begin -= 4;
    }
  };
  $scope.next = function () {
    if ($scope.begin > ($scope.pageCount - 1) * 4) {
      $scope.begin += 4;
    }
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
    .when("/quiz/:subjectId/:subjectName", {
      templateUrl: "assets/html/quiz-demo.html",
      controller: "quizCtrl",
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

myApp.controller("quizCtrl", function ($scope, $http, $routeParams) {
  $scope.caccauhoi = [];
  $scope.subjectId = $routeParams.subjectId;
  $scope.subjectName = $routeParams.subjectName;
  $scope.start = 0;
  $scope.next = function () {
    if($scope.start < 0) $scope.start = 0;
    else $scope.start += 1;
  };
  $scope.prev = function () {
    if ($scope.start < 0) $scope.start = 0;
    else $scope.start -= 1;
  };
  $http.get("db/Quizs/" + $scope.subjectId + ".js").then(
    function (d) {
      $scope.caccauhoi = d.data;
    },
    function (d) {
      alert("Lỗi");
    }
  );
});
