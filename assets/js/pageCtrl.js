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
      templateUrl: "assets/html/subject.html",
      controller: "subjectCtrl",
    })
    .when("/quiz/:subjectId/:subjectName", {
      templateUrl: "assets/html/quiz.html",
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
      controller: "loginCtrl",
    })
    .when("/signIn", {
      templateUrl: "assets/html/login.html",
    })
    .when("/signUp", {
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

myApp.controller("registerCtrl", function ($scope, $http) {
  $scope.postdata = function (data) {
    var data = {
      username: $scope.username,
      password: $scope.password,
      fullname: $scope.fullname,
      email: $scope.email,
      gender: $scope.gender,
      birthday: $scope.birthday,
      schoolfee: "0",
      marks: "0",
      id: Math.random(),
    };
    $http.post("http://localhost:3000/listStudent", data).then(
      function (res) {
        Swal.fire({
          title: "Đăng ký thành công",
          icon: "success",
        }).then(function () {
          // Chuyển hướng sau khi người dùng ấn OK
          window.location.href = "http://127.0.0.1:5502/index.html#!/signIn";
        });
      },
      function (error) {
        Swal.fire({
          title: "Đăng ký thất bại",
          icon: "error",
        });
      }
    );
  };
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

// quiz
myApp.controller("quizCtrl", function ($scope, $http, $routeParams) {
  $scope.caccauhoi = [];
  $scope.subjectId = $routeParams.subjectId;
  $scope.subjectName = $routeParams.subjectName;
  $scope.start = 0;
  $scope.next = function () {
    if ($scope.start < 0) $scope.start = 0;
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

// login
myApp.controller("loginCtrl", function ($scope, $http) {
  $scope.listStudent = [];
  $scope.getStudent = {};
  var check = false;

  $http.get("db/Students.json").then(
    function (d) {
      $scope.listStudent = d.data.listStudent;
    },
    function (error) {
      alert("Lỗi");
    }
  );
  $scope.login = function () {
    for (var i = 0; i < $scope.listStudent.length; i++) {
      if (
        $scope.username == $scope.listStudent[i].username &&
        $scope.password == $scope.listStudent[i].password
      ) {
        $scope.getStudent = $scope.listStudent[i];
        check = true;
      }
    }
    if (check) {
      Swal.fire({
        title: "Đăng nhập thành công",
        icon: "success",
      }).then(function () {
        // Chuyển hướng sau khi người dùng ấn OK
        window.location.href = "after-login.html";
      });
    } else {
       Swal.fire({
         title: "Tên đăng nhập hoặc mật khẩu không đúng!",
         icon: "error",
       });
    }
    console.log($scope.listStudent);
  };
});

// nav menu
document.addEventListener("DOMContentLoaded", function () {
  var navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      // Đặt màu cho tất cả nav-link về màu mặc định
      navLinks.forEach(function (otherLink) {
        otherLink.style.color = "#000"; // Đặt màu theo mong muốn
      });

      // Đặt màu cho nav-link được kích hoạt
      link.style.color = "#58cc02"; // Đặt màu mới khi nav-link được kích hoạt
    });
  });
});
