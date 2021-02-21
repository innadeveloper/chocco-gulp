const { src, dest, task, series, watch, parallel } = require("gulp");
const rm = require('gulp-rm');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const sassGlob = require('gulp-sass-glob');
//const autoprefixer = require('gulp-autoprefixer');
//const px2rem = require('gulp-smile-px2rem');
//const gcmq = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
//const babel = require('gulp-babel');
//const uglify = require('gulp-uglify');
const terser = require('gulp-terser');
const svgo = require('gulp-svgo');
const svgSprite = require('gulp-svg-sprite');
const gulpif = require('gulp-if');
const imagemin = require('gulp-imagemin');

const env = process.env.NODE_ENV;

const {SRC_PATH, DIST_PATH, STYLE_LIBS, JS_LIBS} = require('./gulp.config');
 
sass.compiler = require('node-sass');
 
task('clean', () => {
  return src(`${DIST_PATH}/**/*`, { read: false })
  .pipe(rm())
})

task('copy:html', () => {
 return src(`${SRC_PATH}/*.html`)
   .pipe(dest(DIST_PATH))
   .pipe(reload({ stream: true }));
})

task('copy:svg', () => {
  return src(`${SRC_PATH}/**/*.svg`)
    .pipe(dest(DIST_PATH))
    .pipe(reload({ stream: true }));
})
  
task('styles', () => {
  return src([...STYLE_LIBS, `${SRC_PATH}/css/main.scss`])
 .pipe(gulpif(env === 'dev', sourcemaps.init()))
 .pipe(concat('main.min.scss'))
 .pipe(sassGlob())
 .pipe(sass().on('error', sass.logError))
  //.pipe(px2rem())
  /* .pipe(gulpif(env === 'prod', autoprefixer({
       browsers: ['last 2 versions'],
       cascade: false
     })))
  .pipe(gulpif(env === 'prod', gcmq())) */
  .pipe(gulpif(env === 'prod', cleanCSS()))
  .pipe(gulpif(env === 'dev', sourcemaps.write()))
  /* .pipe(autoprefixer({
     browsers: ['last 2 versions'],
     cascade: false
  })) */
  //.pipe(gcmq())
  /*  .pipe(cleanCSS())
  .pipe(sourcemaps.write()) */
  .pipe(dest(DIST_PATH))
  .pipe(reload({ stream: true }));
});

task('scripts', () => {
  return src([...JS_LIBS, `${SRC_PATH}/js/*.js`])
  .pipe(gulpif(env === 'dev', sourcemaps.init()))
  .pipe(concat('main.min.js', {newLine: ';'}))
  /* .pipe(babel({
        presets: ['@babel/env']
  })) */
  // .pipe(uglify())
  /* .pipe(gulpif(env === 'prod', babel({
      presets: ['@babel/env']
  }))) */
  /* .pipe(terser())  */
  /*  .pipe(sourcemaps.write()) */
  /*  .pipe(gulpif(env === 'prod', babel({
      presets: ['@babel/env']
  }))) */
  .pipe(gulpif(env === 'prod', terser()))
  .pipe(gulpif(env === 'dev', sourcemaps.write()))
  .pipe(dest(DIST_PATH))
  .pipe(reload({ stream: true }));
});

task('icons', () => {
  return src(`${SRC_PATH}/img/icons/*.svg`)
    .pipe(svgo({
      plugins: [
        {
          removeAttrs: {
            attrs: '(fill|stroke|style|width|height|data.*)'
          }
        }
      ]
    }))
    .pipe(svgSprite({
      mode: {
        symbol: {
          sprite: '../sprite.svg'
        }
      }
    }))
    .pipe(dest(`${DIST_PATH}/img/icons`));
 });

task('images', () => {
  return src(`${SRC_PATH}/img/**/*.{jpg,jpeg,png}`)
  .pipe(imagemin())
  .pipe(dest(`${DIST_PATH}/img/`));
})

task('server', () => {
  browserSync.init({
    server: {
      baseDir: "./DIST_PATH"
    },
    open: true
  });
});
 
task('watch', () => {
  watch(`${SRC_PATH}/css/**/*.scss`, series('styles'));
  watch(`${SRC_PATH}/*.html`, series('copy:html'));
  watch(`${SRC_PATH}/**/*.svg`, series('copy:svg'));
  watch(`${SRC_PATH}/js/*.js`, series('scripts'));
  watch(`${SRC_PATH}/img/icons/*.svg`, series('icons'));
  watch(`${SRC_PATH}/img/**/*.{jpg,jpeg,png}`, series('images'));  
});

task(
  'build',
  series(
    'clean',
    parallel('copy:html', 'copy:svg', 'styles', 'scripts', 'icons', 'images'))
);
 
task(
  'default',
  series(
    'clean',
    parallel('copy:html', 'copy:svg', 'styles', 'scripts', 'icons', 'images'),
    parallel('watch', 'server')
 )
);