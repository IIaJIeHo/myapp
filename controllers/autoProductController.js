angular.module("sportsStoreAdmin")
.constant("productUrl", "http://localhost:5500/products/")
.constant("regUrl", "http://localhost:5500/autoservices")
.constant("respondUrl", "http://localhost:5500/responds/")
.constant("userUrl", "http://localhost:5500/users/")
.constant("fileupload", "http://localhost:5500/upload/")
.config(function($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
})
.controller("productCtrl", function ($scope, $rootScope, $resource, $location, productUrl, regUrl, respondUrl, userUrl) {

    $scope.productsResource = $resource(productUrl + ":id", { id: "@id" });
    $scope.RegResource = $resource(regUrl + ":id", { id: "@id" });
    $scope.RespondResource = $resource(respondUrl + ":id", { id: "@id" });
    $scope.UserResource = $resource(userUrl + ":id", { id: "@id" });
    $scope.allitems = true;
    $scope.mainproduct = null;
    $scope.texts = {};
    $scope.startEdit = false;
    $scope.texts.work = ['Контрольный осмотр',
        'Замена масла в двигателе (в каждом ТО)',
        'Замена масляного фильтра (в каждом ТО)',
        'Защита двигателя',
        'Замена салонного фильтра',
        'Замена тормозных колодок',
        'Замена тормозных дисков',
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
        $scope.texts.destructions = [{ title: 'Бампер',
        data: ['Задний', 
        'Передний']},
        { title: 'Дверь', 
        data: ['Задняя левая', 
        'Задняя правая', 
        'Передняя левая', 
        'Передняя правая']},
        { title: 'Зеркало боковое',
        data: ['Левое', 
        'Правое']},
        { title: 'Крыло', 
        data: ['Переднее правое', 
        'Переднее левое' ,
        'Заднее правое' ,
        'Заднее левое']},
        { title:'Порог', 
        data: ['Правый' ,
        'Левый']},
        { title:'Стекло',
        data: ['Лобовое без датчика дождя(замена)' ,
        'Лобовое с датчиком дождя(замена)' ,
        'Лобовое ремонт скола' ,
        'Лобовое ремонт трещины' ,
        'Передней правой двери' ,
        'Передней левой двери' ,
        'Задней правой двери' ,
        'Задней левой двери' ,
        'Заднее']},
        { title:'Фара', 
        data: ['Передняя правая' ,
        'Передняя левая']},
        { title:'Противотуманка', 
        data: ['Передняя правая',
        'Передняя левая' ,
        'Задняя']},
        { title:'Задний фонарь', 
        data: ['Правый' ,
        'Левый']}];
    
    function getCookie(name) {
      var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
      ));
      return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    $scope.listProducts = function () {
        if ($rootScope.userid == undefined){
            $rootScope.userid = getCookie('autoid');
        }
        if ($rootScope.userid == undefined){
            $location.path("/login");
        }
        else{
            $scope.products = $scope.productsResource.query();
            $scope.users = $scope.UserResource.query();
            $scope.responds = $scope.RespondResource.query({autoserviceid: $rootScope.userid});

            $scope.productsResource.query({name: "Kayak"}, function(data){
                console.log(data);
            });
            $scope.RegResource.query(function(data){
                console.log(data);
            });
            console.log($rootScope.userid+"111");            
        }

    }

    $scope.deleteProduct = function (product) {
        product.$delete().then(function () {
            $scope.products.splice($scope.products.indexOf(product), 1);
        });
    }

    $scope.createProduct = function (product) {
        product.userid=$rootScope.userid;
        console.log(product);
        new $scope.productsResource(product).$save().then(function (newProduct) {
            $scope.products.push(newProduct);
            $scope.editedProduct = null;
        });
    }

    $scope.createRespond = function (respond) {
        respond.autoserviceid=$rootScope.userid;
        respond.productid=$scope.mainproduct.id;
        console.log(respond);
        new $scope.RespondResource(respond).$save().then(function (newRespond) {
            $scope.responds.push(newRespond);
            $scope.allitems = !$scope.allitems;
            $scope.mainproduct.replied = true;
            $scope.mainproduct.$save();
        });
    }

    $scope.updateProduct = function (product) {
        product.$save();
        $scope.editedProduct = null;
    }

    $scope.startEdit = function (product) {
        $scope.editedProduct = product;
    }

    $scope.viewItem = function (product) {
        $scope.allitems = !$scope.allitems;
        $scope.mainproduct = product;
        if (product){
            $scope.activeresponds = [];
            angular.forEach($scope.responds, function(value, key) {
              if (value.productid == product.id){
                if (value.approved && $scope.mainproduct.phone == undefined){ /* Если заявка подтверждена, то отображаем телефон юзера*/                 
                    angular.forEach($scope.users, function(value1, key1){
                        console.log(value1.id+"value");
                        console.log(product.userid+"pro");
                        if (value1.id == product.userid){
                            console.log(value1.phone);
                            $scope.mainproduct.phone = value1.phone;
                        }
                    });
                }
                $scope.activeresponds.push(value);
              }
            });           
        }
    }

    $scope.cancelEdit = function () {
        $scope.editedProduct = null;
    }

    $scope.listProducts();
});
