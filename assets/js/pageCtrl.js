var myApp = angular.module("myApp", ["ngRoute"]);
myApp.controller("myCtrl", function ($scope, $http, $rootScope, $location) {
  // subject control
  $scope.list_subject = [];
  $http.get("db/Subjects.js").then(function (response) {
    $scope.list_subject = response.data;
    console.log($scope.list_subject);
  });
  $scope.start = 0;
  $scope.pageSize = 4;

  $scope.prev = function () {
    if ($scope.start > 0) {
      $scope.start -= $scope.pageSize;
    }
  };
  $scope.next = function () {
    if ($scope.start < $scope.list_subject.length - $scope.pageSize) {
      $scope.start += $scope.pageSize;
    }
  };

  $http
    .get(`http://localhost:3000/listStudent`)
    .then(function (response) {
      $rootScope.listStudent = response.data;
      $scope.checkLoginStatus();
    })
    .catch(function (error) {
      // Handle error response
      console.error("Error changing password", error);
    });
  // end subject control
  $scope.logout = function () {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Đã đăng xuất",
      imageUrl: "https://design.duolingo.com/60aa5cd702b56a7a5e6b.svg",
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: "Custom image",
      showConfirmButton: false,
      timer: 1000,
      allowOutsideClick: false, // Không cho click ra ngoài
    });
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("isLoggedIn");
    window.location.href = "http://127.0.0.1:5502/index.html#!/signIn";
  };

  $rootScope.checkLoginStatus = function () {
    var storedUsername = sessionStorage.getItem("username");
    $rootScope.isLoggedIn = !!storedUsername;
    // Nếu đã đăng nhập, gán tên người dùng cho biến loggedInUser
    if ($rootScope.isLoggedIn) {
      $rootScope.getStudent = $scope.listStudent.find((s) => s.username === storedUsername);
    }
  };
});

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
        html:
          "<strong><span style='color: #58c002; font-size: 30px'>" +
          user.password +
          "</span></strong>",
        imageUrl: "https://design.duolingo.com/f432eb8c3e03de216d20.svg",
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: "Custom image",
        icon: "info",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
        allowOutsideClick: false, // Không cho click ra ngoài
      });
    } else {
      // Hiển thị SweetAlert với thông báo email không tồn tại
      Swal.fire({
        imageUrl: "https://design.duolingo.com/60aa5cd702b56a7a5e6b.svg",
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: "Custom image",
        title: "Email không tồn tại trong hệ thống",
        icon: "warning",
        confirmButtonText: "OK",
        allowOutsideClick: false, // Không cho click ra ngoài
      });
    }
  };
});

