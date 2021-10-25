### Express Model View Controller Pattern (MVC)

The following is an illustration of how we can apply an **MVC** concept to our **NodeJS** application using the **Express Framework** by using GIC Task API's

#### Prerequisites:

- node v14.15.4
- setup mongodb and update db connection path located at <a href=".env">.env</a>
- Major Code Reference are at <a href="app/routes/gic">Routes</a>, <a href="app/controllers/gic">Controller</a>, <a href="app/models">Schema</a>, <a href="configs/Connection.js">Mongo Connection Config</a>

#### How to Run:

- install all modules first by typing `npm install` or `yarn add`

- to run it please type `npm run dev` or `yarn run dev`

#### Endpoint Route:

  Task1: Drinks API for Both Coffee & Beers

| Name              | Endpoint Route                    | API Method |
| ----------------- | --------------------------------- | ---------- |
| Both Beer & Coffee              | http://localhost:3000/drinks       | GET |
| Get Beer  | http://localhost:3000/drinks?type=beer | GET |
| Get Coffee | http://localhost:3000/drinks?type=coffee | GET |

  Task2: Cafes & employees API

| Name              | Endpoint Route                    | API Method |
| ----------------- | --------------------------------- | ---------- |
| Create Cafe              | http://localhost:3000/cafe       | POST |
| Create Employee  | http://localhost:3000/cafe/employee | POST |
| Get Locations | http://localhost:3000/cafes?location=singapore | GET |
| Get Employees | http://localhost:3000/cafes/employees | GET |

 - For API Postman Collection Located At **./doc/GIC BackEnd API.postman_collection.json**


<a href="doc/GIC BackEnd API.postman_collection.json"> Click here for API Postman Collection</a>

#### Folder Structure:

- app
- controllers
- helpers
- libs
- middlewares
- models
- routes
- views
- configs
- core
- public

#### Structure:

- **app** a place that contains to store, all the functions of the application that we will make later

- **controller** a place that contains all the logic of the application such as to add student data, delete student data, etc

- **helper** a place that contains a helper function as a utility to use such as **custom message, custom email template** dll

- **libs** a place that contains for customizing libraries that we have installed such as **jwt, bcrypt** which we can later customize into a separate function to use

- **middleware** place containing for custom function middleware used for needs **auth jwt, auth role** dll

- **model** a place that contains for creating schema either with **mongodb or mongoose** which will later be used by **controller** as part of the application logic itself

- **route** a place that contains for the creation of routing in the application to pass functions from **controller to view**

- **config** a place that contains for making configurations from **database** or something else

- **core** controller or core place of application of **model**, **controller**, **route** and **view**

- **public** a place that contains for storing static assets such as **CSS**, **JavaScript**, **Images** etc.

## Here is an example of each function:

#### Core Controller

```javascript
class Controller {
  get(...rest) {
    return router.get(...arguments)
  }
  post(...rest) {
    return router.post(...arguments)
  }
  delete(...rest) {
    return router.delete(...arguments)
  }
  put(...rest) {
    return router.put(...arguments)
  }
}

module.exports = { Controller }
```

#### Core Model

```javascript
class Model {
  constructor(schema) {
    this.model = schema
  }

  findAll(value) {
    const { model, connection } = this
    connection()
    return model.find({ ...value }).lean()
  }
  findOne(value) {
    const { model } = this
    return model.findOne({ ...value }).lean()
  }
  findById(value) {
    const { model } = this
    return model.findById(value).lean()
  }
  findOneAndCreate(value) {
    const { model } = this
    return model.create({ ...value })
  }
  findOneAndDelete(value) {
    const { model } = this
    return model.findOneAndDelete({ ...value }).lean()
  }
  findOneAndUpdate(id, value) {
    const { model } = this
    return model.findOneAndUpdate({ ...id }, { $set: { ...value } }).lean()
  }
}

module.exports = { Model }
```

#### Core Route

```javascript
class Route {
  init() {
    return [
      //init home route
      new HomeRoute().route(),
      new AboutRoute().route(),

      //GIC
      new DrinksRoute().route(), //Covers both coffee and beers
      new CafesRoute().route(), //Get API to collect all cafes
      new CreateCafeRoute().route(), //POST API to create new cafe
      new CreateEmployeeRoute().route(), //POST API to create new employee
      new EmployeesRoute().route(), //Get API to collect all employees
    ]
  }
}

module.exports = { Route }
```

#### Core View

```javascript
class View {
  render(res, view, data) {
    res.render(resolve(process.cwd(), `app/views/${view}`), { ...data })
  }
}

module.exports = { View }
```

#### Config Connection

```javascript
class Connection extends Module {
  constructor() {
    super()
    this.db = this.mongoose()
  }
  async MongooseConnection() {
    const { db } = this
    const connection = await db.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false
    })

    if (!connection) return console.log('Database Connection Failed')
    return console.log('Database Connection Successfuly')
  }
}

module.exports = { Connection }
```

#### Config Module

```javascript
class Module {
  constructor(app) {
    this.app = app
  }
  dotenv() {
    const env = dotenv.config()
    return env
  }
  bodyParser() {
    const { app } = this

    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
  }
  mongoose() {
    mongoose.Promise = global.Promise
    return mongoose
  }
  morgan() {
    const { app } = this
    app.use(logger('dev'))
  }
  event() {
    const events = new EventEmitter()
    return events
  }

  jwt() {
    return jsonwebtoken
  }

  template() {
    const { app } = this
    app.set('views', path.resolve(process.cwd(), 'views'))
    app.set('view engine', 'ejs')
  }

  assets() {
    const { app } = this
    app.use(express.static(path.resolve(process.cwd(), 'public/assets/')))
  }
}

module.exports = { Module }
```

#### App Controller

```javascript
class CafesController extends Model {
  constructor() {
    super()
    this.model = new Model(cafesSchema)
  }

  async controller(req, res, next) {
    const { model } = this
    const filter = req.query
    console.log(req.query)
    const cafes = await model.findAll(filter)

    if (cafes.length < 1) {
      return new CustomeMessage(res).error(404, {
        response: {
          status: 'error',
          code: res.statusCode,
          method: req.method,
          message: 'Oops..data not exists or deleted from owner'
        }
      })
    }

    return new CustomeMessage(res).success(200, {
      response: {
        status: 'success',
        code: res.statusCode,
        method: req.method,
        message: 'Yeah..data already to use',
        data: _.sortBy( cafes, 'employees' ).reverse()
      }
    })
  }
}
module.exports = { CafesController }
```

#### App Route

```javascript
class CafesRoute extends Controller {
  constructor() {
    super()
    this.view = new View()
  }
  route() {
    return this.get('/cafes', (req, res) => new CafesController().controller(req, res))
  }
}

module.exports = { CafesRoute }
```

#### App

```javascript
class App extends Route {
  init() {
    if (cluster.isMaster) {
      let cpuCore = os.cpus().length
      for (let i = 0; i < cpuCore; i++) {
        cluster.fork()
      }
      cluster.on('online', (worker) => {
        if (worker.isConnected()) console.log(`worker is active ${worker.process.pid}`)
      })

      cluster.on('exit', (worker) => {
        if (worker.isDead()) console.log(`worker is dead ${worker.process.pid}`)
        cluster.fork()
      })
    } else {
      //init default route
      app.use(super.init())
      // listenint server port
      http.createServer(app).listen(process.env.PORT)
    }
  }
}

// init application
new App().init()
```
**Thank you by Aswin**
