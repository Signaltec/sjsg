var conf, routes;
var app = angular.module("app",['ui.bootstrap','ngRoute','ngSanitize','templates','ngStorage','pasvaz.bindonce']);
var $$ = angular.element;

// Ручной старт приложения после загрузки конфига
$$(document).ready(function() {
  $.get('/conf.json', function (d) {
    conf = d;
    routes = d.routes;

    if (conf.transport.indexOf('ws:') != -1) {
      conf.transport_url = conf.transport;
      conf.transport = new WebSocket(conf.transport);
      conf.transport.onopen = function() { console.log("ВЕБСОКЕТ ОТКРЫТ из app.js"); };
    }
  
  var html = document.getElementsByTagName('html')[0];
  angular.bootstrap(html, ['app']); html.setAttribute('ng-app', 'app'); html.dataset.ngApp = 'app';

  }).fail(function(d) { console.log('Filed to load conf.json', d) });
});

// Контроллер верхнего уровня
app.controller("appCtrl", function($rootScope, $location, $window, $filter, $http, $route, $localStorage, cache, timeouts, command, keep, messagebox) {

  // Localstorage revision check → purge localstorage
  if (revision != $localStorage.revision) {
    var my = $localStorage.my;
    $localStorage.$reset();
    $localStorage.revision = revision;
    $localStorage.my = my;
  }

  $rootScope.safeApply = function(fn) {
    var phase = this.$root.$$phase;
    if(phase == '$apply' || phase == '$digest') {if(fn && (typeof(fn) === 'function')) fn();} else this.$apply(fn);
  };

  // Проверка на изменение содержимого элементов формы
  $rootScope.isUnchanged = function (model, master) {return angular.equals(model, master); };

  // Аутентификация
  $rootScope.auth = function() {
    if ($localStorage.my){
      command.send("auth.auth", { success: function() {
        // При успешной аутентификации проверяем текущий путь
        if (!$rootScope.thispage || $rootScope.thispage.length === 0) $location.path('/');
        angular.element('#shader').hide();  // при успешной аутентификации скрываем слой для показа контента
      }});
    } else {
      if ($location.path()!='/login') $location.path('/login');
    }
  };

  // Логаут
  $rootScope.logout = function() { command.send("auth.logout"); };

  // Скрывание вертикального меню
  $rootScope.toggleMenu = function() {
      ['#side','#layout','#hamburger'].forEach(function(el) {
        el = angular.element(document.querySelector(el));
        el.toggleClass('fullscreen');
    });
  }
  
  // Находит запись в routes, соотв. url в браузере
  $rootScope.find_in_routes = function () {
    function _match_url(url, item_url, count) {

      // если url совпал
      if (url == item_url) {
        return true;
      }

      // иначе - если есть ещё возможные параметры

      // слешей не может быть в конце, поэтому этот слеш отделяет саму страницу от пути к родительскому разделу
      // (откуда начинается последняя часть текущего url'а)
      var last_slash = url.lastIndexOf('/');

      if (count && last_slash) {
        // откусить последнюю часть текущего url'а и поискать без неё
        return _match_url(url.substr(0, last_slash), item_url, count - 1);
      }

      // если не осталось возможных параметров - не совпало
      return false;
    }

    var url = $location.path();

    // обрезать последний слеш
    if (url.charAt(url.length - 1) == '/' && url != '/') {
      url = url.substr(0, url.length - 1);
    }

    // Найти совпадающий маршрут
    for (var found = -1, index = 0, l = routes.length; index < l && found == -1; index ++) {
      if (_match_url(url, routes[index].url, routes[index].variables ? routes[index].variables.length : 0)) {found = index}
      if (conf.homepage && url == '/' && _match_url(conf.homepage, routes[index].url, routes[index].variables ? routes[index].variables.length : 0)) {found = index}
    }

    if (found>=0) {
      $rootScope.thispage = routes[found];
      $rootScope.thispage.pagetitle = $rootScope.thispage.title;

      $rootScope.parentpage = false;
      while (found>0) {
        if (url.has(routes[--found].url) && url!=routes[found].url) {
          $rootScope.parentpage = routes[found];
          break;
        }
      }
      //console.log('---',$rootScope.thispage.url,$rootScope.parentpage.url);
    } else {
      // Not found redirect to Error!
      if (url != '/error') $location.path('/error');
    }

  };

  $rootScope.scrollTop = function() {
    $window.scrollTo(0,0);
  }
  
  // Отработка окончания перехода на новый скрин
  $rootScope.$on('$routeChangeStart', function(scope, next, current) {

    $rootScope.scrollTop();
    
    // Скрываем контент отдельным слоем
    angular.element('#shader').show();

    // Формирование массива params
    $rootScope.params = (next) ? next.params : current.params;
    $rootScope.hash = $location.hash();

    $rootScope.find_in_routes();
    if ($rootScope.thispage) $rootScope.keep = keep.init($rootScope.thispage.origin);

    $rootScope.my = $localStorage.my;
    $rootScope.auth();  // при переходе по ссылкам внутри приложения перезагрузки app не происходит, аутентификация не вызывается
  });

  // Поиск значения в массиве rights_masks.raw в соотв. со значениями scope, object, action
  $rootScope.find_rights_mask =  function(object,action,scope) {
    var val = 0;
    $rootScope.rights_masks.raw.map(function(i) { if (i.scope == scope && i.action == action && i.object == object) {val = i.value; return;} });
    return val;
  };

  //Проверка прав пользователя
  $rootScope.check_rights = function (object,action,scope,rights) {
    if ($rootScope.rights_masks === null || $rootScope.rights_masks === undefined) {
      if ($location.path()!='/login') $location.path('/login'); else return false;
    }
    if (isset(scope) && isset(rights)) {
      return ($rootScope.find_rights_mask(object,action,scope) & rights);
    }
    else if (isset(scope)) {
      return ($rootScope.find_rights_mask(object,action,scope) & $rootScope.my.rights);
    }
    else {
      return (($rootScope.rights_masks && $rootScope.rights_masks.converted[object][action] & $rootScope.my.rights) != 0);
    }
  };

  //Проверка прав пользователя для объекта принадлежащего конкретному пользователю
  $rootScope.check_rights_by_id = function (object,action,id) {
    if ($rootScope.find_rights_mask(object,action,'GLOBAL') & $rootScope.my.rights) return true;
    if ($rootScope.find_rights_mask(object,action,'GROUP') & $rootScope.my.rights) return ($rootScope.my.same_group_users.indexOf(id) != -1)
    if ($rootScope.find_rights_mask(object,action,'PERSONAL') & $rootScope.my.rights) return ($rootScope.my.id == id)
    return false
  };

  // Init -------------------------------------------------------
  $rootScope.browser = {};
  if (isIE()) {
    $rootScope.browser.type = 'IE';
    if (IEVersion()<11) $location.path('/badbrowser');
  }

  command.set_transport(conf.transport);

  $rootScope.now = new Date();
  $rootScope.conf = conf;
  $rootScope.routes = routes;
  $rootScope.lang = conf.lang || 'ru';
  $rootScope.dict = i18n[$rootScope.lang];
  $rootScope.email = conf.app+'.support@t-argos.ru';
  $rootScope.messagebox = messagebox;

  $rootScope.my = $localStorage.my;
  if ($rootScope.my) $rootScope.rights_masks = $localStorage.my.rights_masks;
  $rootScope.find_in_routes();

  // cache('command');
});