// Change password
myApp.controller("changePasswordCtrl", function ($scope, $http) {
  // Assume you have the user's email when they are logged in
  // Replace 'userLoggedInEmail' with the actual way you store the logged-in user's email
  if (sessionStorage.getItem("username") === null) {
    Swal.fire({
      title: "Bạn cần phải đăng nhập!!!",
      icon: "error",
      imageUrl: "https://design.duolingo.com/6b59833e80abfee5a4e0.svg",
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: "Custom image",
      confirmButtonText: "OK",
      confirmButtonColor: "#3085d6",
      allowOutsideClick: false, // Không cho click ra ngoài
    }).then((result) => {
      if (result.isConfirmed) {
        // Nếu người dùng ấn "OK", chuyển trang
        window.location.href = "http://127.0.0.1:5502/index.html#!/signIn";
      }
    });
  }

  $scope.changePassword = function () {
    // Check if passwords match
    if ($scope.newPassword !== $scope.confirmPassword) {
      Swal.fire({
        title: "Mật khẩu không khớp",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
    // Find the user with the provided email
    const user = $scope.listStudent.find((s) => s.email === $scope.getStudent.email);

    if (user) {
      // Prepare data to send to JSON Server
      const data = {
        id: user.id,
        username: user.username,
        password: $scope.newPassword,
      };

      // Assume that the JSON Server endpoint for changing passwords is different
      // Adjust the endpoint according to your JSON Server setup
      $http.patch(`http://localhost:3000/listStudent/` + data.id, data).then(function (response) {
        // Handle success response
        Swal.fire({
          title: "Đổi mật khẩu thành công",
          icon: "success",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            // Nếu người dùng ấn "OK", chuyển trang
            window.location.href = "http://127.0.0.1:5502/index.html#!/home";
          }
        });
      });
    }
  };
});

myApp.controller("subjectCtrl", function ($scope, $http) {});

myApp.config(function ($routeProvider) {
  $routeProvider
    .when("/home", {
      templateUrl: "assets/html/home.html",
    })
    .when("/subject", {
      templateUrl: "assets/html/subject.html",
      // controller: "subjectCtrl",
    })
    .when("/quiz/:idMH/:tenMH", {
      templateUrl: "assets/html/quiz.html",
      controller: "quizCtrl",
    })
    // .when("/account", {
    //   templateUrl: "assets/html/account.html",
    // })
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
    .when("/signIn", {
      templateUrl: "assets/html/login.html",
      controller: "loginCtrl",
    })
    .when("/signUp", {
      templateUrl: "assets/html/register.html",
      controller: "registerCtrl",
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

myApp.controller("registerCtrl", function ($scope, $http, $location) {
  $scope.genderOption = ["Nam", "Nữ"];
  $scope.selectGender = $scope.genderOption[0];
  $scope.postdata = function (event) {
    if ($scope.password !== $scope.confirmPassword) {
      Swal.fire({
        title: "Mật khẩu không khớp",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
    var data = {
      id: Math.random(),
      username: $scope.username,
      password: $scope.password,
      fullname: $scope.fullname,
      email: $scope.email,
      gender: $scope.gender == "Nam" ? "true" : "false",
      birthday: $scope.birthday,
      schoolfee: $scope.schoolfee,
      marks: $scope.marks,
    };
    console.log(data);
    $http.post("http://localhost:3000/listStudent", data).then(
      function (res) {
        Swal.fire({
          title: "Đăng ký thành công",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        }).then((result) => {
          // Nếu người dùng ấn OK
          if (result.isConfirmed) {
            // Thực hiện chuyển hướng hoặc hành động khác tại đây
            // window.location.href = "http://127.0.0.1:5502/index.html#!/signIn";
            $location.url("/signIn");
            $scope.$apply();
          }
        });
      },
      function (error) {
        Swal.fire({
          title: "Đăng ký thất bại",
          icon: "error",
        });
      }
    );
    event.preventDefault();
  };
});

// quiz
myApp.controller("quizCtrl", function ($scope, $http, $routeParams, $interval) {
  if (sessionStorage.getItem("username") === null) {
    Swal.fire({
      title: "Bạn cần phải đăng nhập!!!",
      icon: "warning",
      imageUrl: "https://design.duolingo.com/6b59833e80abfee5a4e0.svg",
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: "Custom image",
      confirmButtonText: "OK",
      confirmButtonColor: "#3085d6",
      allowOutsideClick: false, //Không cho click ra ngoài
    }).then((result) => {
      if (result.isConfirmed) {
        // Nếu người dùng ấn "OK", chuyển trang
        window.location.href = "http://127.0.0.1:5502/index.html#!/signIn";
      }
    });
  }
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
    // $scope.initSelected = null;
    // $scope.first = true;
    // $scope.last = false;
    $scope.historyQuestionRight = [];
    $scope.historyQuestionWrong = [];
    $scope.currentQuestionWrong = 0;
    $scope.time = 0;
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
  function getQuestions() {
    $http.get("db/Quizs/" + $scope.idMH + ".js").then(
      function (d) {
        $scope.caccauhoi = d.data;
        // $scope.caccauhoi.sort(() => Math.random() - 0.5);
        // console.log($scope.caccauhoi);
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
      console.log("Kết quả đúng: " + $scope.listOfRightAnswer);
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
    setTimeout(() => {
      $scope.$apply(function () {
        if ($scope.currentIndex < 9) {
          $scope.currentIndex += 1;
          getQuestion();
        } else {
          $scope.currentIndex = 0;
          getQuestion();
        }
      });
    }, 700);
    // console.log("localdata");
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
  $scope.countPoint = 0;
  $scope.handIn = () => {
    Swal.fire({
      title: "Nộp bài thành công!",
      imageUrl: "https://design.duolingo.com/266788168c5f135b35e3.svg",
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: "Custom image",
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    });
    var handInCheck = true;
    if (handInCheck) {
      var totalQuestions = $scope.listQuestions.length;
      var totalRightQuestions = $scope.listOfRightAnswer.length;
      $scope.totalPoint = (totalRightQuestions * 10) / totalQuestions;
      $scope.countPoint = totalRightQuestions; // Gán số câu đúng vào biến countPoint
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
    // $scope.timePerSec = Math.floor($scope.time / 10);
    // $scope.percent =
    //   (($scope.listQuestions.length -
    //     ($scope.listQuestions.length - $scope.listOfRightAnswer.length)) /
    //     $scope.listQuestions.length) *
    //     100 +
    //   "%";
    // console.log($scope.percent);
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
        getQuestions();
      }
    } else {
      getQuestions();
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
myApp.controller("loginCtrl", function ($scope, $http, $location, $rootScope) {
  $rootScope.isLoggedIn = false;
  $http.get("db/Students.json").then(
    function (d) {
      $scope.listStudent = d.data.listStudent;
    },
    function (error) {
      alert("Lỗi");
    }
  );

  $scope.login = function () {
    // $scope.currentUser = "";
    $rootScope.currentUser = $scope.username;

    for (var i = 0; i < $scope.listStudent.length; i++) {
      if (
        $scope.username == $scope.listStudent[i].username &&
        $scope.password == $scope.listStudent[i].password
      ) {
        $rootScope.getStudent = $scope.listStudent[i];
        sessionStorage.setItem("username", $scope.username);
        // Cập nhật loggedInUser khi đăng nhập
        $scope.loggedInUser = $scope.username;

        isLoggedIn = true;
        // // $location.path("/home");
        // sessionStorage.setItem("username", $scope.username);
        break;
      }
    }
    if (isLoggedIn) {
      Swal.fire({
        title: "Đăng nhập thành công",
        imageUrl: "https://design.duolingo.com/e69974f04b05dcf07f2a.svg",
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: "Custom image",
        icon: "success",
        // confirmButtonColor: "#3085d6",
        showConfirmButton: false,
        allowOutsideClick: false, // Không cho click ra ngoài
        html: `
    <div class="custom-html">
      Chuyển trang sau <b class="second"></b> giây.
    </div>
  `,
        timer: 2000,
        timerProgressBar: false,
        didOpen: () => {
          const timer = Swal.getPopup().querySelector("b");
          timerInterval = setInterval(() => {
            const remainingTime = Math.ceil(Swal.getTimerLeft() / 1000); // Chuyển đổi mili giây sang giây và làm tròn lên
            timer.textContent = remainingTime;
          }, 1000); // Cập nhật giá trị mỗi giây
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      });
      // Chờ 1 giây trước khi chuyển trang
      setTimeout(function () {
        window.location.href = "http://127.0.0.1:5502/index.html#!home";
      }, 2000);
      $rootScope.isLoggedIn = true;
      sessionStorage.setItem("isLoggedIn", $rootScope.isLoggedIn);
      $rootScope.getName = sessionStorage.getItem("username");
      $rootScope.student = $rootScope.getName;
    } else {
      Swal.fire({
        title: "Tên đăng nhập hoặc mật khẩu không đúng!",
        icon: "error",
      });
      $rootScope.isLoggedIn = false;
    }
    $scope.checkLoginStatus();
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
  $rootScope.isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
  // $rootScope.student = sessionStorage.getItem("username") === $rootScope.getName;
  if (sessionStorage.getItem("username") === $rootScope.getName) {
    $rootScope.student = $rootScope.getName;
  } else {
    $rootScope.student = sessionStorage.getItem("username");
  }
});
