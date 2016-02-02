module.exports = {
	options: {
		separator: ';',
	},
	admin: {
		src: ['angular.js', 'ngmodules/*.js', 'md5.min.js','sweetalert.min.js',
		'angular-locale_ru-ru.js', 'jquery-latest.js','bootstrap.min.js' , 'modules/config.admin.js' , 
		'modules/directives.js', 'modules/factories.js', 'controllers/adminControllers.js', 'controllers/adminProductController.js'],
		dest: 'dist/scripts/bundle_admin.js',
	},
	auto: {
		src: ['angular.js', 'ngmodules/*.js', 'md5.min.js','sweetalert.min.js',
		'angular-locale_ru-ru.js', 'jquery-latest.js','bootstrap.min.js', 'modules/config.auto.js',
		'modules/directives.js', 'modules/factories.js',
		'controllers/autoControllers.js', 'controllers/autoProductController.js'],
		dest: 'dist/scripts/bundle_auto.js',
	},
	styles: {
		src: ['css/themes/yeti/bootstrap.min.css', 'css/font-awesome.css', 'css/sweetalert.css','css/creative.css'],
		dest: 'dist/styles/bundle.css',
	},
};