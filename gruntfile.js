module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        concurrent:{
            dev:['nodemon','watch'],
            options: {
                logConcurrentOutput: true
            }
        },
        sass: {
            dist: {
                files: {
                    'public/css/style.css' : 'public/css/scss/main.scss'
                }
            }
        },
        nodemon:{
            dev:{
                script: './bin/www',
                options: {
                    ext: 'js,hbs'
                }
            }
        },
        watch:{
            css:{
                files: 'public/css/scss/**/*.scss',
                tasks: ['sass']
            }
        }
    });
grunt.registerTask('dev', ['concurrent']);
grunt.registerTask('style', ['sass']);

};

