# BlogMac
## a blogging platform built on NodeJS, Express, and Mongoose

I am currently building this blogging platform (soon to be CMS?) for personal use.

----

Setup
----

To set up:

1. Clone the repository to your local machine
2. run ```npm install```
3. Create a directory named 'data', with a subfolder named 'blog'.
4. Create a database.js file that exports your mongodb connection string
    ```javascript
    var mongoPwd = "thisisacomplexpassword",
        mongoUser = "database-user";


    module.exports = {
        url: 'mongodb://' + mongoUser + ':' + mongoPwd + '@<database-server-url>:<server-port>/<name-of-database>'
    };
    ```
5. Run ```npm run dev``` to start nodemon
6. You're up and running, you will still need to create a user and give him the right permission level via your mongodb conmfiguration interface. (TODO: Make this not stupid)


