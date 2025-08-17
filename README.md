# Website Metadata Analyzer API

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

This is a backend-only API designed to scrape metadata from a given website URL, enhance its description using the Google Gemini AI, and store the results in a Supabase database. It provides full CRUD (Create, Read, Update, Delete) functionality for the analyzed website data.

## Features

-   **Web Scraping**: Uses Puppeteer to extract key metadata like title, description, and keywords from a website.
-   **AI-Enhanced Descriptions**: Leverages the Google Gemini API to generate more insightful and comprehensive descriptions based on the scraped content.
-   **CRUD API**: Full set of endpoints to manage website data.
-   **Persistent Storage**: Uses Supabase for reliable and scalable data storage.
-   **Containerized**: Includes a `Dockerfile` for easy setup and deployment using Docker.

## Tech Stack

-   **Backend**: Node.js, Express.js
-   **Language**: TypeScript
-   **Web Scraping**: Puppeteer
-   **AI**: Google Gemini API
-   **Database**: Supabase
-   **Containerization**: Docker

---

## Setup and Installation

You can run this project locally or using Docker.

### 1. Local Environment Setup

#### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or higher recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   [Git](https://git-scm.com/)

#### Steps

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Tanishq112005/Internship_project.git
    cd Internship_project
    ```

2.  **Install dependencies:**
    This command will install all the required libraries from `package.json`.
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root of the project and add the following variables. You will need to get these keys from their respective services (Supabase and Google AI Studio).

    ```env
    # .env
    SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
    SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_PUBLIC_KEY
    GEMINI_API_KEY=YOUR_GOOGLE_GEMINI_API_KEY
    ```

4.  **Run the application:**
    The server will start, typically on port 3000.
    ```bash
    # To compile and run
    npm start
    ```
    Or, for development with live reloading:
    ```bash
    # From the root directory, navigate to src and run index.ts
    cd src
    ts-node index.ts
    ```

### 2. Docker Setup

#### Prerequisites

-   [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

#### Steps

1.  **Clone the repository and navigate into it** (if you haven't already).

2.  **Create the `.env` file** in the root directory as described in the local setup section. The Docker container will need this file to access your API keys.

3.  **Build the Docker image:**
    ```bash
    docker build -t website-analyzer-api .
    ```

4.  **Run the Docker container:**
    This command maps port 3000 of the container to port 3000 on your local machine and passes the environment variables from your `.env` file.
    ```bash
    docker run -p 3000:3000 --env-file .env website-analyzer-api
    ```
    The API will now be accessible at `http://localhost:3000`.

---

## Environment Variables

These variables are required for the application to function correctly. Place them in a `.env` file in the project's root directory.

| Variable            | Description                                                               | Example                                    |
| ------------------- | ------------------------------------------------------------------------- | ------------------------------------------ |
| `SUPABASE_URL`      | The unique URL for your Supabase project's API.                           | `https://xyz.supabase.co`                  |
| `SUPABASE_ANON_KEY` | The public "anon" key for your Supabase project. Used for client-side access. | `ey...`                                    |
| `GEMINI_API_KEY`    | Your API key for the Google Gemini service from Google AI Studio.         | `AIza...`                                  |

---

## API Usage and Endpoints

The base URL for the deployed API is: `https://internship-project-xw6m.onrender.com`

### 1. Analyze and Insert a Website

-   **Endpoint**: `/analyizer`
-   **Method**: `POST`
-   **Description**: Scrapes a new website, enhances its data with AI, and saves it to the database.
-   **Request Body**:
    ```json
    {
      "url": "https://www.example.com"
    }
    ```
-   **Example `Postman` Request**:
    ```bash
    POST https://internship-project-xw6m.onrender.com/analyizer 
    ```
    ```json
    {
      "url" : "link_you_want_webscrapped"
    }
    ```

### 2. Get All Website Data

-   **Endpoint**: `/website_data`
-   **Method**: `GET`
-   **Description**: Retrieves all the website data that has been stored in the database.
-   **Example `Postman` Request**:
    ```bash
     GET https://internship-project-xw6m.onrender.com/website_data

    ```

### 3. Update Website Data

-   **Endpoint**: `/update_data/:id`
-   **Method**: `PUT`
-   **Description**: Re-scrapes and updates the data for an existing entry using its unique `id`.
-   **Request Body**:
    ```json
    {
      "url": "https://www.new-url-for-same-entry.com" , 
      "brand_name" : "name_you_want_to_change" , 
      "description" : "description you want to change for the website" 
     }
    ```
-   **Example `Postman` Request**:
    ```bash
      PUT https://internship-project-xw6m.onrender.com/update_data/15 
    ```

### 4. Delete Website Data

-   **Endpoint**: `/delete_data/:id`
-   **Method**: `DELETE`
-   **Description**: Deletes a specific website data entry from the database using its `id`.
-   **Example `Postman` Request**:
    ```bash
     DELETE https://internship-project-xw6m.onrender.com/delete_data/14
    ```

---

## Contact

For any questions or suggestions, please feel free to reach out.

-   **Name**: Tanishq Jain
-   **Email**: [tanishqjain1109@gmail.com](mailto:tanishqjain1109@gmail.com)