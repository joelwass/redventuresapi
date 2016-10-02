# redventuresapi

to get set up - i started a postgres local server and imported the csv data into it for the tables of user - city - and state.

the user table was a little sparse to start out with and with my little database schema they would never be authenticated users (or valid users) because they don't have emails or passwords.....

One thing I'd like to bring up is the ambiguity on what the endpoints should return. "Return a list of cities the user has visited": that could mean an array of strings of cities the user has visited, or it could also means an array of city objects where the user has been. I went with the former, however in a real API the latter would make more sense. This same situation applies for the list of states the user has been too...

So the logic is a little weird, since i wasn't sure how to handle if someone visited a city that wasn't in the city database (since all they're inputting is a city name). so basically a user can visit a city, and if it isn't a known city, then the api will create a new city in the database with just a name field (not even associated with a state...). Basically the api is kinda wonky and i'd redo it way differently if i could mess with the endpoint structure and required parameters.

All of my environmental variables are in the .env file, which uses an npm package dotenv to use the variables i initialize in the .env file throughout the project as environmental variables. 

## To get up and running ## 
* you need to set yourself up with a postgres database
* open (i use pgadmin3) postgres
* create a red_ventures_local database 
* create a postgres user called: appuser, with the password: 3\=u*9U}aSK'zD#tv
* The postgres local database should be running on 127.0.0.1
* run `npm start` to fire up the server
* access the docs at http://localhost:3001/api-docs/

## To Test ##
* run `npm test` 
* tests are made with Mocha and Should, you must have the local database set up to run tests





