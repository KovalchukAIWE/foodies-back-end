# Foodies Backend

## Project Description

Foodies is a web platform designed to enhance your culinary skills. It offers recipes for beginners in the world of cooking, immersing you in the aromas and tastes of various cuisines.

This repository contains the backend code for the Foodies web platform, providing APIs to manage recipes, user authentication, testimonials, and more.

## Main Features

- **Recipe Management**: Add, update, delete, and retrieve recipes.
- **User Authentication**: Secure user registration and login.
- **Testimonials**: Users can leave reviews and testimonials.
- **Recipe Categories**: A wide selection of recipes categorized into "Beef", "Breakfast", "Desserts", "Lamb", "Goat", "Pasta", "Pork", "Seafood", "Side", "Starter", "Miscellaneous".

## Technologies

This project is developed using the following technologies:

### Backend

- **Node.js**: JavaScript runtime for executing code on the server.
- **Express**: A framework for building server applications.
- **MongoDB**: A database for storing information about recipes and users.
- **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js.
- **JWT (jsonwebtoken)**: For securing user authentication.
- **bcrypt**: For hashing passwords.
- **Joi**: For data validation.
- **multer**: For handling file uploads.
- **cloudinary**: For managing image uploads and storage.
- **swagger-ui-express**: For API documentation.
- **dotenv**: For managing environment variables.
- **cors**: For enabling Cross-Origin Resource Sharing.
- **morgan**: For logging HTTP requests.

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/foodies-backend.git
   cd foodies-backend
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add the following variables:
   ```env
   DB_HOST=<your-mongodb-uri>
   PORT=<your-port>
   JWT_SECRET=<your-jwt-secret>
   CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
   CLOUDINARY_API_KEY=<your-cloudinary-api-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
   ```

## Usage

1. Start the development server:

   ```sh
   npm run dev
   ```

2. For production, use:
   ```sh
   npm start
   ```

## API Documentation

API documentation is available at `/api-docs` once the server is running. It is built using Swagger UI.

## Scripts

- `npm start`: Start the application.
- `npm run dev`: Start the application in development mode using nodemon.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
