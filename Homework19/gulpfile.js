const {src, dest, series, watch} = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const sync = require('browser-sync').create();


function generateCSS(cb) {
    src('./scss/**/*.scss') 
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: "compressed"}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(dest('assets/css'))
    .pipe(sync.stream());
    cb();
}
function minCSS(cb) {
    src(['assets/css/*.css'])
    .pipe(concat('style.min.css'))
    .pipe(dest('css/'))
    .pipe(sync.stream());
    cb();
}

function minJS(cb) {
    src(['assets/js/*.js'])
    .pipe(concat('all.min.js'))
    .pipe(dest('js/'))
    .pipe(sync.stream());
    cb();
}


function watchFiles(cb) {
    watch('scss/**.scss', generateCSS);
    watch(['assets/js/*.js', '!node_modules/**'], minJS);
}

function browserSync(cb) {
    sync.init({
        server: {
            baseDir: "./"
        }
    });
    watch('scss/**.scss', generateCSS);
    watch('assets/**/**.css', minCSS);
    watch(['assets/js/*.js', '!node_modules/**'], minJS);
    watch('**.html').on('change', sync.reload);
}

exports.css = generateCSS;
exports.minCSS = minCSS;
exports.watch = watchFiles;
exports.default = series(generateCSS, minCSS, minJS, browserSync);