//  Angular роутинг --------------------------------------------------------------

app.config(function ($routeProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {
  $locationProvider.html5Mode(true);

  routes.forEach(function(i) {

    i.origin = i.url;
    var virt = i.url.indexOf('/*') > 0;
    i.url = i.url.replace('/*','');

    // turn variables to array or angular-string
    if (i.variables) i.variables = i.variables.split(/[\s]*,[\s]*/);

    // шаблон
    var filename = ((i.url == '/') ? 'index' : i.url.substr(1) ) + '.html';

    // страница
    var page = { templateUrl: i.template || filename };

    // controller страницы
    if (isset(i.controller)) page.controller = i.controller;

    if (!virt && i.url.indexOf('.pdf') == -1) {
      $routeProvider.when(i.url, page);
      if (i.url == conf.homepage) $routeProvider.when("/", page);
    }

    // задать url'ы страницы с учётом переменных
    if (i.variables) {
      var variables_in_path = '';
      i.variables.forEach(function(variable) {
        variables_in_path += '/:' + variable;
        $routeProvider.when(i.url + variables_in_path, page);
        if (i.url == conf.homepage) {
          $routeProvider.when("/" + variables_in_path, page);
        }
      });
    }

  });


});

function fallback(d, fileName) {
  console.log(fileName, d.status, d.responseText );
}

// Configure triggers for tooltips
app.config(['$tooltipProvider', function($tooltipProvider){
  $tooltipProvider.setTriggers({
    'mouseenter': 'mouseleave',
    'click': 'mouseleave',  // instead of 'click': 'click'
    'focus': 'blur'
  });
}]);