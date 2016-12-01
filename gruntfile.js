module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        concat: {
            dist: {
                src : ['public/css/scss/*.scss'],
                dest : 'public/css/dist/style.scss'
            }
        },
        sass: {
            dist: {
                files: {
                    'public/css/style.css' : 'public/css/dist/style.scss'
                }
            }
        },
        watch:{
            css:{
                files: 'public/css/scss/**/*.scss',
                tasks: ['concat','sass']
            }
        }
    });

grunt.registerTask('style', ['concat','sass']);

};

