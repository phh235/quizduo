var myApp = angular.module("myApp", ["ngRoute"]);
myApp.controller("myCtrl", function ($scope, $http) {});

myApp.controller("forgotCtrl", function ($scope, $http) {
  $scope.listStudent = [];

  // Lấy dữ liệu sinh viên từ file JSON
  $http.get("db/Students.json").then(
    function (response) {
      $scope.listStudent = response.data.listStudent;
    },
    function (error) {
      console.error("Lỗi khi lấy dữ liệu sinh viên:", error);
    }
  );

  // Hàm xử lý khi nhấn nút "Xác nhận"
  $scope.forgot = function () {
    console.log("Email:", $scope.email);

    // Tìm sinh viên có email trùng khớp
    const user = $scope.listStudent.find((s) => s.email === $scope.email);

    if (user) {
      // Hiển thị SweetAlert với thông báo password
      Swal.fire({
        title: "Mật khẩu của bạn là:",
        text: user.password,
        icon: "info",
        confirmButtonText: "OK",
      });
    } else {
      // Hiển thị SweetAlert với thông báo email không tồn tại
      Swal.fire({
        title: "Email không tồn tại trong hệ thống",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
});

// Change password
myApp.controller("changePasswordCtrl", function ($scope, $http) {
  // Assume you have the user's email when they are logged in
  // Replace 'userLoggedInEmail' with the actual way you store the logged-in user's email
  $scope.email = "userLoggedInEmail";

  $scope.changePassword = function () {
    // Check if passwords match
    if ($scope.newPassword !== $scope.confirmPassword) {
      // Handle password mismatch
      console.log("Passwords do not match");
      return;
    }

    // Find the user with the provided email
    const user = $scope.listStudent.find((s) => s.email === $scope.email);

    if (user) {
      // Prepare data to send to JSON Server
      const data = {
        username: user.username,
        currentPassword: $scope.currentPassword,
        newPassword: $scope.newPassword,
      };

      // Assume that the JSON Server endpoint for changing passwords is different
      // Adjust the endpoint according to your JSON Server setup
      $http
        .put(`http://localhost:3000/changePasswordEndpoint`, data)
        .then(function (response) {
          // Handle success response
          console.log("Password changed successfully");
        })
        .catch(function (error) {
          // Handle error response
          console.error("Error changing password", error);
        });
    } else {
      // Handle case where email is not found in listStudent
      console.log("Email not found in listStudent");
    }
  };
});



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
    .when("/quiz/:idMH/:tenMH", {
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
    .when("/forgot", {
      templateUrl: "assets/html/forgot.html",
    })
    .when("/change", {
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

// quiz
myApp.controller("quizCtrl", function ($scope, $http, $routeParams, $interval) {
  $scope.caccauhoi = [];
  $scope.idMH = $routeParams.idMH;
  $scope.tenMH = $routeParams.tenMH;
  $scope.start = 0;
  $scope.time = 0;
  implement();
  getData();

  function implement() {
    $scope.listQuestions = [];
    $scope.questions = [];
    $scope.selectedButton = [];
    $scope.listOfRightAnswer = [];
    $scope.listQuestions = [];
    $scope.currentIndex = 0;
    $scope.totalQuestions = 0;
    $scope.initSelected = null;
    $scope.first = true;
    $scope.last = false;
    $scope.historyQuestionRight = [];
    $scope.historyQuestionWrong = [];
    $scope.currentQuestionWrong = 0;
    $scope.timePerSec = 0;
    $scope.time = 0;
    $scope.percent;
    $scope.show = false;
  }
  $scope.next = function () {
    $scope.currentIndex += 1;
    if ($scope.currentIndex > $scope.listQuestions.length - 1) {
      $scope.currentIndex = 0;
    }
    getQuestion();
  };
  $scope.prev = function () {
    $scope.currentIndex -= 1;
    if ($scope.currentIndex < 0) {
      $scope.currentIndex = $scope.listQuestions.length - 1;
    }
    getQuestion();
  };
  function getApi() {
    $http.get("db/Quizs/" + $scope.idMH + ".js").then(
      function (d) {
        $scope.caccauhoi = d.data;
        $scope.caccauhoi.map((item) => {
          if ($scope.listQuestions.length < 10) {
            var random = Math.floor(Math.random() * $scope.caccauhoi.length);
            var flag = false;
            if ($scope.listQuestions.length == 0) {
              $scope.listQuestions.push($scope.caccauhoi[random]);
            } else {
              $scope.listQuestions.map((i) => {
                if (i.Id == random) {
                  flag = true;
                }
              });
              if (flag == false) {
                $scope.listQuestions.push($scope.caccauhoi[random]);
              }
            }
          }
        });
        $scope.totalQuestions = $scope.questions.length;
        $scope.currentQuestion = $scope.listQuestions[$scope.currentIndex];
        console.log($scope.currentQuestion);
        $scope.rightAnswer = $scope.currentQuestion.AnswerId;
        $scope.idOfCurrentQuestion = $scope.currentQuestion.Id;
        $scope.handed = false;
        $scope.newTime();
      },
      function (d) {
        alert("Lỗi");
      }
    );
  }
  function getQuestion() {
    $scope.currentQuestion = $scope.listQuestions[$scope.currentIndex];
    $scope.rightAnswer = $scope.currentQuestion.AnswerId;
    $scope.idOfCurrentQuestion = $scope.currentQuestion.Id;
    $scope.selectedButton.map((item) => {
      if (item.id === $scope.idOfCurrentQuestion) {
        $scope.selectedElement = item.answer;
      }
    });
  }
  $scope.selected = function (select) {
    $scope.isAnswerCorrect = $scope.rightAnswer === select;
    var answers = document.getElementById(select);
    var allAnswer = document.getElementsByClassName("service-item");
    // if ($scope.isAnswerCorrect) {
    //     answers.style.transition = 'background-color 0.3s';
    //     answers.style.backgroundColor = '#65B741';
    // } else {
    //     answers.style.transition = 'background-color 0.3s';
    //     answers.style.backgroundColor = '#D71313';
    // }
    if ($scope.selectedButton.length === 0) {
      $scope.selectedButton.push({ id: $scope.idOfCurrentQuestion, answers: select });
    } else {
      var checkAnswer = false;
      $scope.selectedButton.map((i, index) => {
        if (i.id === $scope.idOfCurrentQuestion) {
          checkAnswer = true;
          $scope.selectedButton[index].id = $scope.idOfCurrentQuestion;
        }
      });
      if (checkAnswer == false) {
        $scope.selectedButton.push({ id: $scope.idOfCurrentQuestion, answers: select });
      }
    }
    if ($scope.isAnswerCorrect) {
      if ($scope.listOfRightAnswer.length === 0 || $scope.listOfRightAnswer.length < 10) {
        $scope.listOfRightAnswer.push(select);
      } else {
        var checkAnswer = false;
        $scope.listOfRightAnswer.map((i) => {
          if (i === select) {
            checkAnswer = true;
          }
        });
        if (checkAnswer == false) {
          $scope.listOfRightAnswer.push(select);
        }
      }
    } else {
      $scope.listOfRightAnswer.map((item, index) => {
        if (item === $scope.rightAnswer) {
          $scope.listOfRightAnswer.splice(index, 1);
        }
      });
      console.log("kq dung: " + $scope.listOfRightAnswer);
    }
    var yourAnswer = $scope.handleAnswer(select, $scope.rightAnswer);
    const localData = JSON.parse(localStorage.getItem($scope.idMH));

    if (localData) {
      var existingIndex = localData.findIndex((x) => x.questionId == $scope.idOfCurrentQuestion);
      console.log(existingIndex);
      if (existingIndex !== -1) {
        localData[existingIndex] = {
          questionId: $scope.idOfCurrentQuestion,
          answers: select,
          check: yourAnswer,
        };
      } else {
        localData.push({
          questionId: $scope.idOfCurrentQuestion,
          answers: select,
          check: yourAnswer,
        });
      }
      $scope.saveToLocal($scope.idMH, localData);
    } else {
      const firstAnswer = [
        {
          questionId: $scope.idOfCurrentQuestion,
          answers: select,
          check: yourAnswer,
        },
      ];
      $scope.saveToLocal($scope.idMH, firstAnswer);
    }

    console.log("localdata");
    console.log(localData);
  };
  $scope.handleAnswer = (answer, rightAnswer) => {
    let checkAnswer = false;
    if (answer === rightAnswer) {
      checkAnswer = true;
    }
    return checkAnswer;
  };
  $scope.saveToLocal = (key, Obj) => {
    const myJSON = JSON.stringify(Obj);
    localStorage.setItem(key, myJSON);
  };
  $scope.handIn = () => {
    Swal.fire({
      position: "middle",
      icon: "success",
      title: "Nộp bài thành công!",
      showConfirmButton: false,
      timer: 1500,
    });
    var handInCheck = true;
    if (handInCheck) {
      var totalQuestions = $scope.listQuestions.length;
      var totalRightQuestions = $scope.listOfRightAnswer.length;
      $scope.totalPoint = (totalRightQuestions * 10) / totalQuestions;
      $scope.handed = true;
      $interval.cancel($scope.intervalTime);
      var localdata = JSON.parse(localStorage.getItem($scope.idMH));
      console.log(localdata);
      if (localdata) {
        localdata.push({
          handed: true,
          score: $scope.totalPoint,
          time: $scope.renderTime,
          answers: $scope.listQuestions,
        });
        $scope.saveToLocal($scope.idMH, localdata);
      }
    }
    $scope.historyQuestion = localdata.find((item) => {
      return item.handed === true;
    });
    console.log($scope.historyQuestion);
    localdata.forEach((item) => {
      if (item.check === true) {
        $scope.historyQuestionRight.push(item);
      } else {
        $scope.historyQuestionWrong.push(item);
      }
    });
    console.log($scope.historyQuestionRight);
    console.log($scope.historyQuestionWrong);
    $scope.currentQuestionWrong = $scope.historyQuestionWrong.length - 1;
    $scope.historyAnyQuestion = localdata.filter((item) => item.questionId);
    $scope.timePerSec = Math.floor($scope.time / 10);
    $scope.percent =
      (($scope.listQuestions.length -
        ($scope.listQuestions.length - $scope.listOfRightAnswer.length)) /
        $scope.listQuestions.length) *
        100 +
      "%";
    console.log($scope.percent);
  };
  $scope.again = () => {
    localStorage.removeItem($scope.idMH);
    getData();
    $scope.handed = false;
    $scope.show = false;
    implement();
  };
  function getData() {
    let localData = JSON.parse(localStorage.getItem($scope.idMH));
    if (localData) {
      let flag = false;
      localData.find((item) => {
        if (item.handed === true) {
          flag = true;
          $scope.handed = true;
          $scope.totalPoint = item.score;
          $scope.renderTime = item.time;
        }
      });
      if (flag === false) {
        getApi();
      }
    } else {
      getApi();
    }
  }
  $scope.showAnswer = () => {
    var localdata = JSON.parse(localStorage.getItem($scope.idMH));
    if (localdata) {
      $scope.show = true;
    } else if ($scope.show) {
      $scope.show = false;
    } else {
      $scope.show = true;
    }
  };
  $scope.newTime = () => {
    //15 minute
    $scope.intervalTime = $interval(function () {
      $scope.time++;
      $scope.timeHanded = 900 - $scope.time;
      if ($scope.timeHanded === 0) {
        alert("Over time");
      }
      $scope.timeHanded = new Date($scope.timeHanded * 1000).toISOString().substr(14, 5);
      $scope.renderTime = new Date($scope.time * 1000).toISOString().substr(11, 8);
    }, 1000);
  };
});

// login
myApp.controller("loginCtrl", function ($scope, $http, $location) {
  $scope.listStudent = [];
  $scope.getStudent = {};
  $scope.isLoggedIn = false;
  $scope.loggedInUser = "";

  $http.get("db/Students.json").then(
    function (d) {
      $scope.listStudent = d.data.listStudent;
    },
    function (error) {
      alert("Lỗi");
    }
  );

  var checkLoginStatus = function () {
    var storedUsername = sessionStorage.getItem("username");
    $scope.isLoggedIn = !!storedUsername;

    // Nếu đã đăng nhập, gán tên người dùng cho biến loggedInUser
    if ($scope.isLoggedIn) {
      $scope.loggedInUser = storedUsername;
    }
  };

  checkLoginStatus();

  $scope.login = function () {
    var isLoggedIn = false;
    for (var i = 0; i < $scope.listStudent.length; i++) {
      if (
        $scope.username == $scope.listStudent[i].username &&
        $scope.password == $scope.listStudent[i].password
      ) {
        $scope.getStudent = $scope.listStudent[i];
        sessionStorage.setItem("username", $scope.username);

        // Cập nhật loggedInUser khi đăng nhập
        $scope.loggedInUser = $scope.username;

        isLoggedIn = true;
        // $location.path("/home");
        sessionStorage.setItem("username", $scope.username);
        break;
      }
    }
    if (isLoggedIn) {
      Swal.fire({
        title: "Đăng nhập thành công",
        icon: "success",
      }).then((result) => {
        if (result.isConfirmed) {
          // Nếu người dùng ấn "OK", chuyển trang
          window.location.href = "after-login.html";
        }
      });
    } else {
      Swal.fire({
        title: "Tên đăng nhập hoặc mật khẩu không đúng!",
        icon: "error",
      });
    }
    console.log("isLoggedIn:", isLoggedIn);
  };

  $scope.logout = function () {
    sessionStorage.removeItem("username");
    $scope.loggedInUser = "";
    checkLoginStatus();
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
