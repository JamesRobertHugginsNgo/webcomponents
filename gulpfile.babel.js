import autoPrefixer from 'gulp-autoprefixer';
import babel from 'gulp-babel';
import cssNano from 'gulp-cssnano';
import del from 'del';
import esLint from 'gulp-eslint';
import gulp from 'gulp';
import mustache from 'gulp-mustache';
import rename from 'gulp-rename';
import sass from 'gulp-sass';
import sourceMaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import webDependencies from 'gulp-web-dependencies';
import webServer from 'gulp-webserver';

export function clean() {
	return del('./dist');
}

const buildJsSrc = './src/**/*.js';
export function buildJs() {
	const buildJsDest = './dist/';
	return gulp.src(buildJsSrc)
		.pipe(mustache())
		.pipe(esLint())
		.pipe(esLint.format())
		.pipe(babel())
		.pipe(gulp.dest(buildJsDest))
		.pipe(rename((path) => path.basename += '.min'))
		.pipe(sourceMaps.init())
		.pipe(uglify())
		.pipe(sourceMaps.write('.'))
		.pipe(gulp.dest(buildJsDest));
}

const buildSassSrc = './src/**/*.scss';
export function buildSass() {
	const buildSassDest = './dist/';
	return gulp.src(buildSassSrc)
		.pipe(mustache())
		.pipe(sass())
		.pipe(autoPrefixer())
		.pipe(gulp.dest(buildSassDest))
		.pipe(rename((path) => path.basename += '.min'))
		.pipe(sourceMaps.init())
		.pipe(cssNano())
		.pipe(sourceMaps.write('.'))
		.pipe(gulp.dest(buildSassDest));
}

const buildHtmlSrc = './src/**/*.html';
export function buildHtml() {
	const buildHtmlDest = './dist/';
	return gulp.src(buildHtmlSrc)
		.pipe(mustache())
		.pipe(webDependencies({ dest: buildHtmlDest, prefix: './vendors/' }))
		.pipe(gulp.dest(buildHtmlDest));
}

export const build = gulp.series(clean, gulp.parallel(buildJs, buildSass, buildHtml));
export default build;

export function watch() {
	const servePath = '.';
	gulp.src(servePath)
		.pipe(webServer({
			directoryListing: { enable: true, path: servePath },
			livereload: true,
			open: true
		}));

	gulp.watch(buildJsSrc, buildJs);
	gulp.watch(buildSassSrc, buildSass);
	gulp.watch(buildHtmlSrc, buildHtml);

	const templateGlob = './src/**/*.template.html';
	gulp.watch(templateGlob, build);
}
export const serve = gulp.series(build, watch);
