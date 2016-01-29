angular.module("sportsStoreAdmin")
.constant("userRegUrl", "http://localhost:5500/users/")
.constant("ordersUrl", "http://localhost:5500/orders/")
.constant("autoUrl", "http://localhost:5500/autos/")
.constant("productUrl", "http://localhost:5500/products/")
.constant("respondUrl", "http://localhost:5500/responds/")
.constant("serviceUrl", "http://localhost:5500/autoservices/")
.constant("fileupload", "http://localhost:5500/upload/")
.constant("autoRegUrl", "http://localhost:5500/autoservices/")
.constant('MONGOLAB_CONFIG',{API_KEY:'eUE2PGyR-ac1ocaU_MDvddB4PUArfhPw', DB_NAME:'igormongo'})
        .factory('Users', ['$mongolabResourceHttp' ,function ($mongolabResourceHttp) {
            return $mongolabResourceHttp('Users');
        }])
        .factory('Autos', ['$mongolabResourceHttp' ,function ($mongolabResourceHttp) {
            return $mongolabResourceHttp('Autos');
        }])
        .factory('Autoservices', ['$mongolabResourceHttp' ,function ($mongolabResourceHttp) {
            return $mongolabResourceHttp('Autoservices');
        }])
        .factory('Requests', ['$mongolabResourceHttp' ,function ($mongolabResourceHttp) {
            return $mongolabResourceHttp('Requests');
        }])
        .factory('Responds', ['$mongolabResourceHttp' ,function ($mongolabResourceHttp) {
            return $mongolabResourceHttp('Responds');
        }]);


