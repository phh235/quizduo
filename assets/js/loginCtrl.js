var app = angular.module("loginApp", []);

app.controller("loginController", function ($scope, $http, $window) {
  $scope.user = {}; // Khởi tạo object user để lưu trữ dữ liệu từ form

  $scope.users = [];

  $http
    .get("db/account.json")
    .then(function (response) {
      $scope.users = response.data.account || [];
    })
    .catch(function (error) {
      console.error("Không thể đọc dữ liệu tài khoản", error);
    });

  $scope.login = function () {
    var found = false;
    for (var i = 0; i < $scope.users.length; i++) {
      if (
        $scope.users[i].username === $scope.user.username &&
        $scope.users[i].password === $scope.user.password
      ) {
        found = true;
        localStorage.setItem("currentUser", JSON.stringify($scope.users[i]));
        $window.location.href = "/test";
        return;
      }
    }
    if (!found) {
      alert(
        "Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin đăng nhập!"
      );
    }
  };
});
