# Important Note :
The dockerfile file has a copy directive where it copies a .env file to the image when building which, for obvious reasons, is not included in this repo.  
you have to make your own and it should include the following fields : 

**PORT**= port that the node server is going to listen on

**DBHOST**= your database host (should be 'postgres' unless you change it in the yml file)

**DB**= the name of your database (it is specified in the yml file and can be changed)

**DBUSER**= the database user (default is 'postgres' unless you change yml)

**DBPASSWORD**= database password (default is postgress unless you change yml)

**DBPORT**= port of the database (postgres image listens on 5432 by default)

**JWTPASS**= jwt encryption key
