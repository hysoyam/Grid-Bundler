import gulp from 'gulp'
import gulpif from 'gulp-if'
import babel from 'gulp-babel'
import sourcemaps from 'gulp-sourcemaps'
import terser from "gulp-terser";
import concat from 'gulp-concat'
import htmlmin from 'gulp-htmlmin'
import cleanCcs from 'gulp-clean-css'
import autoPrefixer from 'gulp-autoprefixer'
import svgSprite from 'gulp-svg-sprite'
import image from 'gulp-image'
import notify from 'gulp-notify'
import del from 'del'
import browserSyncLib from 'browser-sync'
import gulpIf from 'gulp-if';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import ttfToWoff2 from 'gulp-ttftowoff2'


const sass = gulpSass(dartSass);

const browserSync = browserSyncLib.create()
const src = gulp.src
const dest = gulp.dest
const series = gulp.series
const parallel = gulp.parallel
const watch = gulp.watch

const PATH = '_public'

const HTMLpath = [
  'src/html/head.html',
  'src/html/header.html',
  'src/html/main.html',
  'src/html/footer.html'
]

const CSSpath = [
  'src/styles/common.scss',
  'src/styles/header.scss',
  'src/styles/hero.scss',
  'src/styles/about.scss',
  'src/styles/projects.scss',
  'src/styles/contacts.scss',
  'src/styles/footer.scss',
  'src/styles/*.scss',
]

const isProd = process.argv.includes('--production') || false

const clean = () => {
  return del(PATH)
}


// from scss to css
const styles = () => {

  return src(CSSpath)

    .pipe(gulpIf(!isProd, sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('main.css'))
    .pipe(gulpIf(isProd, autoPrefixer({
      cascade: false,
    })))
    .pipe(gulpIf(isProd, cleanCcs({
      level: 2
    })))
    .pipe(gulpIf(!isProd, sourcemaps.write('/src')))
    .pipe(dest(PATH + '/css'))
    .pipe(gulpIf(!isProd, browserSync.stream()))
}

const html = () => {
  return src(HTMLpath)
    .pipe(concat('index.html'))
    .pipe(gulpIf(isProd, htmlmin({
      collapseWhitespace: true,
      removeComments: true,
    })))
    .pipe(dest(PATH))
    .pipe(gulpIf(!isProd, browserSync.stream()))


}

const svgConfig = {
  mode: {
    stack: {
      sprite: '../sprite.svg'
    }
  }
}

const svgConfigSymbol = {
  mode: {
    symbol: {
      sprite: '../sprite.svg'
    },
  }
}


const svgSprites = () => {
  return src('src/images/svg/**/*.svg')
    .pipe(svgSprite(svgConfigSymbol))
    .pipe(dest(PATH + '/images'))

}

const images = () => {
  return src([
    'src/images/**/*.jpg',
    'src/images/**/*.jpeg',
    'src/images/*.svg',
    'src/images/**/*.png'
  ])
    .pipe(gulpif(isProd, image()))
    .pipe(dest(PATH + '/images'))
}

const watchFiles = (cb) => {
  if (isProd) return cb()

  browserSync.init({
    server: {
      baseDir: PATH
    }
  })

  watch('src/**/*.html', html)
  watch('src/**/*.scss', styles)
  watch('src/images/**/*.svg', svgSprites)
  watch('src/js/**/*.js', scripts)
  watch('src/fonts/*.ttf', fontsTTFToWoff2)
}

const fontsTTFToWoff2 = () => {
  return (src(
    'src/fonts/*.ttf'
  ))
    .pipe(ttfToWoff2())
    .pipe(dest('src/fonts/'))
}
const fonts = () => {
  return (src(
    'src/fonts/*.woff2'
  ))
    .pipe(dest(PATH + '/fonts'))
}

const scripts = () => {
  return src([
    'src/js/**/*.js',
    'src/js/index.js',
  ])
    .pipe(gulpif(!isProd, sourcemaps.init()))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(concat('index.js'))
    .pipe(gulpif(isProd, terser({
      toplevel: true
    })).on('error', notify.onError()))
    .pipe(gulpif(!isProd, sourcemaps.write('/src')))
    .pipe(dest(PATH + '/js'))
    .pipe(gulpIf(!isProd, browserSync.stream()))
}

export default series(clean, html, styles, scripts, images, fonts, svgSprites, watchFiles)

export { fontsTTFToWoff2 as convertFontsToWoff2, images, svgSprites as svg }
