app.controller('loginCtrl', function($rootScope, $scope, $location, $routeParams, $filter, $localStorage, cache, command) {

  $scope.login = function() {

    command.send('auth.login', { data: angular.extend($scope.query, {product: $scope.conf.app}), success: function(d) {
        if (d.code) {
          $scope.authtry++;
          $('.auth-problems').fadeOut().fadeIn();
        } else {
          $rootScope.my = d;
          $localStorage.my = d;

          cache('command').clear();

          command.send('rights.get_rightsMasks', {cache: true, success: function(d) {
            var res = {};

            // Свертка в структуру по OBJECT, ACTION
            d.rightsMasks.map(function(val) {
              res[val.object] = res[val.object] || {};
              res[val.object][val.action] = (res[val.object][val.action] || {}) | val.value;
            });
            res = {raw:d.rightsMasks, converted: res};
            $rootScope.rightsMasks = res;
            $localStorage.my.rightsMasks = res;

            // Редирект
            var redirect = '/';
            if ($routeParams.redirect) {
              redirect = $routeParams.redirect;
              delete $location.$$search.redirect;
            }

            $scope.safeApply(function() { $location.path(redirect); });
          }});
        }
      }});
  };
  $scope.authtry = 0;
  $scope.logo = $scope.conf.logo || ('/i/logo-' + $scope.conf.app + '.png');

  // Скрытие слоя, предотвращаеющего показ контента
  angular.element('#shader').hide();
});
