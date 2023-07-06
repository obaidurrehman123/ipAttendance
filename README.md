# IpBased Attendance System and Auth and Authorization on the basis of the permissions

## Table of Contents
- [Description](#description)
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [API Routes](#apiroutes)

# Description
This project is a Node.js-based API that provides various functionalities for user management, authentication, and an ip session based attendance system.
# Features
**1.User Management**: The API includes a super user who has the authority to create new users. Upon user creation, a password is generated for the user, along with their assigned permissions. This allows users to have controlled access to different parts of the system.

**2.User Authentication:** Once users are created, they can log in using their credentials. The API verifies the login information and grants access to the authenticated user.

**3.Product Manipulation:** After logging in, users have the ability to manipulate the product model. This includes adding, modifying, and deleting products based on their permissions. Users can perform various operations on the product model through the API endpoints.

**4.Attendance System:** The project also incorporates an attendance system. When a user logs in, their session starts automatically based on their IP address. The API retrieves the user's location information using the IP address. When the user logs out, the system records the duration of their session and stores it as their attendance outcome.

**5.Daily Attendance Record:** The API maintains a daily attendance record for each user, tracking the amount of time they spent on the system. This record can be accessed to monitor and analyze user activity on a daily basis.

## Requirements
```bash
- Node.js (version 18.13.0)
- npm (version 8.19.3)
- Postgresql Sequelize Orm (version 14.8) 
```
## Installation

**1.Clone the repository:** git clone https://github.com/obaidurrehman123/ipAttendance.git

**2.Install the dependencies:** npm install

**3.Set up the environment variables:** Open the `.env` file and configure the necessary variables such as database connection details, API keys, etc.

**4.Run the application:** npm run server

## Usage

1. Credential of logged in as an admin are you can edit in the config file present in the config folder.

2. Then you can create the user and give them the permissions can explore the permissions model and user model for it.

3. When the user will logged in to the system his ip shall get and start its attendance session on the basis of ip local and when he logout his session and we have maintained the hours what are the minimum hours he has spent in the office and mark attendance accordingly.

## Api Routes

**1. Creating a super user :** localhost:4000/api/v1/superuser/createSuper  "No need to add the data add the credentials in code file for user".

**2. Login as a superuser:** localhost:4000/api/v1/superuser/superuserlogin "Send the "email" and "password" through postman and get JWT token".

## Now you are successfully registered as a superuser and can create a user and assign permissions

## Note: Please note that in order to create a user, an authenticated token of superuser is required and provide that in headers.

**3.Create a user:** localhost:4000/api/v1/userroutes/addingUser 

**This is how you need to create a user through postman**

**Method:POST**
```bash
{
  "firstname":"ahmad",
  "lastname":"khalid awan",
  "email":"ahmadkhalid123456@gmail.com",
  "password":"12345678",
  "department":"administration",
  "role":"operations head",
  "canRead":true,
  "canCreate":true,
  "canDelete":false,
  "canUpdate":false
}
```
**Login as a user:** localhost:4000/api/v1/userroutes/loggedIn 

**Method:POST**
```bash
{
   "email":"ahmadkhalid123456@gmail.com",
   "password":"12345678"
}
```
## For updating and deleting an authenticated token of superuser is required and provide that in headers.

**Method:DELETE**

**Delete user:** localhost:4000/api/v1/userroutes/deleteUser/10 "pass an id in params"

**Method:Update**

**Update user:** localhost:4000/api/v1/userroutes/updateuser/9 "pass an id in params"

## For CRUD on product model you need to have permission so you need to provide token 

**Method:POST**

**creating product:** localhost:4000/api/v1/productroutes/addProduct

**Method:DELETE**

**Delete Product:** localhost:4000/api/v1/productroutes/deleteProduct/2

**Method:UPDATE**

**Update Product:** localhost:4000/api/v1/productroutes/updateProduct/1

## Now Discuus The Routes For Attendance

**First You need to store your ip with its location so you can compare it with the current ip of the user and get the location**

**IP Model CRUD **

**Method:POST**

**Create Ip Record:** localhost:4000/api/v1/iproute/addingip
```bash
{
  "ip":"139.135.52.22",
  "location":"pf4-groundfloor"
}
```
**Method:UPDATE**

**Update Ip:** localhost:4000/api/v1/iproute/updateIp/2

**Method:DELETE**

**Delete Ip:** localhost:4000/api/v1/iproute/deleteIp/2

**Method:POST**

**Logout User:** localhost:4000/api/v1/userroutes/logout

**For Getting The Attendance Record**

localhost:4000/api/v1/attendance/fetchattendence/12

















   












