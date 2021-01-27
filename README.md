# THIS IS A BACK-END BOILERPLATE WITH JWT AUTHENTICATION
author: Sofian Saleh
## Technologies:

- Express
- Typescript
- Jsonwebtoken (JWT)
- PostgreSQL
- TypeORM
- MomentJS
- UUID
- BcryptJS

## Folder Structure
The folder structure are inherited from the Singleton pattern.

- src
  - Controllers: Here where we get all the requests where we call services and return the responses
  - dto (data transfer object): Holding the types from the response and request objects (Idea taken from fastify)
  - Entity: Self expalanitory here where we define the tables for the database
  - Error: we hold the error handlers
  - Middlewares: Where you create a middleware to go for your routes
  - Migrations
  - Security: Where we hold all the fuctions needed to make the api secure i.g(Password hashing, generating tokens ...etc)
  - Services: Here we hold the brains of the api called by the controllers it does the logic and returns it to the controllers
  - Util: any extra functions are put here.
  - App builder: This file you don't need to touch but it contains the logic so the express api runs it has the (Add controller, add middleware functions)
  - Database: is where we handle the database connections
  - Index: is the gateway to our application.

## The flow

Request -> controller -> service -> controlle -> response

#### To create a new end point
1. create a new file in the Controllers
2. export the class
   ```typescript
   export class NameHere extends BaseController {
       // call the service for this controlle
        private readonly nameHereService: NameHereService;
    constructor() {
        super();
        this.nameHereService = new NameHereServiceIMPL();
      }
    protected initializeEndpoints() {
   
        this.addAsyncPoint('POST', '/api/v1/name', this.FunctionHere);
  }
    public async FunctionHere = () =>{}
   }
```
3. Then create a service you have examples there to guide you
   
## Authentication
We use JWT to authenticate you have a Normal token and a Refresh Token both linked together in the normal token's payload there is a jwtId which hold the refresh token from the database so no duplicates are allowed.
    
the process goes this way:
1. A request sent to the end point.
2. A middleware will verify the token
3. if the token is valid then you procced to retrive the information
4. else you will be given an error 401 with unAuthorized
5. so in the front end you need to send a request with your token and refresh token to the refresh token route if your refresh token is vald you will be given a new token otherwise you will be given a 401 error.
   

## How to run
```bash
git clone {Repo link here}
cd back-end-boilerplate
yarn || npm install
yarn start || npm run start
```
## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
## License
[MIT](https://choosealicense.com/licenses/mit/)

## Author Links

- [LinkedIn](https://www.linkedin.com/in/sofian-saleh/)
- [Twitter](https://www.linkedin.com/in/sofian-saleh/)
- [Fiverr](https://www.fiverr.com/sofian_saleh)
- [YouTube](https://www.linkedin.com/in/sofian-saleh/)
- [Upwork](https://www.upwork.com/o/profiles/users/~01b615bb5702e41cd5/)
- [Freelancer](https://www.freelancer.com/u/SofianSaleh)
