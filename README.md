# College Rep App
## Getting started
Fork and clone this repo, then run `npm install`.
You will want to use Postgres to create a `repapp` database and user. In your shell:
```
$ psql postgres
> CREATE DATABASE repapp;
> CREATE ROLE repapp WITH LOGIN;
> GRANT ALL ON DATABASE "repapp" TO repapp;
> \q
```
From the root `repapp` directory, you can run:
- `node server/start` to sync models with your database and start the server
- `npm run build` to compile your frontend Vue components (more on this below)
- `npm run dev` to run a dev server useful for developing your Vue components (more below)

## The front end
The front end is written in Vue. To add a new Vue component:
- Create a new `.vue` file in the `frontend` directory.
- In the `<script>` tag of the parent component, e.g. `App.vue`, add the line `import ComponentName from './ComponentName.vue'`
- In the `export default {...}` object, add a field called `components` if it doesn't already exist. The `components` field stores information about child components. Add your new component to that list: `components: {ComponentName}`.
- In the template for the parent component, use your component by inserting kebab-cased tags: `<component-name></component-name>`.
While developing the front-end, you may find it useful to use the Webpack Dev Server, which auto-compiles and hot-reloads any changes you make to the Vue code. Use `node run dev` from the main `repapp` directory to start the Webpack Dev Server. Use `node run build` to compile the Vue code into the `public/dist` directory, where it can be served by our hand-rolled server.

## The back end
The `server` folder contains the following:
- `config/config.json`: contains a URI for connecting to the database. If your database is set up properly, you should not need to change this.
- `models/index.js`: connects to the database using the config specified in `config/config.json`, then loads all the models defined in the `models` directory. When someone in another file does `require('models')`, this file is loaded, and the object returned contains each model. (This file also calls `model.associate(...)` on each model, where `associate` is an optional method defined on the model that defines inter-table relationships. See "Adding models" below.) 
- `app.js`: exports the Express app, fully configured with middleware and routing.
- `start.js`: syncs the database models before starting the server.

## Adding models
Each model should be defined as a separate file in `server/models`. The code for a model should look like this:
```javascript
module.exports = function(sequelize, DataTypes) {
  const Student = sequelize.define('student', {
    email: DataTypes.STRING,
    givenName: DataTypes.STRING,
    familyName: DataTypes.STRING,
    grade: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // index.js calls this function on each model, passing in refs to all other models
        Student.belongsToMany(models.course, {through: 'classmembers'})
      }
    }
  })
  
  // Finally, return the model
  return Student
}
```
