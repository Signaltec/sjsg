# sjsg / Signaltech Javascript Style Guide


## Содержание
  1. [Принципы](#объекты)
  1. [Форматирование](#объекты)
  1. [Комментарии](#объекты)
  1. [Имена](#объекты)
  1. [Строки](#объекты)
  1. [Массивы](#объекты)
  1. [Функции](#объекты)
  1. [И ещё](#объекты)
  1. [Использование](#объекты)

## Принципы

  - Используйте краткие формы — как можно коротко, но не короче

    ```javascript
    // плохо
    var o = new Object();
    var a = new Array();
    
    i = ParseInt(a[1], 10);
    b = Boolean(a[1]);
    c = i + b;
    c.toString();

    // хорошо
    var o = {};
    var a = [];

    i = +a[1];
    b = !!a[1];
    c = '' + i + b;
    ```

## Форматирование

  - Используйте для отступов двойной пробел.

  - Оставляйте пустую строку в конце файла
  
    ```javascript
    (function() {
    
    })();
    ↵
    ```

  - Оставляйте пустую строку между блоками
  
    ```javascript
    // плохо
    var obj = {
      name: function() {
      
      },
      type: 'query'
    };
    if () {
      return obj;
    }
    good();

    // хорошо
    var obj = {
      name: function() {
      
      },
      
      type: 'query'
    };

    if () {
      return obj;
    }
    
    good();    
    ```

  - Всегда ставьте точку с запятой, исключения — декларация функции и блочные элементы (if, while …)

    ```javascript
    // хорошо
    function good() {
      return 'Super';
    }

    var o = {};
    var a = [];
    ```
    
  - Фигурные скобки
  
    ```javascript
    // плохо
    function good() 
    {
      return 'Super';
    }

    if (true) 
    {
    
    } else { }

    // хорошо
    function good() {
      return 'Super';
    }
    
    if (true) {
    
    } else {
    
    }

    // можно
    function good() { return 'Super'; }
    ```

  - Пробелы. Используйте одинарные пробелы в выражениях и между фигурными скобками
    ```javascript
    // плохо
    var a=1;

    var b  =a+1;

    function good (){
      return 'Super';
    }

    if (true){
      a =1;
    }else{a=0;}

    // хорошо
    var a = 1;

    var b = a + 1;

    function good() {
      return 'Super';
    }

    if (true) {
      a = 1;
    } else {
      a = 0;
    }
    ```
    
  - Запятые и отступы в декларации. Используйте запятые после а не перед декларацией

    ```javascript
    // плохо
    var iAm = {
        firstName: 'Ildar'
      , lastName: 'Gal'
      , age: 36
    };

    var iAm = {
        firstName:  'Ildar',
        lastName:   'Gal',
        age:        36
    };

    // хорошо
    var iAm = {
        firstName: 'Ildar',
        lastName: 'Gal',
        age: 36
    };
    ```
    

## Комментарии

  - Используйте  `/* ... */` для многострочных и `//` для однострочных комментариев.

  - Не пишите комментарии инлайн

  - Отбивайте комментарии пустой строкой сверху

    ```javascript
    // плохо    
    var true = false;  // наебал
    
    function do(what) {
      var a = 1;
      // blah-blah
      var b = what || '';

      return b;
    }

    // хорошо
    // Наебал
    var true = false;

    function do(what) {
      var a = 1;
      
      // blah-blah
      var b = what || '';

      return b;
    }
    ```


## Имена

  - Не используйте в качестве имёна зарезервированные слова: array, arguments, call, apply, class, default…

  - Всегда используйте var при декларации переменных;
  
  - Одна переменная — один var, не используйте запятую при декларации;

  - Неинициализированные переменные объявляйте в конце;

  - Объявляйте переменные вверху скоупа:

    ```javascript
    // плохо
    a = [];
    
    var b = 12, x, c = 1;
    
    function do() {
      …
      var n = 12;
      …
    }

    function do() {
      var n = yoyo();
      if (!arguments.length) {
        return false;
      }
      …
    }

    // хорошо
    var a = [];
    
    var b = 12
    var c = 1;
    var x;

    function do() {
      var n = 12;
      …
    }

    function do() {
      if (!arguments.length) {
        return false;
      }
      var n = yoyo();
      …
    }
    ```

  - Делайте так: переменные в camelCase, константы в UPPER_CASE, классы и конструкторы в PascalCase.
  
  - Если придётся — используйте подходящие синонимы, а не транслит
  
    ```javascript
    // плохо
    var MYOBJect = {};
    var moe_imya_eto = 'Vasya';
    var my_Konstanta = 11;
    var user = new user();

    // хорошо
    var myObject = {};
    var myNameIs = 'Vasya';
    var MY_CONSTANT = 11;
    var user = new User();
    ```

  - Используйте ведущее подчеркивание `_` для приватных свойств

    ```javascript
    this._secret = 'qwerty';
    ```

  - Для сохранения ссылки на this используйте self, всегда в самом начале

    ```javascript
    // плохо
      var _this = this;

    // хорошо
      var self = this;
    ```


## Строки

  - Используйте одинарные кавычки, конкатинируйте длинные строки 

    ```javascript
    // плохо
    var name = "Vasya";

    var longStr = "Note that in the 3d example, '3d' had to be quoted. It's possible to quote the JavaScript array indexes as well (e.g., years['2'] instead of years[2]), although it's not necessary.";

    var longStr = "Note that in the 3d example, '3d' had to be quoted. \
    Possible to quote the JavaScript array indexes as well (e.g.,  \
    years['2'] instead of years[2]), although it's not necessary. The 2 \";

    // хорошо
    var name = 'Vasya';

    var longStr = 'Note that in the 3d example, '3d' had to be quoted.' +
      'Possible to quote the JavaScript array indexes as well (e.g., ' +
      'years['2'] instead of years[2]), although it's not necessary. The 2';
    ```


## Массивы

  - Используйте push, map, forEach, filter, some, every, slice

    ```javascript
    var a = [];
    
    // плохо
    a[a.length] = 12;
    
    for (i = 0; i < a.length; i++) {
      a[i] = a[i] + 1;
    }
    
    var s = '<ul>';
    for (i = 0; i < a.length;i++) s+= '<li>' + a[i] '</li>';
    s += '</ul>';

    var b = [];
    for (i = 0; i < a.length; i++) {
      if (a[i] > 0) b[i] = a[i];
    }

    var aCopy = [];
    for (i = 0; i < a.length; i++) {
      aCopy[i] = a[i];
    }

    // хорошо
    a.push(12);
    
    a.forEach(function(i) {i += 1;});
    
    var s = '<ul><li>' + items.join('</li><li>') + '</li></ul>';
    
    var aCopy = a.slice();

    var b = a.filter(function(i) { return i>0; });

    // чтобы получить массив свойств
    var obj = {a: 1, b: 2};
    var args = Array.prototype.slice.call(obj.keys);
    ```

## Функции

  - Декларируйте функции сверху
  
  - Не декларируйте функции в блоках

    ```javascript
    // плохо
    if (true) {
      function good() {

      }
    }
    ```

  - Для изоляции кода и замыканий используйте IIFE
  
    ```javascript
    (function() {
      
    })();
    ```


## Операции сравнения

  - Используйте точное сравнение `===`, `!==` вместо `==`, `!=`.

  - Используйте краткую запись:
  
    ```javascript
    // плохо
    if (name != '') {

    }

    if (a.length > 0) {

    }

    // хорошо
    if (name) {

    }

    if (a.length) {

    }
    ```

  - Помните об автоматическом приведении типов:

    + {}, [] == true
    + null, undefined == false
    + +0, -0, NaN == false
    + '' == false


## И ещё

  - Coffescript — да на сервере, нет на клиенте.

  - Bootstrap — нет. Используйте вместо него sega2.

  - jQuery — нет.

  - Object.defineProperty — да.

  - eval() — нет.

  - with() — нет.
  
  - Вместо delete используй this.foo = null, там где возможно. Это быстрее работает.

  
  - Сеттеры и геттеры — нет

    ```javascript
    // плохо
    var name = user.getName();
    user.setName('Vasya');

    // хорошо
    var name = user.name();
    user.name('Vasya');
    ```

## Использование из консоли

  - Скопируйте в корень проекта файлы linters/signaltech.jscs.json, linters/signaltech.jshintrc 
  
  - Переименуйте signaltech.jshintrc в .jshintrc

  - Установите jscs и jshint

  ```
  npm install jscs -g
  npm install jshint -g
  ```

  - Запустите проверку

  ```
    jshint /src/app.js --config
    jscs /src/app.js --config
  ```


## Copyleft 

Signaltech, 2015

