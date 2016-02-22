var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
//var reactify = require('reactify');
var notifier = require('node-notifier');
var server = require('gulp-server-livereload');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var minifyCss = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var processhtml = require('gulp-processhtml');
var clean = require('gulp-clean');
var debug = require('gulp-debug');
var del = require('del');

var notify = function(error) {
  var message = 'In: ';
  var title = 'Error: ';

  if(error.description) {
    title += error.description;
  } else if (error.message) {
    title += error.message;
  }

  if(error.filename) {
    var file = error.filename.split('/');
    message += file[file.length-1];
  }

  if(error.lineNumber) {
    message += '\nOn Line: ' + error.lineNumber;
  }

  notifier.notify({title: title, message: message});
};

/*var bundler = watchify(browserify({
  entries: ['./src/app.jsx'],
  transform: [reactify],
  extensions: ['.jsx'],
  debug: true,
  cache: {},
  packageCache: {},
  fullPaths: true
}));

function bundle() {
  return bundler
    .bundle()
    .on('error', notify)
    .pipe(source('main.js'))
    .pipe(gulp.dest('./'))
}
bundler.on('update', bundle);

gulp.task('build', function() {
  bundle()
});*/

gulp.task('images', function () {
  gulp.src('./images/**/*.{png,jpg,jpeg,gif}')
    .pipe(debug())
    .pipe(gulp.dest('public/images'))
});

gulp.task('templates', function () {
  gulp.src('./modules/*.tmpl.html')
    .pipe(debug())
    .pipe(gulp.dest('public/modules'))
});

gulp.task('fonts', function () {
  gulp.src('./fonts/*.*')
    .pipe(debug())
    .pipe(gulp.dest('public/fonts'))
});

gulp.task('views', function () {
  gulp.src('./views/*.*')
    .pipe(debug())
    .pipe(gulp.dest('public/views'))
});

gulp.task('additional', function () {
  gulp.src(['upload.php','delete.php','favicon.ico'])
    .pipe(debug())
    .pipe(gulp.dest('public'))
});

gulp.task('processhtml', function () {
  gulp.src(['admin.html','auto.html'])
    .pipe(debug())
    .pipe(processhtml())
    .pipe(gulp.dest('public'))
});

gulp.task('styles', function () {
  gulp.src(['./css/themes/yeti/bootstrap.min.css', './css/font-awesome.css', './css/sweetalert.css','./css/creative.css'])
    .pipe(debug())
    //.pipe(sourcemaps.init())
    //.pipe(sourcemaps.write())
    .pipe(concat('bundle.min.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest('public/styles'))
});

gulp.task('clean', function () {
  return del('public');
});

gulp.task('javascript:admin', function () {
  gulp.src(['angular.js', './ngmodules/*.js', 'md5.min.js','sweetalert.min.js',
    'angular-locale_ru-ru.js', 'jquery-latest.js','bootstrap.min.js' , './modules/config.admin.js' , 
    './modules/directives.js', './modules/factories.js', './controllers/adminControllers.js', './controllers/adminProductController.js'])
    .pipe(debug())
    .pipe(uglify())
    .pipe(concat('bundle_admin.min.js'))
    .pipe(gulp.dest('public/scripts'))
});

gulp.task('javascript:auto', function () {
  gulp.src(['angular.js', './ngmodules/*.js', 'md5.min.js','./weetalert.min.js',
    './angular-locale_ru-ru.js', 'jquery-latest.js','bootstrap.min.js', './modules/config.auto.js',
    './modules/directives.js', './modules/factories.js',
    './controllers/autoControllers.js', './controllers/autoProductController.js'])
    .pipe(debug())
    .pipe(uglify())
    .pipe(concat('bundle_auto.min.js'))
    .pipe(gulp.dest('public/scripts'))
});

gulp.task('javascript', ['javascript:admin','javascript:auto']);

gulp.task('prod',['javascript','images','styles','templates', 'fonts','views','additional','processhtml']);

/*gulp.task('serve', function(done) {
  gulp.src('')
    .pipe(server({
      livereload: {
        enable: true,
        filter: function(filePath, cb) {
          if(/main.js/.test(filePath)) {
            cb(true)
          } else if(/style.css/.test(filePath)){
            cb(true)
          }
        }
      },
      open: true
    }));
});
*/

gulp.task('sass', function () {
  gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./'));
});

//gulp.task('default', ['build', 'serve', 'sass', 'watch']);

gulp.task('watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass']);
});