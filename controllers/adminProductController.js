angular.module("sportsStoreAdmin")
.constant("productUrl", "http://localhost:5500/products/")
.constant("regUrl", "http://localhost:5500/users")
.constant("respondUrl", "http://localhost:5500/responds/")
.constant("autoUrl", "http://localhost:5500/autos/")
.constant("meUrl", "http://localhost:5500/users/")
.constant("serviceUrl", "http://localhost:5500/autoservices/")
.constant("fileupload", "http://localhost:5500/upload/")
.config(function($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
})
.controller("productCtrl", function ($scope, $rootScope, $resource, $location, productUrl, regUrl, respondUrl, meUrl, serviceUrl, autoUrl) {

    $scope.productsResource = $resource(productUrl + ":id", { id: "@id" });
    $scope.RegResource = $resource(regUrl + ":id", { id: "@id" });
    $scope.RespondResource = $resource(respondUrl + ":id", { id: "@id" });
    $scope.MeResource = $resource(meUrl + ":id", { id: "@id" });
    $scope.ServiceResource = $resource(serviceUrl + ":id", { id: "@id" });
    $scope.AutoResource = $resource(autoUrl + ":id", { id: "@id" });
    $scope.allitems = true;
    $scope.mainproduct = null;
    $scope.user = null;
    $scope.activeresponds = [];
    $scope.Allpartners = true;
    $scope.activeItem = null;
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
            $rootScope.userid = getCookie('userid');
        }
        if ($rootScope.userid == undefined){
            $location.path("/login");
        }
        else{
        $scope.products = $scope.productsResource.query({userid: $rootScope.userid},function(data){
            $scope.autos = $scope.AutoResource.query({userid: $rootScope.userid},function(auto_data){
                angular.forEach(data, function(value, key) {
                angular.forEach(auto_data, function(value_auto, key_auto) {
                    if (value.autoid == value_auto.id){
                        value.auto=value_auto;
                    }
                });
            });
        });
        
            
        });
        $scope.user = $scope.MeResource.get({ id: $rootScope.userid },function(data){
            console.log(data);
        });
        $scope.partners = $scope.ServiceResource.query();
        $scope.responds = $scope.RespondResource.query();
        $scope.productsResource.query({name: "Kayak"}, function(data){
            console.log(data);
        });
        $scope.RegResource.query(function(data){
            console.log(data);
        });
        console.log($rootScope.userid+"111");            
        }

    }

    $scope.viewPartner = function(item){
        $scope.activeItem = item;
        $scope.Allpartners = !$scope.Allpartners;
    }

    $scope.editUser = function(user){
        user.$save().then(function(editeduser){
            console.log("edited user is "+ editeduser);
        });
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

    $scope.updateProduct = function (product) {
        product.$save().then(function(){
            $scope.allitems = !$scope.allitems;           
        });
        $scope.editedProduct = null;
        $scope.mainproduct = null;
    }

    $scope.editItem = function (product) {
        console.log($scope.allitems);
        $scope.mainproduct = product;
        $scope.startEdit = true;
        $scope.allitems = !$scope.allitems;
    }

    $scope.viewItem = function (product) {
        console.log($scope.allitems);
        $scope.allitems = !$scope.allitems;
        $scope.startEdit = false;
        $scope.mainproduct = product;
        if (product){
            $scope.activeresponds = [];
            angular.forEach($scope.responds, function(value, key) {
              if (value.productid == product.id){
                $scope.activeresponds.push(value);
              }
            });           
        }
    }

    $scope.approveItem = function(item){
        item.approved = !item.approved;
        item.$save();
    }

    $scope.cancelEdit = function () {
        $scope.editedProduct = null;
    }

    $scope.listProducts();
})
.controller("autoCtrl", function ($scope, $rootScope, $resource, regUrl, autoUrl, productUrl) {

    $scope.RegResource = $resource(regUrl + ":id", { id: "@id" });
    $scope.AutoResource = $resource(autoUrl + ":id", { id: "@id" });
    $scope.ProductsResource = $resource(productUrl + ":id", { id: "@id" });
    $scope.allitems = true;
    $scope.texts = {};
    $scope.marks={
            "Opel":{
                "Astra" : ["1.4","1.6","Xsite"],
                "Ingnite" : ["Go","1.5","1.7"],
            },
            "Volvo":{
                "Morka" : ["1.1","1.6","Xsite"],
                "Porka" : ["Go","1.8","1.9"],
            },
        };
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
    $scope.activeresponds = [];
    function getCookie(name) {
      var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
      ));
      return matches ? decodeURIComponent(matches[1]) : undefined;
    }
    /*$scope.AddOther = function(){
        $scope.marks.push("Other");
    }
    $scope.AddOther();*/

    function requesttonull(){
        $scope.mainproduct = {};
        $scope.mainproduct.details = {};
        $scope.mainproduct.details.question = [];
        $scope.mainproduct.details.engine = [];
        $scope.mainproduct.details.head = [];
        $scope.mainproduct.details.wheel = [];
        $scope.mainproduct.details.addi = [];
        $scope.mainproduct.details.diagnos = [];
        $scope.mainproduct.details.work = [];
        $scope.mainproduct.details.destructions = [[],[],[],[],[],[],[],[],[]];        
    }

    requesttonull();

    $scope.Search = function(number,object){
        if (number == 1){
            console.log(object);
            if (object == ''){
                $scope.markinput = true;
            }
        }
        if (number == 2){
            console.log(object);
            if (object == ''){
                $scope.modelinput = true;
            }
        }
        if (number == 3){
            console.log(object);
            if (object == 'other'){
                $scope.generationinput = true;
            }
        }
    }
    $scope.BacktoSelect = function(number,object){
        if (number == 1){
            console.log(object);
            if (object == ''){
                $scope.markinput = false;
            }
        }
        if (number == 2){
            if (object == ''){
                $scope.modelinput = false;
            }
        }
        if (number == 3){
            if (object == ''){
                $scope.generationinput = false;
            }
        }
    }
    $scope.listProducts = function () {
        $scope.allitems = 1;
        if ($rootScope.userid == undefined){
            $rootScope.userid = getCookie('userid');
        }
        $scope.autos = $scope.AutoResource.query({userid: $rootScope.userid});
    }
    $scope.base = -1;
    $scope.nice = function(){
        $scope.base = $scope.base + 1;
        console.log($scope.base);
        return $scope.base;
    }
    $scope.deleteAuto = function (auto) {
        console.log(auto.name);
        auto.$delete().then(function () {
            $scope.autos.splice($scope.autos.indexOf(product), 1);
        });
    }
    $scope.addItem = function (auto) {
        auto.userid=$rootScope.userid;
        console.log(document.getElementById("mark").value);
        auto.mark = document.getElementById("mark").value;
        auto.model = document.getElementById("model").value;
        console.log(auto.picture);
        new $scope.AutoResource(auto).$save().then(function (newAuto) {
            $scope.autos.push(newAuto);
            requesttonull();
            $scope.allitems = 1;
        });        
    }
    $scope.addRequest = function (request) {
        request.userid=$rootScope.userid;
        request.type = $scope.allitems;
        request.autoid = request.autoid.id;
        console.log(request);
        new $scope.ProductsResource(request).$save().then(function (newrequest) {
            requesttonull();
            $scope.allitems = 1;
            console.log(newrequest);
        });        
    }
    
    $scope.updateProduct = function (auto) {
        auto.$save().then(function(){
            $scope.allitems = 1;           
        });
        $scope.editedProduct = null;
        $scope.mainproduct = null;
        $scope.startEdit = false;
    }

    $scope.editItem = function (auto,number) {
        console.log(auto.model);
        $scope.mainproduct = auto;
        $scope.mainproduct.model = $scope.marks[$scope.mainproduct.mark][$scope.mainproduct.model];
        $scope.mainproduct.mark = $scope.marks[$scope.mainproduct.mark];
        $scope.startEdit = true;
        $scope.allitems = number;
    }

    $scope.viewItem = function (auto,number) {
        $scope.allitems = number;
        $scope.mainproduct = auto;
        auto.mark = document.getElementById("mark").value;
        auto.model = document.getElementById("model").value;
    }

    $scope.approveItem = function(item){
        item.approved = !item.approved;
        item.$save();
    }
    $scope.cancelEdit = function () {
        $scope.editedProduct = null;
    }

    $scope.listProducts();
});
/*.controller('MyCtrl', ['$scope', 'Upload', '$timeout', function ($scope, Upload, $resource, $timeout) {
    $scope.uploadFiles = function(file, errFiles) {
        $scope.AutoResource = $resource("http://localhost:5500/auto/" + ":id", { id: "@id" });
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: 'http://localhost:5500/auto/',
                data: {uniqueFilename: file}
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 * 
                                         evt.loaded / evt.total));
            });
        }   
    }
}]);*/
