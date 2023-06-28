const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');
const rev = require('gulp-rev');
const uglify = require('gulp-uglify-es').default;
const imagemin = require('gulp-imagemin');
const del = require('del');
const plugins = require('gulp-load-plugins');

gulp.task("css",function(done){
    console.log("Minifying CSS");
    // ** stands for all the folders/subfolers.
    // pipe is a function to call all the submiddlewares with the gulp.
    gulp.src("./assets/scss/**/*.scss")
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest("./assets/css"))
    .pipe(plugins.replace('url("../images/', 'url("' + yourDirectory));

    // console.log("Minified CSS");
    gulp.src("./assets/**/*.css")
    .pipe(rev())
    .pipe(gulp.dest("./public/assets"))
    .pipe(rev.manifest({
        cwd: "public",
        merge: true
    }))
    .pipe(gulp.dest("./public/assets"));
    done();
})

gulp.task("js",function(done){
    console.log("Minifying JS");
    gulp.src("./assets/**/*.js")
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
})

gulp.task("images",function(done){
    console.log("Compressing Images");
    gulp.src("./assets/**/*.+(png|jpg|gif|svg|jpeg)")
    .pipe(imagemin())
    .pipe(gulp.dest("./public/assets"))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest("./public/assets"));
    done();
})

// empty the /public/assets directory.
gulp.task("clean:assets",function(done){
    del.sync("./public/assets", {force: true});
    done();
})

gulp.task("build",gulp.series("clean:assets","css","js","images"),function(done){
    console.log("Building assets");
    done();
})