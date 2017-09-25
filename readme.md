# BlogMac
### Another blogging platform / CMS built on NodeJS, Express, and Mongoose

I am currently building this blogging CMS for personal use & fun.

Features
----
###### 1st version features (I will publish my personal blog with these features)
- [x] User Authentication and Registration
    - [x] Extensible permissions system (partial)
    - [x] Login
    - [x] Registration
- [x] Markdown based blogposts with code syntax highlighting
- [x] Ajax based front end (for endless scrolling)
- [ ] Admin interface
    - [x] Managing user roles
    - [ ] Manage users
    - [ ] Sending Registration invites
    - [ ] Manage Blog Posts
    - [ ] Manage Custom Pages (DEPENDENCY: Custom Pages)
    - [ ] Statistics Dashboard
- [X] Configuration interface (Changing global site values, changing site behavior)
- [ ] Completely RESTful API (partial for v1)
- [ ] Initial Configuration scripts
- [ ] Custom Pages


Setup
----

To set up:

1. Clone the repository to your local machine
2. run ```npm install```
3. Create a mongodb database and add 4 documents blogposts, configurations, userroles, and users. TODO: Script this
4. Initialize the docs for the database (add admin user + userrole, set configurations) TODO: Script this
4. Create a config.js file that exports your mongodb connection string and the cookie secret
    ```javascript
    var mongoPwd = "thisisacomplexpassword",
        mongoUser = "database-user";


    module.exports = {
        url: 'mongodb://' + mongoUser + ':' + mongoPwd + '@<database-server-url>:<server-port>/<name-of-database>',
        cookieSecret : 'bestsecretever'
    };
    ```
5. Run ```npm run dev``` to start nodemon, optionally you can run ```grunt dev``` to run the server and other dev build tools.
6. You're up and running, you will still need to create a user and give him the right permission level via your mongodb configuration interface. (TODO: Make this not stupid)


