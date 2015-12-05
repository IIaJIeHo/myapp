angular.module("sportsStoreAdmin")
.constant("productUrl", "http://localhost:5500/products/")
.constant("regUrl", "http://localhost:5500/autoservices/")
.constant("respondUrl", "http://localhost:5500/responds/")
.constant("userUrl", "http://localhost:5500/users/")
.constant("fileupload", "http://localhost:5500/upload/")
.constant("autoUrl", "http://localhost:5500/autos/")
.config(function($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
})
.directive('ngConfirmClick', [
        function(){
            return {
                link: function (scope, element, attr) {
                    var msg = attr.ngConfirmClick || "Are you sure?";
                    var clickAction = attr.confirmedClick;
                    element.bind('click',function (event) {
                        if ( window.confirm(msg) ) {
                            scope.$eval(clickAction)
                        }
                    });
                }
            };
}])
.controller("productCtrl", function ($scope, $rootScope, $resource, $location, productUrl, regUrl, respondUrl, userUrl, autoUrl, Autos, Users, Autoservices, Responds, Requests) {

    $scope.productsResource = $resource(productUrl + ":id", { id: "@id" });
    $scope.RegResource = $resource(regUrl + ":id", { id: "@id" });
    $scope.RespondResource = $resource(respondUrl + ":id", { id: "@id" });
    $scope.UserResource = $resource(userUrl + ":id", { id: "@id" });
    $scope.AutoResource = $resource(autoUrl + ":id", { id: "@id" });
    $scope.allitems = true;
    $scope.toogleAutoservice = [];
    $scope.mainproduct = null;
    $scope.mainrespond = null;
    $scope.updatedRespond = null;
    $scope.products = null;
    $scope.autos = null;
    $scope.responds = null;
    $scope.users = null;
    $scope.myresponds = null;
    $scope.autoservices = null;
    $scope.autoservice = null;
    $scope.respondview = 1;
    $scope.texts = {};
    $scope.startEdit = false;
    $scope.loading = false; 
    $scope.requests = ['Заявка на ТО','Заявка на Ремонт','Кузовные работы'];
    $scope.texts.work = ['Контрольный осмотр',
        'Замена масла в двигателе (в каждом ТО)',
        'Замена масляного фильтра (в каждом ТО)',
        'Защита двигателя',
        'Замена салонного фильтра',
        'Замена передних тормозных колодок',
        'Замена задних тормозных колодок',
        'Замена передних тормозных дисков',
        'Замена задних тормозных дисков',
        'Замена свечей зажигания',
        'Замена тормозной жидкости', 
        'Замена топливного фильтра', 
        'Замена воздушного фильтра', 
        'Замена масла в коробке передач', 
        'Замена ремня ГРМ',
        'Помпа (замена)',
        'Охлаждающая жидкость (замена)'];
    $scope.texts.question = ['Масло в двигателе (замена)',
        'Масляный фильтр (замена)',
        'Масло в коробке передач (замена)', 
        'Сход-развал',
        'Свечи зажигания (замена)', 
        'Тормозные колодки (замена)', 
        'Тормозные диски (замена)', 
        'Тормозные барабаны (замена)', 
        'Топливный фильтр (замена)', 
        'Салонный фильтр (замена)', 
        'Заправка кондиционера', 
        'Тормозная жидкость (замена)', 
        'Охлаждающая жидкость (замена)', 
        'Жидкость гидроусилителя (ГУР) (замена)'];
        $scope.texts.diagnos = ['Контрольный осмотр',
        'Диагностика двигателя',
        'Диагностика коробки передач',
        'Диагностика подвески',
        'Диагностика электрики'];
        $scope.texts.engine = ['Замена масла',
        'Генератор',
        'Инжектор',
        'Кондиционер',
        'Маслосъемные колпачки (замена)',
        'Насос масляный',
        'Насос топливный', 
        'Помпа (замена)',
        'Радиатор',
        'Ремень ГРМ (замена)', 
        'Цепь ГРМ',
        'Свечи зажигания (замена)', 
        'Термостат (замена)',
        'Турбина',
        'Фильтр воздушный (замена)', 
        'Фильтр масляный (замена)',
        'Фильтр салона (замена)', 
        'Фильтр топливный (замена)', 
        'Форсунки'];
        $scope.texts.head = ['Амортизатор (замена)',
        'Втулка стабилизатора (замена)', 
        'Подшипник ступицы (замена)',
        'Пружина(замена)',
        'Рычаг передний(замена)', 
        'Рычаг задний (замена)', 
        'Сайлентблок переднего рычага (замена)', 
        'Сайлентблок заднего рычага (замена)', 
        'Стойка стабилизатора (замена)', 
        'Ступица (замена)', 
        'Тормозные колодки (замена)', 
        'Тормозные диски (замена)', 
        'Тормозные барабаны (замена)', 
        'Тормозная жидкость (замена)', 
        'Датчик ABS (замена)', 
        'Датчик ESP (замена)', 
        'Шаровые (замена)'];
        $scope.texts.wheel = ['Рулевая рейка',
        'Рулевая тяга (замена)', 
        'Наконечник рулевой тяги (замена)',
        'Жидкость гидроусилителя (замена)',
        'Насос гидроусилителя (замена)', 
        'Сцепление',
        'Шрус (замена)', 
        'Замена масла в коробке передач'];
        $scope.texts.addi = ['Тонировка',
        'Сигнализация (название в комментарии)',
        'Парктроник (описать в комментарии)', 
        'Химчистка салона',
        'Полировка', 
        'Противоугонный комплекс (описать в комментарии)',
        'Иммобилайзер (описать в комментарии)',
        'Защита картера (установка)', 
        'Отопитель двигателя (описать в комментарии)',
        'Шумоизоляция (описать в комментарии)'];
        $scope.texts.destructions = [{ title: 'Бампер', eng: 'bamper',
        data: ['Задний', 
        'Передний']},
        { title: 'Дверь', eng: 'dver',
        data: ['Задняя левая', 
        'Задняя правая', 
        'Передняя левая', 
        'Передняя правая']},
        { title: 'Зеркало боковое', eng: 'zerkalo',
        data: ['Левое', 
        'Правое']},
        { title: 'Крыло', eng: 'krilo',
        data: ['Переднее правое', 
        'Переднее левое' ,
        'Заднее правое' ,
        'Заднее левое']},
        { title:'Порог', eng: 'porog',
        data: ['Правый' ,
        'Левый']},
        { title:'Стекло', eng: 'steklo',
        data: ['Лобовое без датчика дождя(замена)' ,
        'Лобовое с датчиком дождя(замена)' ,
        'Лобовое ремонт скола' ,
        'Лобовое ремонт трещины' ,
        'Передней правой двери' ,
        'Передней левой двери' ,
        'Задней правой двери' ,
        'Задней левой двери' ,
        'Заднее']},
        { title:'Фара', eng: 'fara',
        data: ['Передняя правая' ,
        'Передняя левая']},
        { title:'Противотуманка', eng: 'tuman',
        data: ['Передняя правая',
        'Передняя левая' ,
        'Задняя']},
        { title:'Задний фонарь', eng: 'fonar',
        data: ['Правый' ,
        'Левый']}];
    $scope.metrostations = ['Авиамоторная','Автозаводская','Академическая','Александровский сад','Алексеевская','Алма-Атинская',
    'Алтуфьево','Аннино','Арбатская','Аэропорт','Бабушкинская','Багратионовская','Баррикадная','Бауманская','Беговая','Белорусская',
    'Беляево','Бибирево','Библиотека имени Ленина','Битцевский Парк','Борисово','Боровицкая','Ботанический сад','Братиславская',
    'Бульвар Адмирала Ушакова','Бульвар Дмитрия Донского','Бульвар Рокоссовского','Бунинская аллея','Варшавская','ВДНХ','Владыкино',
    'Водный стадион','Войковская','Волгоградский проспект','Волжская','Волоколамская','Воробьёвы горы','Выставочная','Выхино',
    'Деловой Центр','Динамо','Дмитровская','Добрынинская','Домодедовская','Достоевская','Дубровка','Жулебино','Зябликово','Измайловская',
    'Калужская','Кантемировская','Каховская','Каширская','Киевская','Китай-город','Кожуховская','Коломенская','Комсомольская','Коньково',
    'Котельники','Красногвардейская','Краснопресненская','Красносельская','Красные ворота','Крестьянская застава','Кропоткинская',
    'Крылатское','Кузьминки','Кунцевская','Курская','Кутузовская','Ленинский проспект','Лермонтовский проспект','Лесопарковая','Лубянка',
    'Люблино','Марксистская','Марьина Роща','Марьино','Маяковская','Медведково','Международная','Менделеевская','Митино','Молодёжная',
    'Мякинино','Нагатинская','Нагорная','Нахимовский проспект','Новогиреево','Новокосино','Новокузнецкая','Новослободская','Новоясеневская',
    'Новые Черёмушки','Октябрьская','Октябрьское Поле','Орехово','Отрадное','Охотный ряд','Павелецкая','Парк Культуры','Парк Победы',
    'Партизанская','Первомайская','Перово','Петровско-Разумовская','Печатники','Пионерская','Планерная','Площадь Ильича','Площадь Революции',
    'Полежаевская','Полянка','Пражская','Преображенская площадь','Пролетарская','Проспект Вернадского','Проспект Мира','Профсоюзная',
    'Пятницкое шоссе','Речной вокзал','Рижская','Римская','Рязанский проспект','Савёловская','Свиблово','Севастопольская','Семеновская',
    'Серпуховская','Славянский бульвар','Смоленская','Сокол','Сокольники','Спартак','Спортивная','Сретенский бульвар','Строгино','Студенческая',
    'Сухаревская','Сходненская','Таганская','Тверская','Театральная','Текстильщики','Тёплый Стан','Тимирязевская','Третьяковская','Тропарёво',
    'Трубная','Тульская','Тургеневская','Тушинская','Улица 1905 года','Улица Академика Янгеля','Улица Горчакова','Улица Скобелевская',
    'Улица Старокачаловская','Университет','Филёвский парк','Фили','Фрунзенская','Царицыно','Цветной бульвар','Черкизовская','Чертановская',
    'Чеховская','Чистые пруды','Чкаловская','Шаболовская','Шипиловская','Шоссе Энтузиастов','Щёлковская','Щукинская','Электрозаводская',
    'Юго-Западная','Южная','Ясенево'];
    function getCookie(name) {
      var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
      ));
      return matches ? decodeURIComponent(matches[1]) : undefined;
    }
    /*$scope.logout = function(){
        document.cookie = "userid='' path=/; expires=''";
        $rootScope.userid = null;
        $location.path("/login");
    } */
    $scope.logout = function(){
        $rootScope.userid = undefined;
        document.cookie = "autoid=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        $scope.listProducts();
    }
        $scope.formatDate = function(date) {
            if (date != undefined){
                 date = new Date(date);
              var hours = date.getHours();
              hours = hours < 10 ? '0'+hours : hours;
              var minutes = date.getMinutes();
              var seconds = date.getSeconds();
              minutes = minutes < 10 ? '0'+minutes : minutes;
              var strTime = hours + ':' + minutes;
              return date.getDate() + "." + (date.getMonth()+1) + "." + date.getFullYear() + " / " + strTime + "";               
            }
            else{
                return '';
            }
    }
    $scope.listProducts = function () {
        $scope.loading = true; 
        if ($rootScope.userid == undefined){
            $rootScope.userid = getCookie('autoid');
        }
        if ($rootScope.userid == undefined){
            $location.path("/login");
        }
        else{
           /* $scope.products = $scope.productsResource.query(function(data){
                $scope.autos = $scope.AutoResource.query(function(auto_data){
                    angular.forEach(data, function(value, key) {
                        value.type=$scope.requests[value.type - 1];
                        angular.forEach(auto_data, function(value_auto, key_auto) {
                            if (value.autoid == value_auto.id){
                                value.auto=value_auto;
                            }
                        });
                    });
                });
                $scope.responds = $scope.RespondResource.query(function(responds_data){
                     angular.forEach(data, function(value, key) {
                        value.responds = [];
                    angular.forEach(responds_data, function(value_res, key_res) {
                        if (value.id == value_res.productid){
                            value.responds.push(value_res);
                        }
                    });               
                });
            });       
            });*/
            if ($rootScope.products != null){
                $scope.autos = $rootScope.autos
                $scope.products = $rootScope.products; 
                $scope.responds = $rootScope.responds;
                $scope.myresponds = $rootScope.myresponds;
                $scope.users = $rootScope.users;
                $scope.autoservice = $rootScope.autoservice; 
                $scope.autoservices = $rootScope.autoservices;              
                console.log("from cache");
                $scope.loading = false;
            }
            else{
                Requests.query().then(function(data){
                $scope.products = data;
                Autos.query().then(function(auto_data){
                    $scope.autos = auto_data;
                    angular.forEach($scope.products, function(value, key) {
                    angular.forEach($scope.autos, function(value_auto, key_auto) {
                        if (value.autoid == value_auto._id.$oid){
                            value.auto=value_auto;
                        }
                    });
                    });
                    $rootScope.autos = $scope.autos;
                });
                Responds.query().then(function(responds_data){
                    $scope.responds = responds_data;
                    angular.forEach($scope.products, function(value, key) {
                        value.responds = [];
                        angular.forEach($scope.responds, function(value_res, key_res) {
                            if (value._id.$oid == value_res.productid){
                                value.responds.push(value_res);
                            }
                        });               
                });
                    console.log($scope.products);
                    $rootScope.responds = $scope.responds;
                    $scope.loading = false; 
            });
            $rootScope.products = $scope.products;    
            });
            Responds.query({ autoserviceid : $rootScope.userid }).then(function(responds_data){ $scope.myresponds = responds_data; $rootScope.myresponds = $scope.myresponds;}); /* ответы только на мою заявку сделать (добавить user_id и по нему выбирать)*/
            Users.query().then(function(users_data){ $scope.users = users_data; $rootScope.users = $scope.users;}); 

            Autoservices.getById($rootScope.userid).then(function(autoservice){
                console.log(autoservice);
                $scope.autoservice = autoservice;
                console.log($scope.autoservice);
                $rootScope.autoservice = $scope.autoservice;
            });

            Autoservices.query().then(function(autoservices){
                $scope.autoservices = autoservices;
                $rootScope.autoservices = $scope.autoservices;
                console.log($scope.autoservices);
                /*angular.forEach($scope.autoservices, function(value_auto, key_auto) {
                        console.log(value_auto);
                        if ($rootScope.userid == value_auto._id.$oid){
                            $scope.autoservice = value_auto;
                        }
                });*/
            });  
            console.log($rootScope.userid);    
            }
                      
        }

    }
        $('#navigation a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
    $('#reque2 a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });

    $scope.deleteProduct = function (product) {
        product.$remove().then(function () {
            $scope.products.splice($scope.products.indexOf(product), 1);
        });
    }

    $scope.createProduct = function (product) {
        product.userid=$rootScope.userid;
        console.log(product);
        $scope.loading = true; 
        new $scope.productsResource(product).$save().then(function (newProduct) {
            $scope.products.push(newProduct);
            $scope.editedProduct = null;
            $scope.loading = false; 
        });
    }

    $scope.editUser = function(user,passchange){
        $scope.loading = true; 
        var temp = user.password;
        if (passchange){
            $scope.autoservice.password = window.md5($scope.autoservice.password);
        }
        $scope.autoservice.$update().then(function(editeduser){
            $.ajax({ 
            type: "POST", 
            url: "https://mandrillapp.com/api/1.0/messages/send.json", 
            data: { 
            'key': 'SWwkrbd8NN0rJ54aAyYnZg', 
            'message': { 
            'from_email': 'info@carsbir.ru', 
            'to': [ 
            { 
            'email': user.email, 
            'name': user.username, 
            'type': 'to' 
            } 
            ], 
            'subject': 'Данные пользователя изменена', 
            'html': "Имя = " + user.name + "; Фамилия = " + user.surname + "; Телефон = "+user.phone+"; Пароль = " + temp, 
            } 
            }});
            $("#a-user-edit-profile").show();
            $("#a-user-edit-profile").fadeTo(5000, 500).slideUp(500, function(){
               $("#a-user-edit-profile").hide();
            });
            $scope.loading = false;  
        });
    }

    $scope.createRespond = function (respond) {
        $scope.loading = true; 
        var userofrequest, auto, responds, keepgoing = true;
        respond.autoserviceid=$rootScope.userid;
        respond.productid=$scope.mainproduct._id.$oid;
        respond.date = Date.now();
        console.log($scope.users);
        if ($scope.autoservice.number === undefined){
            $scope.autoservice.number = 0;
        }
        else{
            $scope.autoservice.number += 1;
        }
        respond.name = parseInt($scope.autoservice.phone.substring(4),10).toString(32) + "-" + (2000000 + $scope.autoservice.number);
        console.log(respond.name);
        angular.forEach($scope.users,function(value,key){
                console.log($scope.mainproduct.userid);
                if (keepgoing){
                    if (value._id.$oid== $scope.mainproduct.userid){
                        respond.phone = value.phone;
                        userofrequest = value;
                        keepgoing = false;
                    }                    
                }
            }); 
        console.log(respond);
        respond.viewed = false;
        var candirespond = new Responds(respond);
        candirespond.$save().then(function (newRespond) {
            newRespond.autoservice = $scope.autoservice;
             $scope.activeresponds.push(newRespond);
             $scope.myresponds.push(newRespond);
            $("#a-respond-new").show();
            $("#a-respond-new").fadeTo(5000, 500).slideUp(500, function(){
               $("#a-respond-new").hide();
            });
            $scope.editedRespond = {};
            $scope.mainproduct.replied = true;
            auto = $scope.mainproduct.auto;
            responds = $scope.mainproduct.responds;
            $scope.mainproduct.auto = [];
            $scope.mainproduct.responds = [];
            $scope.mainproduct.$update();
            $scope.mainproduct.auto = auto;
            $scope.mainproduct.responds = responds;
            $.ajax({ 
            type: "POST", 
            url: "https://mandrillapp.com/api/1.0/messages/send.json", 
            data: { 
            'key': 'SWwkrbd8NN0rJ54aAyYnZg', 
            'message': { 
            'from_email': 'info@carsbir.ru', 
            'to': [ 
            { 
            'email': userofrequest.email, 
            'name': userofrequest.username, 
            'type': 'to' 
            } 
            ], 
            'subject': 'На вашу заявку откликнулись', 
            'html': $scope.autoservice.username + " оставил заявку; Имя = "+respond.name+"; Описание = "+respond.description+"; Стоимость = " + respond.cost, 
            } 
            }});
            $scope.loading = false; 
        });
    }

    $scope.updateProduct = function (product) {
        product.date = Date.now();
        product.$update();
        $scope.editedProduct = null;
    }

    $scope.startEdit = function (product) {
        $scope.editedProduct = product;
    }
    $scope.predicate='date';
    $scope.reverse = true;
    $scope.order = function(predicate){
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    }

    $scope.updateRespond = function (respond) {
        $scope.loading = true; 
        $scope.updatedRespond = $scope.mainrespond;
        console.log($scope.responds.indexOf(respond));
        respond.autoservice = null;
        respond.$update().then(function(){
            $scope.respondview = 1;
            $("#a-respond-edit").show();
            $("#a-respond-edit").fadeTo(5000, 500).slideUp(500, function(){
               $("#a-respond-edit").hide();
            });
            $scope.loading = false;         
        });
        $scope.mainrespond = null;
    }
    $scope.isdeleteRespond = function(respond){
            swal({
              title: "Вы уверены?",
              text: "У вас не получится его восстановить!",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Да, удалить!",
              cancelButtonText: "Нет, я передумал!",
              closeOnConfirm: false,
              closeOnCancel: false
            },
            function(isConfirm){
              if (isConfirm) {
                $scope.deleteRespond(respond);
              } else {
                    swal("Ура", "Всё в порядке", "error");
              }
            });
    }
    $scope.deleteRespond = function (respond) {
        console.log(respond);
        $scope.updatedRespond = respond;
        respond.$remove().then(function () {
            $scope.myresponds.splice($scope.myresponds.indexOf(respond), 1);
            $scope.responds.splice($scope.responds.indexOf(respond), 1);
            swal("Удален!", "Ваша запись удалена", "success");
            $("#a-respond-delete").show();
            $("#a-respond-delete").fadeTo(5000, 500).slideUp(500, function(){
               $("#a-respond-delete").hide();
            }); 
        });
    }

    $scope.editRespond = function (respond,number) {
        $scope.mainrespond = respond;
        $scope.respondview = number;
    }

    $scope.viewRespond = function (respond,number) {
        $scope.respondview = number;
        $scope.mainrespond = respond;
        $scope.startEdit = false;
        angular.forEach($scope.products, function(value, key) {
            if (respond.productid == value._id.$oid){
                $scope.mainproduct = value;
                console.log($scope.mainproduct);
            }
        });
    }

    $scope.viewItem = function (product) {
        $scope.allitems = !$scope.allitems;
        $scope.mainproduct = product;
        $scope.startEdit = false;
        if (product){
            $scope.toogleAutoservice = [];
            $scope.activeresponds = [];
            angular.forEach($scope.responds, function(value, key) {
              if (value.productid == product._id.$oid){
                if (value.approved && $scope.mainproduct.phone == undefined){ /* Если заявка подтверждена, то отображаем телефон юзера*/                 
                    angular.forEach($scope.users, function(value1, key1){
                        console.log(value1._id.$oid+"value");
                        console.log(product.userid+"pro");
                        if (value1._id.$oid == product.userid){
                            console.log(value1.phone);
                            $scope.mainproduct.phone = value1.phone;
                        }
                    });
                }
                angular.forEach($scope.autoservices, function(value1, key1){
                    if (value1._id.$oid == value.autoserviceid){
                        value.autoservice = value1;
                    }
                });

                $scope.activeresponds.push(value);
                $scope.toogleAutoservice.push(false);
              }
            });           
        }
    }
    $scope.deleteItem = function (respond) {
        respond.$remove().then(function () {
            $scope.responds.splice($scope.responds.indexOf(respond), 1);       
        });
    }

    $scope.cancelEdit = function () {
        $scope.editedProduct = null;
    }

    $scope.listProducts();
});
