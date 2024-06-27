import gulp from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import ttf2woff from 'gulp-ttf2woff';
import ttf2woff2 from 'gulp-ttf2woff2';
const sass = gulpSass(dartSass);
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import imagemin from 'gulp-imagemin';
import { deleteAsync } from 'del';
import browserSync from 'browser-sync';
import newer from 'gulp-newer';
import plumber from 'gulp-plumber';
import fileInclude from 'gulp-file-include';

const bs = browserSync.create();

const paths = {
    styles: 'src/scss/**/*.scss',
    scripts: 'src/js/**/*.js',
    images: 'src/img/**/*',
    fonts: 'src/fonts/**/*.ttf',
    html: 'src/**/*.html',
    dist: 'dist',
};

gulp.task('styles', () =>
    gulp.src(paths.styles)
        .pipe(plumber())
        .pipe(newer(`${paths.dist}/css`))
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest(`${paths.dist}/css`)) // Save the minified file with .min.css extension
        .pipe(gulp.dest(`${paths.dist}/css`)) // Copy the original file to the destination
        .pipe(bs.stream())
);


gulp.task('scripts', () =>
    gulp.src(paths.scripts)
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(`${paths.dist}/js`))
        .pipe(bs.stream())
);

gulp.task('images', () =>
    gulp.src(paths.images)
        .pipe(newer(`${paths.dist}/img`))
        .pipe(imagemin())
        .pipe(gulp.dest(`${paths.dist}/img`))
);

gulp.task('html', () =>
    gulp.src('src/index.html')
        .pipe(plumber())
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(paths.dist))
        .pipe(bs.stream({ once: true }))
);

gulp.task('fonts', () =>
    gulp.src(paths.fonts)
        .pipe(newer(`${paths.dist}/fonts`))
        .pipe(ttf2woff())
        .pipe(gulp.dest(`${paths.dist}/fonts`))
        .pipe(gulp.src(paths.fonts))
        .pipe(ttf2woff2())
        .pipe(gulp.dest(`${paths.dist}/fonts`))
);

gulp.task('copyHtml', () =>
    gulp.src('src/index.html')
        .pipe(newer(paths.dist))
        .pipe(gulp.dest(paths.dist))
        .pipe(bs.stream())
);

gulp.task('cleanDist', () => deleteAsync(paths.dist));

gulp.task('default', gulp.series('cleanDist', 'styles', 'scripts', 'images', 'html', 'fonts', 'copyHtml', () => {
    bs.init({
        server: {
            baseDir: paths.dist,
        },
    });

    gulp.watch(paths.styles, gulp.parallel('styles'));
    gulp.watch(paths.scripts, gulp.parallel('scripts'));
    gulp.watch(paths.images, gulp.parallel('images'));
    gulp.watch(paths.html, gulp.parallel('html'));
    gulp.watch(paths.fonts, gulp.parallel('fonts'));
    gulp.watch('src/*.html').on('change', bs.reload);
}));