angular.module('sportsStoreAdmin')
.factory('Functions', [function(){
    return{
      sendMail: function(info){
        info.from = info.from == undefined ? "info@carsbir.ru" : info.from;
        var sendobject = { 
            type: "POST", 
            url: "https://mandrillapp.com/api/1.0/messages/send.json", 
            data: { 
              'key': 'SWwkrbd8NN0rJ54aAyYnZg', 
              'message': { 
                'from_email': info.from,
                'to': [ 
                  { 
                  'email': info.email, 
                  'name': info.username, 
                  'type': 'to' 
                  }
                ], 
                  'subject': info.subject, 
                  'html': info.html, 
              } 
            }
          };
        if (info.email != "info@carsbir.ru"){
          sendobject.data.message.to.push({
                  'email': info.from, 
                  'name': "Admino", 
                  'type': 'to' 
          });
        }
        console.log(sendobject);
        $.ajax(sendobject)
          .done(function(data){
            return true;
          })
          .fail(function(data){
            return false;
          });
      },
      alertAnimate: function(elem){
        elem.show();
        elem.fadeTo(5000, 500).slideUp(500, function(){
           elem.hide();
        });
      },
      getCookie: function(name) {
        var matches = document.cookie.match(new RegExp(
          "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
      },
      getRandomInt: function (min, max)
      {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      },
      setCookie: function(name, value, options) {
          options = options || {};

          var expires = options.expires;

          if (typeof expires == "number" && expires) {
            var d = new Date();
            d.setTime(d.getTime() + expires * 1000);
            expires = options.expires = d;
          }
          if (expires && expires.toUTCString) {
            options.expires = expires.toUTCString();
          }

          value = encodeURIComponent(value);

          var updatedCookie = name + "=" + value;

          for (var propName in options) {
            updatedCookie += "; " + propName;
            var propValue = options[propName];
            if (propValue !== true) {
              updatedCookie += "=" + propValue;
            }
          }

          document.cookie = updatedCookie;
      }
  }
}])
.factory('Data', [function(){
    return{  
      getWorkTypes: function(){
        return{
            work: ['Контрольный осмотр',
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
                  'Охлаждающая жидкость (замена)'],
            tuning: [ 'Установка сигнализации',
                  'Шумоизоляция салона',
                  'Дуги и обвесы',
                  'Защитная пленка на кузов',
                  'Установка защиты картера',
                  'Химчистка салона',
                  'Тонировка окон',
                  'Тонировка фар',
                  'Установка прицепного устройства',
                  'Установка датчиков парковки',
                  'Антикоррозийная обработка кузова',
                  'Защитная сетка радиатора в бампер'],
            question: ['Масло в двигателе (замена)',
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
                      'Жидкость гидроусилителя (ГУР) (замена)'],
            diagnos: ['Контрольный осмотр',
                  'Диагностика двигателя',
                  'Диагностика коробки передач',
                  'Диагностика подвески',
                  'Диагностика электрики'],
            engine: ['Замена масла',
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
                'Форсунки'],
            head: ['Амортизатор (замена)',
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
                    'Шаровые (замена)'],
            wheel: ['Рулевая рейка',
                'Рулевая тяга (замена)', 
                'Наконечник рулевой тяги (замена)',
                'Жидкость гидроусилителя (замена)',
                'Насос гидроусилителя (замена)', 
                'Сцепление',
                'Шрус (замена)', 
                'Замена масла в коробке передач'],
            addi: ['Тонировка',
              'Сигнализация (название в комментарии)',
              'Парктроник (описать в комментарии)', 
              'Химчистка салона',
              'Полировка', 
              'Противоугонный комплекс (описать в комментарии)',
              'Иммобилайзер (описать в комментарии)',
              'Защита картера (установка)', 
              'Отопитель двигателя (описать в комментарии)',
              'Шумоизоляция (описать в комментарии)'],
            destructions: [{ title: 'Бампер', eng: 'bamper',
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
                'Левый']},
                { title:'Крышка багажника', eng: 'bagazh',
                data: ['Покраска крышки' ,
                'Ремонт крышки']},
                { title:'Капот', eng: 'kapot',
                data: ['Покраска капота' ,
                'Ремонт капота']},
                ],
        }
      },
      getMarks: function(){
        return {
            "Audi" : { '100':['1'], '80':['1'], 'A1':['1'], 'A3':['1'], 'A4':['1'], 'A4 allroad':['1'], 'A5':['1'], 'A6':['1'], 'A6 allroad':['1'], 'A7':['1'], 'A8':['1'], 'Q3':['1'], 'Q5':['1'], 'Q7':['1'], 'R8':['1'], 'RS6':['1'], 'S5':['1'], 'S6':['1'], 'S8':['1'], 'TT':['1']},
            "BMW" : { '1er':['1'], '2er':['1'], '3er':['1'], '4er':['1'], '5er':['1'], '6er':['1'], '7er':['1'], '8er':['1'], 'M3':['1'], 'M4':['1'], 'M5':['1'], 'M6':['1'], 'X1':['1'], 'X3':['1'], 'X4':['1'], 'X5':['1'], 'X5 M':['1'], 'X6':['1'], 'X6 M':['1'], 'Z4':['1']},
            "Cadillac" : { 'ATS':['1'], 'BLS':['1'], 'CTS':['1'], 'De Ville':['1'], 'Escalade':['1'], 'Seville':['1'], 'SRX':['1'], 'STS':['1']}, 
            "Chery" : { 'Amulet (A15)':['1'], 'Arrizo 7':['1'], 'Bonus 3 (E3/A19)':['1'], 'Bonus (A13)':['1'], 'Fora (A21)':['1'], 'IndiS (S18D)':['1'], 'Kimo (A1)':['1'], 'M11 (A3)':['1'], 'QQ6 (S21)':['1'], 'Tiggo 5':['1'], 'Tiggo (T11)':['1'], 'Very':['1']}, 
            "Chevrolet" : { 'Aveo':['1'], 'Blazer':['1'], 'Camaro':['1'], 'Captiva':['1'], 'Cobalt':['1'], 'Corvette':['1'], 'Cruze':['1'], 'Epica':['1'], 'Evanda':['1'], 'Express':['1'], 'Lacetti':['1'], 'Lanos':['1'], 'Niva':['1'], 'Orlando':['1'], 'Rezzo':['1'], 'Silverado':['1'], 'Spark':['1'], 'Tahoe':['1'], 'Tracker':['1'], 'TrailBlazer':['1']}, 
            "Chrysler" : { '200':['1'], '300C':['1'], '300C SRT8':['1'], '300M':['1'], 'Cirrus':['1'], 'Concorde':['1'], 'Crossfire':['1'], 'Fifth Avenue':['1'], 'Intrepid':['1'], 'Le Baron':['1'], 'LHS':['1'], 'Neon':['1'], 'NEW Yorker':['1'], 'Pacifica':['1'], 'Prowler':['1'], 'PT Cruiser':['1'], 'Sebring':['1'], 'Stratus':['1'], 'Town & Country':['1'], 'Voyager':['1']}, 
            "Citroen" : { 'Berlingo':['1'], 'C1':['1'], 'C2':['1'], 'C3':['1'], 'C3 Picasso':['1'], 'C4':['1'], 'C4 Aircross':['1'], 'C4 Picasso':['1'], 'C5':['1'], 'C-Crosser':['1'], 'C-Elysee':['1'], 'DS3':['1'], 'DS4':['1'], 'DS5':['1'], 'Jumpy':['1'], 'Saxo':['1'], 'Xantia':['1'], 'Xsara':['1'], 'Xsara Picasso':['1']}, 
            "Daewoo" : { 'Damas':['1'], 'Espero':['1'], 'Evanda':['1'], 'Gentra':['1'], 'Kalos':['1'], 'Lacetti':['1'], 'Lanos (Sens)':['1'], 'Leganza':['1'], 'LE Mans':['1'], 'Magnus':['1'], 'Matiz':['1'], 'Nexia':['1'], 'Nubira':['1'], 'Racer':['1'], 'Rezzo':['1'], 'Tacuma':['1'], 'Tico':['1'], 'Tosca':['1'], 'Winstorm':['1']}, 
            "Dodge" : { 'Avenger':['1'], 'Caliber':['1'], 'Caravan':['1'], 'Challenger':['1'], 'Charger':['1'], 'Dakota':['1'], 'Dart':['1'], 'Daytona':['1'], 'Durango':['1'], 'Dynasty':['1'], 'Intrepid':['1'], 'Journey':['1'], 'Magnum':['1'], 'Neon':['1'], 'Nitro':['1'], 'RAM':['1'], 'Spirit':['1'], 'Stealth':['1'], 'Stratus':['1'], 'Viper':['1']}, 
            "Fiat" : { '500':['1'], 'Albea':['1'], 'Barchetta':['1'], 'Brava':['1'], 'Bravo':['1'], 'Coupe':['1'], 'Croma':['1'], 'Doblo':['1'], 'Freemont':['1'], 'Linea':['1'], 'Marea':['1'], 'Multipla':['1'], 'Palio':['1'], 'Panda':['1'], 'Punto':['1'], 'Scudo':['1'], 'Sedici':['1'], 'Stilo':['1'], 'Tempra':['1']}, 
            "Ford" : { 'C-MAX':['1'], 'EcoSport':['1'], 'Escape':['1'], 'Escort':['1'], 'Expedition':['1'], 'Explorer':['1'], 'F-150':['1'], 'Fiesta':['1'], 'Focus':['1'], 'Focus ST':['1'], 'Fusion':['1'], 'Galaxy':['1'], 'Kuga':['1'], 'Maverick':['1'], 'Mondeo':['1'], 'Mustang':['1'], 'Ranger':['1'], 'S-MAX':['1'], 'Tourneo Connect':['1']}, 
            "GreatWall" : { 'Coolbear':['1'], 'Cowry (V80)':['1'], 'Deer':['1'], 'Florid':['1'], 'Hover':['1'], 'Hover H3':['1'], 'Hover H5':['1'], 'Hover H6':['1'], 'Hover M1 (Peri 4x4)':['1'], 'Hover M2':['1'], 'Hover M4':['1'], 'Pegasus':['1'], 'Peri':['1'], 'Safe':['1'], 'Sailor':['1'], 'Sing RUV':['1'], 'Socool':['1'], 'Voleex C10 (Phenom)':['1'], 'Voleex C30':['1'], 'Wingle':['1']}, 
            "Honda" : { 'Accord':['1'], 'Airwave':['1'], 'Civic':['1'], 'Civic Ferio':['1'], 'Civic Type R':['1'], 'Crosstour':['1'], 'CR-V':['1'], 'Element':['1'], 'Fit':['1'], 'HR-V':['1'], 'Insight':['1'], 'Integra':['1'], 'Jazz':['1'], 'Legend':['1'], 'Odyssey':['1'], 'Pilot':['1'], 'Prelude':['1'], 'Ridgeline':['1'], 'Stepwgn':['1'], 'Stream':['1']}, 
            "Hyundai" : { 'Accent':['1'], 'Coupe':['1'], 'Elantra':['1'], 'Equus':['1'], 'Genesis':['1'], 'Getz':['1'], 'i20':['1'], 'i30':['1'], 'i40':['1'], 'ix35':['1'], 'ix55':['1'], 'Matrix':['1'], 'Santa Fe':['1'], 'Solaris':['1'], 'Sonata':['1'], 'Starex (H-1)':['1'], 'Terracan':['1'], 'Tucson':['1'], 'Veloster':['1']}, 
            "Infiniti" : { 'EX':['1'], 'FX':['1'], 'G':['1'], 'M':['1'], 'Q30':['1'], 'Q40':['1'], 'Q50':['1'], 'Q70':['1'], 'QX':['1'], 'QX50':['1'], 'QX60':['1'], 'QX70':['1'], 'QX80':['1']}, 
            "Jaguar" : { 'F-Pace':['1'], 'F-Type':['1'], 'S-Type':['1'], 'XF':['1'], 'XFR':['1'], 'XJ':['1'], 'XJS':['1'], 'XK':['1'], 'XKR':['1'], 'X-Type':['1']}, 
            "Jeep" : { 'Cherokee':['1'], 'Compass':['1'], 'Grand Cherokee':['1'], 'Grand Cherokee SRT8':['1'], 'Wrangler':['1']}, 
            "Kia" : { 'Carens':['1'], 'Carnival':['1'], 'Ceed':['1'], 'Cerato':['1'], 'Clarus':['1'], 'Magentis':['1'], 'Mohave (Borrego)':['1'], 'Opirus':['1'], 'Optima':['1'], 'Picanto':['1'], 'Quoris':['1'], 'Rio':['1'], 'Sephia':['1'], 'Shuma':['1'], 'Sorento':['1'], 'Soul':['1'], 'Spectra':['1'], 'Sportage':['1'], 'Venga':['1']}, 
            "LandRover" : { 'Defender':['1'], 'Discovery':['1'], 'Discovery Sport':['1'], 'Freelander':['1'], 'Range Rover':['1'], 'Range Rover Evoque':['1'], 'Range Rover Sport':['1']}, 
            "Lexus" : { 'CT':['1'], 'ES':['1'], 'GS':['1'], 'GX':['1'], 'HS':['1'], 'IS':['1'], 'IS F':['1'], 'LFA':['1'], 'LS':['1'], 'LX':['1'], 'NX':['1'], 'RC':['1'], 'RC F':['1'], 'RX':['1'], 'SC':['1']}, 
            "Lifan" : { 'Breez (520)':['1'], 'Cebrium (720)':['1'], 'Celliya (530)':['1'], 'Smily':['1'], 'Solano':['1'], 'X50':['1'], 'X60':['1']}, 
            "Mazda" : { '2':['1'], '3':['1'], '323':['1'], '3 MPS':['1'], '5':['1'], '6':['1'], '626':['1'], '6 MPS':['1'], 'B-series':['1'], 'BT-50':['1'], 'CX-5':['1'], 'CX-7':['1'], 'CX-9':['1'], 'Demio':['1'], 'MPV':['1'], 'MX-5':['1'], 'Protege':['1'], 'RX-8':['1'], 'Tribute':['1'], 'Xedos 6':['1']}, 
            "Mercedes-Benz" : { 'A-klasse':['1'], 'B-klasse':['1'], 'C-klasse':['1'], 'CLA-klasse':['1'], 'CLS-klasse':['1'], 'E-klasse':['1'], 'G-klasse':['1'], 'GLA-klasse':['1'], 'GLE':['1'], 'GLK-klasse':['1'], 'GL-klasse':['1'], 'M-klasse':['1'], 'R-klasse':['1'], 'S-klasse':['1'], 'S-klasse AMG':['1'], 'SLK-klasse':['1'], 'Viano':['1'], 'Vito':['1']}, 
            "MINI" : { 'Cabrio':['1'], 'Clubman':['1'], 'Clubvan':['1'], 'Countryman':['1'], 'Coupe':['1'], 'Hatch':['1'], 'Paceman':['1'], 'Roadster':['1']}, 
            "Mitsubishi" : { 'Airtrek':['1'], 'ASX':['1'], 'Carisma':['1'], 'Colt':['1'], 'Eclipse':['1'], 'Galant':['1'], 'Grandis':['1'], 'L200':['1'], 'Lancer':['1'], 'Lancer Evolution':['1'], 'Mirage':['1'], 'Montero':['1'], 'Montero Sport':['1'], 'Outlander':['1'], 'Pajero':['1'], 'Pajero Pinin':['1'], 'Pajero Sport':['1'], 'RVR':['1'], 'Space Star':['1'], 'Space Wagon':['1']}, 
            "Nissan" : { 'Almera':['1'], 'Almera Classic':['1'], 'Juke':['1'], 'Maxima':['1'], 'Micra':['1'], 'Murano':['1'], 'Navara (Frontier)':['1'], 'Note':['1'], 'Pathfinder':['1'], 'Patrol':['1'], 'Primera':['1'], 'Qashqai':['1'], 'Qashqai+2':['1'], 'Sentra':['1'], 'Serena':['1'], 'Skyline':['1'], 'Teana':['1'], 'Terrano':['1'], 'Tiida':['1'], 'X-Trail':['1']}, 
            "Opel" : { 'Agila':['1'], 'Antara':['1'], 'Astra':['1'], 'Astra OPC':['1'], 'Calibra':['1'], 'Combo':['1'], 'Corsa':['1'], 'Frontera':['1'], 'Insignia':['1'], 'Insignia OPC':['1'], 'Kadett':['1'], 'Meriva':['1'], 'Mokka':['1'], 'Monterey':['1'], 'Omega':['1'], 'Tigra':['1'], 'Vectra':['1'], 'Vita':['1'], 'Vivaro':['1'], 'Zafira':['1']}, 
            "Peugeot" : { '107':['1'], '2008':['1'], '206':['1'], '207':['1'], '208':['1'], '3008':['1'], '301':['1'], '307':['1'], '308':['1'], '4007':['1'], '4008':['1'], '406':['1'], '407':['1'], '408':['1'], '508':['1'], '607':['1'], 'Expert':['1'], 'Partner':['1']}, 
            "Porsche" : { '911':['1'], 'Panamera':['1'], 'Boxster':['1'], 'Cayenne':['1'], 'Cayman':['1'], 'Macan':['1']}, 
            "Renault" : { '19':['1'], 'Clio':['1'], 'Clio RS':['1'], 'Duster':['1'], 'Espace':['1'], 'Fluence':['1'], 'Kangoo':['1'], 'Koleos':['1'], 'Laguna':['1'], 'Latitude':['1'], 'Logan':['1'], 'Megane':['1'], 'Megane RS':['1'], 'Safrane':['1'], 'Sandero':['1'], 'Scenic':['1'], 'Symbol':['1'], 'Trafic':['1'], 'Twingo':['1']}, 
            "Saab" : { '900':['1'], '9000':['1'], '9-2X':['1'], '9-3':['1'], '9-5':['1'], '96':['1'], '9-7X':['1'], '99':['1']}, 
            "SEAT" : { 'Alhambra':['1'], 'Toledo':['1'], 'Altea':['1'], 'Cordoba':['1'], 'Ibiza':['1'], 'Leon':['1']}, 
            "Skoda" : { 'Fabia':['1'], 'Felicia':['1'], 'Octavia':['1'], 'Octavia RS':['1'], 'Rapid':['1'], 'Roomster':['1'], 'Superb':['1'], 'Yeti':['1']}, 
            "SsangYong" : { 'Actyon':['1'], 'Actyon Sports':['1'], 'Chairman':['1'], 'Korando':['1'], 'Korando Family':['1'], 'Kyron':['1'], 'Musso':['1'], 'Rexton':['1'], 'Stavic':['1']}, 
            "Subaru" : { 'BRZ':['1'], 'Dex':['1'], 'Exiga':['1'], 'Forester':['1'], 'Impreza':['1'], 'Impreza WRX':['1'], 'Impreza WRX STi':['1'], 'Justy':['1'], 'Legacy':['1'], 'Levorg':['1'], 'Outback':['1'], 'R2':['1'], 'Stella':['1'], 'SVX':['1'], 'Trezia':['1'], 'Tribeca':['1'], 'Vivio':['1'], 'WRX':['1'], 'WRX STi':['1'], 'XV':['1']}, 
            "Suzuki" : { 'Aerio':['1'], 'Alto':['1'], 'Baleno':['1'], 'Escudo':['1'], 'Every':['1'], 'Grand Vitara':['1'], 'Ignis':['1'], 'Jimny':['1'], 'Kei':['1'], 'Kizashi':['1'], 'Liana':['1'], 'Palette':['1'], 'Samurai':['1'], 'Solio':['1'], 'Splash':['1'], 'Swift':['1'], 'SX4':['1'], 'Verona':['1'], 'Vitara':['1'], 'Wagon R':['1']}, 
            "Toyota" : { '4Runner':['1'], 'Auris':['1'], 'Avensis':['1'], 'Camry':['1'], 'Carina':['1'], 'Celica':['1'], 'Corolla':['1'], 'Crown':['1'], 'Highlander':['1'], 'Hilux':['1'], 'Land Cruiser':['1'], 'Land Cruiser Prado':['1'], 'Mark II':['1'], 'Prius':['1'], 'RAV 4':['1'], 'Sienna':['1'], 'Tundra':['1'], 'Venza':['1'], 'Verso':['1'], 'Yaris':['1']}, 
            "Volkswagen" : { 'Amarok':['1'], 'Beetle':['1'], 'Bora':['1'], 'Caddy':['1'], 'Caravelle':['1'], 'Golf':['1'], 'Golf GTI':['1'], 'Golf Plus':['1'], 'Jetta':['1'], 'Multivan':['1'], 'Passat':['1'], 'Passat CC':['1'], 'Phaeton':['1'], 'Polo':['1'], 'Scirocco':['1'], 'Sharan':['1'], 'Tiguan':['1'], 'Touareg':['1'], 'Touran':['1'], 'Transporter':['1']}, 
            "Volvo" : { '240 Series':['1'], '460':['1'], '740':['1'], '850':['1'], '940':['1'], '960':['1'], 'C30':['1'], 'C70':['1'], 'S40':['1'], 'S60':['1'], 'S70':['1'], 'S80':['1'], 'V40':['1'], 'V40 Cross Country':['1'], 'V50':['1'], 'V60':['1'], 'V70':['1'], 'XC60':['1'], 'XC70':['1'], 'XC90':['1']}, 
            "VAZ" : { '2101':['1'], '2104':['1'], '2105':['1'], '2106':['1'], '2107':['1'], '2108':['1'], '2109':['1'], '21099':['1'], '2110':['1'], '2111':['1'], '2112':['1'], '2113':['1'], '2114':['1'], '2115':['1'], '2121 (4x4)':['1'], '2131 (4x4)':['1'], 'Granta':['1'], 'Kalina':['1'], 'Largus':['1'], 'Priora':['1']}, 
            "GAZ" : { '21 «Волга»':['1'], '24 «Волга»':['1'], '31029 «Волга»':['1'], '3102 «Волга»':['1'], '31105 «Волга»':['1'], '3110 «Волга»':['1'], '69':['1']}, 
            "ZAZ" : { '1102 «Таврия»':['1'], '1103 «Славута»':['1'], '1105 «Дана»':['1'], '965':['1'], '966':['1'], '968':['1'], 'Chance':['1'], 'Forza':['1'], 'Sens':['1'], 'Vida':['1']}, 
            "TAGAZ" : { 'Aquila':['1'], 'C10':['1'], 'C190':['1'], 'C-30':['1'], 'Road Partner':['1'], 'Tager':['1'], 'Vega':['1']}, 
            "UAZ" : { '3151':['1'], '3153':['1'], '3159':['1'], '3160':['1'], '3162 Simbir':['1'], '469':['1'], 'Hunter':['1'], 'Patriot':['1'], 'Pickup':['1']},
        }
      },
      getAuto: function(){
        return {
          array_years:["2016","2015","2014","2013","2012","2011","2010","2009" ,"2008" ,"2007", "2006" ,"2005", "2004", "2003", "2002" ,"2001", "2000", "1999", "1998", "1997", "1996", "1995", "1994", "1993", "1992", "1991", "1990", "1989", "1988", "1987", "1986", "1985" ,"1984", "1983", "1982", "1981" ,"1980"],
          array_volume:["0.5","0.6","0.7","0.8","0.9","1.0","1.1","1.2","1.3","1.4","1.5","1.6","1.7","1.8","1.9","2.0","2.1","2.2","2.3","2.4","2.1","2.2","2.3","2.4","2.5","2.6","2.7","2.8","2.9","3.0","3.1","3.2","3.3","3.4","3.5","3.6","3.7","3.8","3.9","4.0","4.1","4.2","4.3","4.4","4.5","4.6","4.7","4.8","4.9","5.0","5.1","5.2","5.3","5.4","5.5","5.6","5.7","5.8","5.9","6.0","6.1","6.2","6.3","6.4","6.5","6.6","6.7","6.8","6.9","7.0","7.1","7.2","7.3","7.4","7.5","7.6","7.7","7.8","7.9","8.0","8.1","8.2","8.3","8.4","8.5","8.6","8.7","8.8","8.9","9.0","9.1","9.2","9.3","9.4","9.5","9.6","9.7","9.8","9.9"],
          array_engine:["Бензин","Гибрид","Дизель"],
          array_box:["CVT(Вариантор)","Автомат","Механика","Робот"],
          array_back:["Седан","Хетчбэк","Универсал","Фургон","Седан","Фастбэк","Минивэн","Ландо","Брогам","Лимузин","Кабриолет","Купе","Родстер","Пикап","Внедорожник"]
        }
      },
      getMetro: function(){
        return ['Авиамоторная','Автозаводская','Академическая','Александровский сад','Алексеевская','Алма-Атинская',
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
      },
      getRegions: function(){
        return ['Центральный', 'Северный', 'Северо-Восточный', 'Восточный', 'Юго-Восточный', 'Южный', 'Юго-Западный', 'Западный', 'Северо-Западный' ,'Зеленоградский'];
      },
      getSubjects: function () {
        return {
          "data": [
            {
              label: "г.Москва",
              id: "77"
            },
            {
              label: "Московская обл",
              id: "50"
            },
            {
              label: "Адыгея Респ",
              id: "01"
            },
            {
              label: "Алтай Респ",
              id: "04"
            },
            {
              label: "Алтайский край",
              id: "22"
            },
            {
              label: "Амурская обл",
              id: "28"
            },
            {
              label: "Архангельская обл",
              id: "29"
            },
            {
              label: "Астраханская обл",
              id: "30"
            },
            {
              label: "Башкортостан Респ",
              id: "02"
            },
            {
              label: "Белгородская обл",
              id: "31"
            },
            {
              label: "Брянская обл",
              id: "32"
            },
            {
              label: "Бурятия Респ",
              id: "03"
            },
            {
              label: "Владимирская обл",
              id: "33"
            },
            {
              label: "Волгоградская обл",
              id: "34"
            },
            {
              label: "Вологодская обл",
              id: "35"
            },
            {
              label: "Воронежская обл",
              id: "36"
            },
            {
              label: "Дагестан Респ",
              id: "05"
            },
            {
              label: "Еврейская Аобл",
              id: "79"
            },
            {
              label: "Забайкальский край",
              id: "75"
            },
            {
              label: "Ивановская обл",
              id: "37"
            },
            {
              label: "Ингушетия Респ",
              id: "06"
            },
            {
              label: "Иркутская обл",
              id: "38"
            },
            {
              label: "Кабардино-Балкарская Респ",
              id: "07"
            },
            {
              label: "Калининградская обл",
              id: "39"
            },
            {
              label: "Калмыкия Респ",
              id: "08"
            },
            {
              label: "Калужская обл",
              id: "40"
            },
            {
              label: "Камчатский край",
              id: "41"
            },
            {
              label: "Карачаево-Черкесская Респ",
              id: "09"
            },
            {
              label: "Карелия Респ",
              id: "10"
            },
            {
              label: "Кемеровская обл",
              id: "42"
            },
            {
              label: "Кировская обл",
              id: "43"
            },
            {
              label: "Коми Респ",
              id: "11"
            },
            {
              label: "Костромская обл",
              id: "44"
            },
            {
              label: "Краснодарский край",
              id: "23"
            },
            {
              label: "Красноярский край",
              id: "24"
            },
            {
              label: "Курганская обл",
              id: "45"
            },
            {
              label: "Курская обл",
              id: "46"
            },
            {
              label: "Ленинградская обл",
              id: "47"
            },
            {
              label: "Липецкая обл",
              id: "48"
            },
            {
              label: "Магаданская обл",
              id: "49"
            },
            {
              label: "Марий Эл Респ",
              id: "12"
            },
            {
              label: "Мордовия Респ",
              id: "13"
            },
            {
              label: "Мурманская обл",
              id: "51"
            },
            {
              label: "Ненецкий АО",
              id: "83"
            },
            {
              label: "Нижегородская обл",
              id: "52"
            },
            {
              label: "Новгородская обл",
              id: "53"
            },
            {
              label: "Новосибирская обл",
              id: "54"
            },
            {
              label: "Омская обл",
              id: "55"
            },
            {
              label: "Оренбургская обл",
              id: "56"
            },
            {
              label: "Орловская обл",
              id: "57"
            },
            {
              label: "Пензенская обл",
              id: "58"
            },
            {
              label: "Пермский край",
              id: "59"
            },
            {
              label: "Приморский край",
              id: "25"
            },
            {
              label: "Псковская обл",
              id: "60"
            },
            {
              label: "Ростовская обл",
              id: "61"
            },
            {
              label: "Рязанская обл",
              id: "62"
            },
            {
              label: "Самарская обл",
              id: "63"
            },
            {
              label: "Санкт-Петербург г",
              id: "78"
            },
            {
              label: "Саратовская обл",
              id: "64"
            },
            {
              label: "Саха /Якутия/ Респ",
              id: "14"
            },
            {
              label: "Сахалинская обл",
              id: "65"
            },
            {
              label: "Свердловская обл",
              id: "66"
            },
            {
              label: "Северная Осетия - Алания Респ",
              id: "15"
            },
            {
              label: "Смоленская обл",
              id: "67"
            },
            {
              label: "Ставропольский край",
              id: "26"
            },
            {
              label: "Тамбовская обл",
              id: "68"
            },
            {
              label: "Татарстан Респ",
              id: "16"
            },
            {
              label: "Тверская обл",
              id: "69"
            },
            {
              label: "Томская обл",
              id: "70"
            },
            {
              label: "Тульская обл",
              id: "71"
            },
            {
              label: "Тыва Респ",
              id: "17"
            },
            {
              label: "Тюменская обл",
              id: "72"
            },
            {
              label: "Удмуртская Респ",
              id: "18"
            },
            {
              label: "Ульяновская обл",
              id: "73"
            },
            {
              label: "Хабаровский край",
              id: "27"
            },
            {
              label: "Хакасия Респ",
              id: "19"
            },
            {
              label: "Ханты-Мансийский Автономный округ - Югра АО",
              id: "86"
            },
            {
              label: "Челябинская обл",
              id: "74"
            },
            {
              label: "Чеченская Респ",
              id: "20"
            },
            {
              label: "Чувашская Респ",
              id: "21"
            },
            {
              label: "Чукотский АО",
              id: "87"
            },
            {
              label: "Ямало-Ненецкий АО",
              id: "89"
            },
            {
              label: "Ярославская обл",
              id: "76"
            }
          ]
        }
      }
    }
}]);

 angular.module('sportsStoreAdmin')
  .factory('$mongolabResourceHttp', ['MONGOLAB_CONFIG', '$http', '$q', function (MONGOLAB_CONFIG, $http, $q) {
    function MmongolabResourceFactory(collectionName) {
      var config = angular.extend({
        BASE_URL: 'https://api.mongolab.com/api/1/databases/'
      }, MONGOLAB_CONFIG);

      var dbUrl = config.BASE_URL + config.DB_NAME;
      var collectionUrl = dbUrl + '/collections/' + collectionName;
      var defaultParams = {apiKey: config.API_KEY};

      var resourceRespTransform = function (response) {
        return new Resource(response.data);
      };

      var resourcesArrayRespTransform = function (response) {
        return response.data.map(function(item){
          return new Resource(item);
        });
      };

      var preparyQueryParam = function (queryJson) {
        return angular.isObject(queryJson) && Object.keys(queryJson).length ? {q: JSON.stringify(queryJson)} : {};
      };

      var Resource = function (data) {
        angular.extend(this, data);
      };

      Resource.query = function (queryJson, options) {

        var prepareOptions = function (options) {

          var optionsMapping = {sort: 's', limit: 'l', fields: 'f', skip: 'sk'};
          var optionsTranslated = {};

          if (options && !angular.equals(options, {})) {
            angular.forEach(optionsMapping, function (targetOption, sourceOption) {
              if (angular.isDefined(options[sourceOption])) {
                if (angular.isObject(options[sourceOption])) {
                  optionsTranslated[targetOption] = JSON.stringify(options[sourceOption]);
                } else {
                  optionsTranslated[targetOption] = options[sourceOption];
                }
              }
            });
          }
          return optionsTranslated;
        };

        var requestParams = angular.extend({}, defaultParams, preparyQueryParam(queryJson), prepareOptions(options));

        return $http.get(collectionUrl, {params: requestParams}).then(resourcesArrayRespTransform);
      };

      Resource.all = function (options, successcb, errorcb) {
        return Resource.query({}, options || {});
      };

      Resource.count = function (queryJson) {
        return $http.get(collectionUrl, {
          params: angular.extend({}, defaultParams, preparyQueryParam(queryJson), {c: true})
        }).then(function(response){
          return response.data;
        });
      };

      Resource.distinct = function (field, queryJson) {
        return $http.post(dbUrl + '/runCommand', angular.extend({}, queryJson || {}, {
          distinct: collectionName,
          key: field}), {
          params: defaultParams
        }).then(function (response) {
          return response.data.values;
        });
      };

      Resource.getById = function (id) {
        return $http.get(collectionUrl + '/' + id, {params: defaultParams}).then(resourceRespTransform);
      };

      Resource.getByObjectIds = function (ids) {
        var qin = [];
        angular.forEach(ids, function (id) {
          qin.push({$oid: id});
        });
        return Resource.query({_id: {$in: qin}});
      };

      //instance methods

      Resource.prototype.$id = function () {
        if (this._id && this._id.$oid) {
          return this._id.$oid;
        } else if (this._id) {
          return this._id;
        }
      };

      Resource.prototype.$save = function () {
        return $http.post(collectionUrl, this, {params: defaultParams}).then(resourceRespTransform);
      };

      Resource.prototype.$update = function () {
        return  $http.put(collectionUrl + "/" + this.$id(), angular.extend({}, this, {_id: undefined}), {params: defaultParams})
          .then(resourceRespTransform);
      };

      Resource.prototype.$saveOrUpdate = function () {
        return this.$id() ? this.$update() : this.$save();
      };

      Resource.prototype.$remove = function () {
        return $http['delete'](collectionUrl + "/" + this.$id(), {params: defaultParams}).then(resourceRespTransform);
      };


      return Resource;
    }

    return MmongolabResourceFactory;
  }]);