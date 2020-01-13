//Settings
var baseFolder  = 'app',
    pluginsFolder = 'node_modules';


var scriptsFileName = 'scripts';  

//Plugins
var gulp          = require('gulp'),
    sass          = require('gulp-sass'),
    browserSync   = require('browser-sync'),
    autoprefixer  = require('gulp-autoprefixer'),
    concat        = require('gulp-concat'),
    uglify        = require('gulp-uglify'),
    minCss        = require('gulp-clean-css'),
    rename        = require('gulp-rename'),
    svgSprite     = require('gulp-svg-sprite'),
    svgmin        = require('gulp-svgmin'),
    cheerio       = require('gulp-cheerio'),
    replace       = require('gulp-replace'),
    pug           = require('gulp-pug'),
    htmlbeautify  = require('gulp-html-beautify'),
    plumber       = require('gulp-plumber'),
    notify        = require('gulp-notify')
    prettify      = require('gulp-html-prettify');

    
//Styles
gulp.task('sass', function(){
  return gulp.src(baseFolder+'/sass/**/*.sass')
  .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
  .pipe(autoprefixer({
		grid: true,
		overrideBrowserslist: ['last 15 versions']
  }))
  .pipe(gulp.dest(baseFolder+'/css'))
  .pipe(minCss())
  .pipe(rename({ suffix: ".min" })) 
  .pipe(gulp.dest(baseFolder+'/css'))
  .pipe(browserSync.stream())
});

//Scripts
gulp.task('js', function(){
  return gulp.src([
    pluginsFolder+'/jquery/dist/jquery.js',
    // pluginsFolder+'/magnific-popup/dist/jquery.magnific-popup.js',
    // pluginsFolder+'/slick-carousel/slick/slick.js',
    baseFolder+'/js/common.js'
  ])
  .pipe(concat(scriptsFileName+'.js'))
  .pipe(gulp.dest(baseFolder+'/js'))
  .pipe(uglify())
  .pipe(rename({ suffix: ".min" }))
  .pipe(gulp.dest(baseFolder+'/js'))
  .pipe(browserSync.stream())
});

//Images
gulp.task('images', function(){
  return gulp.src(baseFolder+'/img/**/*.{png,jpg,jpeg,webp,raw,svg}')
  .pipe(browserSync.stream())
});

//SVG
gulp.task('svg', function(){
  return gulp.src(baseFolder+'/img/icons/svg/*.svg')
  .pipe(svgmin({
    js2svg: {
      pretty: true
    }
  }))
  .pipe(cheerio({
    run: function ($) {
      $('[fill]').removeAttr('fill');
      $('[stroke]').removeAttr('stroke');
      $('[style]').removeAttr('style');
    },
    parserOptions: {xmlMode: true}
  }))
  .pipe(replace('&gt;', '>'))
  .pipe(svgSprite({
    mode: {
      symbol: {
        sprite: "sprite.svg"
      }
    }
  }))
  .pipe(gulp.dest(baseFolder+'/img/icons/svg/'))
});

//HTML


gulp.task('pug', function(){
  return gulp.src(baseFolder+'/pug/*.pug')
  .pipe(plumber({
    errorHandler: notify.onError()
  }))
  .pipe(pug({
    pretty: true
  }))
  .pipe(prettify({indent_char: ' ', indent_size: 2}))
  .pipe(gulp.dest(baseFolder))
  .pipe(browserSync.stream())
});

//HTML
gulp.task('html', function() {
  return gulp.src(baseFolder+'/*.html')
	.pipe(browserSync.stream())
});



//BrowserSync
gulp.task('browserSync' , function(){
  browserSync({
    server: {
      baseDir: baseFolder
    },
    notify: false,
    // tunnel: true
  });
});

//Watch
gulp.task('watch', function(){
  gulp.watch(baseFolder+'/sass/**/*.sass', gulp.parallel('sass'));
  gulp.watch([baseFolder+'/js/**/*.js', '!'+baseFolder+'/js/*.min.js', '!'+baseFolder+'/js/'+scriptsFileName+'.js'], gulp.parallel('js'));
  gulp.watch(baseFolder+'/img/**/*', gulp.parallel('images'));
  gulp.watch(baseFolder+'/img/icons/svg/*.svg', gulp.parallel('svg'));
  gulp.watch(baseFolder+'/pug/**/*.pug', gulp.parallel('pug', 'html'));
  // gulp.watch(baseFolder+'/*.html', gulp.parallel('html'));
});

gulp.task('default', gulp.parallel('watch', 'sass', 'js', 'images', 'svg', 'pug', 'html', 'browserSync'));

