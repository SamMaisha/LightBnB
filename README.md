# LightBnB

A simple multi-page airbnb clone that uses a server side Javascript to display the information from queries to web pages via SQL queries

Lighthouse BnB is an app that will revolutionize the travel industry. It will allow homeowners to rent out their homes to people on vacation, creating an alternative to hotels and bed and breakfasts...There’s nothing else like it! Users can view property information, book reservations, view their reservations, and write reviews. We'll be creating the first ever application to do something like this and we will call it LighthouseBnB

## Features

- Search for listings
- Create Listings
- See your own listings
- See your reservations

## Dependencies

- node.js
- express
- bcryptjs
- body-parser
- cookie-session
- nodemon
- pg

## Setting up DB

- run 'psql' in terminal and run command `CREATE DATABASE lightbnb`
- run command `\c lightbnb` to get into the database
- from psql session, type `\i migrations/01_schema.sql` - this will create all the necessary tables
- type `i/seeds/01_seeds.sql` , `i/seeds/02_seeds.sql` to populate tables with the seed data

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the app `npm run local` and view it at `localhost:3000`.
- The app will be served at `http://localhost:3000/`

# ERD

!["Screenshot of ERD"](https://github.com/SamMaisha/LightBnB/blob/master/LightBnB_WebApp-master/docs/lightbnb_ERD.png?raw=true)

## Project Structure

```
├── public
│   ├── index.html
│   ├── javascript
│   │   ├── components
│   │   │   ├── header.js
│   │   │   ├── login_form.js
│   │   │   ├── new_property_form.js
│   │   │   ├── property_listing.js
│   │   │   ├── property_listings.js
│   │   │   ├── search_form.js
│   │   │   └── signup_form.js
│   │   ├── index.js
│   │   ├── libraries
│   │   ├── network.js
│   │   └── views_manager.js
│   └── styles
├── sass
└── server
  ├── apiRoutes.js
  ├── database.js
  ├── json
  ├── server.js
  └── userRoutes.js
```

- `public` contains all of the HTML, CSS, and client side JavaScript.
  - `index.html` is the entry point to the application. It's the only html page because this is a single page application.
  - `javascript` contains all of the client side javascript files.
    - `index.js` starts up the application by rendering the listings.
    - `network.js` manages all ajax requests to the server.
    - `views_manager.js` manages which components appear on screen.
    - `components` contains all of the individual html components. They are all created using jQuery.
- `sass` contains all of the sass files.
- `server` contains all of the server side and database code.
  - `server.js` is the entry point to the application. This connects the routes to the database.
  - `apiRoutes.js` and `userRoutes.js` are responsible for any HTTP requests to `/users/something` or `/api/something`.
  - `json` is a directory that contains a bunch of dummy data in `.json` files.
  - `database.js` is responsible for all queries to the database. It doesn't currently connect to any database, all it does is return data from `.json` files.
