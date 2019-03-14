//Settings
var baseFolder = 'app',
    buildFolder = 'dist';
    
//Plugins
var gulp          = require('gulp'),
    pug           = require('gulp-pug'),
    sass          = require('gulp-sass'),
    browserSync   = require('browser-sync'),
    autoprefixer  = require('gulp-autoprefixer'),
    concat        = require('gulp-concat'),
    uglify        = require('gulp-uglify'),
    minCss        = require('gulp-clean-css'),
    imagemin      = require('gulp-imagemin'),
    cache         = require('gulp-cache'),
    clean         = require('gulp-clean'),
    rename        = require('gulp-rename');

//Pug    
gulp.task('pug', function(){
  return gulp.src('pug/**/*.pug')
  .pipe(pug({
    pretty: true
  }))
  .pipe(gulp.dest(baseFolder))
  .pipe(browserSync.reload({stream: true}))
});

//Styles
gulp.task('sass', function(){
  return gulp.src(baseFolder+'/sass/**/*.sass')
  .pipe(sass({
    outputStyle: 'expanded'
  }).on('error', sass.logError))
  .pipe(autoprefixer({
   browsers: ['last 15 versions'],
   cascade: false
  }))
  .pipe(minCss())
  .pipe(rename({
   // prefix: "min-",
   suffix: ".min",
   // extname: ".css"
  })) 
  .pipe(gulp.dest(baseFolder+'/css'))
  .pipe(browserSync.reload({stream: true}))
});

//Scripts
gulp.task('js', function(){
  return gulp.src([
    baseFolder+'/libs/jquery/dist/jquery.min.js',
    baseFolder+'/js/common.js'
  ])
  .pipe(concat('all-scripts.js'))
  .pipe(uglify())
  .pipe(rename({
    // prefix: "min-",
    suffix: ".min",
    // extname: ".js"
  }))
  .pipe(gulp.dest(baseFolder+'/js'))
  .pipe(browserSync.reload({stream: true}))
});

//BrowserSync
gulp.task('browserSync' , function(){
  browserSync({
    server: {
      baseDir: baseFolder
    },
    notify: false,
    // tunnel: true,
    // tunnel: "project"
  });
});

// gulp.task('clean', function () {  
//   return gulp.src(buildFolder, {read: false})
//   .pipe(clean());
// });   


gulp.task('watch', function(){
  gulp.watch(baseFolder+'/sass/**/*.sass', gulp.parallel('sass'));
  gulp.watch([baseFolder+'/js/**/*.js', '!'+baseFolder+'/js/*.min.js'], gulp.parallel('js'));
  gulp.watch('pug/**/*.pug', gulp.parallel('pug'));
});
gulp.task('default', gulp.parallel('watch', 'pug', 'sass', 'js', 'browserSync'));


