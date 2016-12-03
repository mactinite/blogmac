module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        sass: {
            dist: {
                files: {
                    'public/css/style.css' : 'public/css/scss/main.scss'
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

grunt.registerTask('style', ['sass']);

};

