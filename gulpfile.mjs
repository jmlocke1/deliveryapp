import gulp from 'gulp';
const { src, dest, watch, series, parallel } = gulp;

// CSS y SASS
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
// plumber evita que sass se detenga al encontrar un error
import plumber from 'gulp-plumber';
import postcss from 'gulp-postcss';

/**
 * En el package.json se debe añadir browserlist
 * Se pueden encontrar configuraciones varias en
 * https://browsersl.ist
 * 
 */
import autoprefixer from 'autoprefixer';
import sourcemaps from 'gulp-sourcemaps';
import cssnano from 'cssnano';

// Imágenes
import cache from 'gulp-cache';
import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';
import avif from 'gulp-avif';

function css( done ) {
	// Compilar sass
	// pasos: 1 - Identificar archivo, 2- Compilarla, 3 - Guardar el .css
	src('src/scss/app.scss')
		.pipe( plumber() )
		.pipe( sourcemaps.init() )
		// Compila css minificado
		// .pipe( sass({ outputStyle: 'compressed'}) )
		.pipe( sass() )
		.pipe( postcss([autoprefixer(), cssnano() ]) )
		.pipe( sourcemaps.write('.') )
		.pipe( dest('build/css') );
	done();
}

function imagenes () {
	return src('src/img/**/*')
		.pipe( cache(imagemin({ optimizationLevel: 3 })) )
		.pipe( dest('build/img') );
}

function versionWebp( done ) {
	src('src/img/**/*.{png,jpg}')
		.pipe( webp() )
		.pipe( dest('build/img') );
	done();
}

function versionAvif( done ) {
	const opciones = {
		quality: 30,
		lossless: true
	}
	src('src/img/**/*.{png,jpg}')
		.pipe( avif() )
		.pipe( dest('build/img') );
	done();
}

function dev( done ) {
	watch( 'src/scss/**/*.scss', css );
	watch('src/img/**/*', allImages)
	done();
}

const allImages = parallel( imagenes, versionWebp, versionAvif );
export {
	css as css,
	dev as dev,
	imagenes as imagenes,
	versionWebp as versionWebp,
	versionAvif,
	allImages
}
export default parallel( allImages, css, dev);