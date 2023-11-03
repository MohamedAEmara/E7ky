# E7ky. 

I'm here to hear you.
## Features

- User authentication using Google OAuth.
- Create and manage stories with the option to set them as public or private.
- Public stories section accessible to all users.
- User-specific dashboard with the ability to edit, delete, and view stories.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Database Configuration](#database-configuration)
- [Views and Templates](#views-and-templates)
- [Demo Link](#demo-link)
- [Configuration](#configuration)
- [Author](#author)




## Installation

1. Clone this repository. `git clone git@github.com:MohamedAEmara/E7ky.git`
2. Install dependencies using `npm install`.
3. Set up your environment variables, including Google OAuth credentials, and  database connection setup.

```env 
# config.env (in the root)
# ------------------------
PORT=3000
NODE_ENV=development

# Register to google authenticaion from this URL: https://console.cloud.google.com/
# Then go to "APIs & Services" and follow the instruction
# Replace the XXXXXXXXXXX below with google_client id & secret
GOOGLE_CLIENT_ID=XXXXXXXXXXX
GOOGLE_CLIENT_SECRET=XXXXXXXXXXX

```
4. Start the application using `npm start`.

## Usage

- To create a new story, log in with your Google account.
- Once logged in, you can create a story and choose to make it public or private.
- To view public stories, navigate to the "Public Stories" section.
- Access your dashboard to manage your stories, including editing and deleting.


## Database Configuration

### Database Setup

- Ensure MongoDB is installed. Download and install MongoDB from [the official MongoDB website](https://www.mongodb.com/try/download/community).
- Start MongoDB with `mongod`.

### Database Connection

- I use Mongoose to connect to MongoDB.
- Configure the connection string in the `config.env` file:
  ```plaintext
  CONNECTION_STRING=mongodb://localhost:27017/mydatabase

## Views and Templates

Describe how your Handlebars (.hbs) templates are structured and where they are located. Provide examples if necessary.


## Main Dependencies

- **express**  - A fast and widely used web framework for Node.js.
- **mongoose**  - A powerful MongoDB object modeling tool for Node.js.
- **passport**  - An essential authentication middleware for Node.js.
- **passport-google-oauth20**  - A Passport strategy for Google OAuth 2.0 authentication.
- **mongodb**  - The official MongoDB driver for Node.js.

These core dependencies are fundamental to the functionality and authentication features of the project. Be sure to install them using `npm install` before running your project.


## Demo

Check out the live demo at [E7ky](https://e7ky.onrender.com/)


## Author

- [Mohamed Emara](https://github.com/MohamedAEmara)


