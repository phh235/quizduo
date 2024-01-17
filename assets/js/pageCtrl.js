var myApp = angular.module("myApp", ["ngRoute"]);

myApp.controller("myCtrl", function ($scope) {});

myApp.controller("quizCtrl", function ($scope, $http) {
  $scope.list_subject = [];
  $http.get("db/Quizs/ADAV.js").then(function (reponse) {
    $scope.list_subject = reponse.data;
    console.log($scope.list_subject);
  });
});

myApp.controller("subjectCtrl", function ($scope, $http) {
  $scope.list_subject = [];
  $http.get("db/Subjects.js").then(function (reponse) {
    $scope.list_subject = reponse.data;
    console.log($scope.list_subject);
  });

  // function getListQuestion() {
  //   $scope.ListQuestion = [];
  //   $scope.currentQuestion = [];
  //   $scope.currentQuestion.push($scope.list_subject);
  //   $scope.currentQuestion.map((i) => {
  //     if ($scope.ListQuestion.length < 10) {
  //       var random = Math.random() * 10;
  //       $scope.ListQuestion.push($scope.currentQuestion[random]);
  //     }
  //   });
  // }
  $scope.begin = 0;
  $scope.pageCount = Math.ceil($scope.list_subject.length / 4);

  $scope.first = function () {
    $scope.begin = 0;
  };
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
  $scope.last = function () {
    $scope.begin = ($scope.pageCount - 1) * 4;
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

// Quiz
myApp.controller("quizCtrl", [
  "$scope",
  "$element",
  "$attrs",
  "quizFactory",
  function ($scope, $element, $attrs) {
    // Controller code here
    $scope.start = function () {
      $scope.inProgress = true;
      $scope.getQuestions();
    };
    $scope.reset = function () {
      $scope.inProgress = false;
    };
    $scope.reset();

    $scope.getQuestions = function () {
      // Kiểm tra nếu $scope.id đã được đặt giá trị
      if (angular.isDefined($scope.id)) {
        var quiz = quizFactory.getQuestions($scope.id);
        if (quiz) {
          $scope.question = quiz.Text;
          $scope.options = quiz.Answers;
          $scope.answer = quiz.AnswerId;
          $scope.marks = quiz.Marks;
        }
      } else {
        console.log("$scope.id is not defined.");
      }
    };

    $scope.checkAnswer = function () {
      if (!$('input[name="answer"]:checked').length) return;
      var ans = $('input[name="answer"]:checked').val();
      if (ans == $scope.answer) {
        alert("Đúng");
      } else {
        alert("Sai");
      }
    };
  },
]);

myApp.factory("quizFactory", function ($http) {
  var questions = [];
  $http.get("../db/Quizs/ADAV.js").then(function (res) {
    questions = res.data;
    // alert(questions.length);
  });
  return {
    getQuestions: function (id) {
      return questions[id];
    },
  };
});
