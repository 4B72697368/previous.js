# previous.js

A modern Javascript framework for quickly building intricate web-apps.

**previous.js** is a powerful framework that makes it easy to create and manage complex web applications. It comes with a set of tools and utilities to help you quickly get up and running with your next project.

## Getting Started

To start building with **previous.js**, follow the instructions below:

### 1. Install the CLI

First, install the **previous-dev** CLI globally by running the following command:

```bash
npm i -g previous-dev
```

### 2. Create Your New Application

Once the CLI is installed, you can create a new **previous.js** application by running:

```bash
previous create -n <your-app-name>
```

Replace `<your-app-name>` with the desired name for your application.

### 3. Navigate to Your Project Folder

Once the project is created, move into your newly created project directory:

```bash
cd <your-app-name>
```

### 4. Run the Development Server

Start the development server to see your app in action:

```bash
npm run dev
```

This will start the app and run it on the first available port starting on 3000.

## Creating your Application

To develop your application, you can navigate to the app folder inside your project, and edit the page.js's output html to control the code displayed on the index route.

To create a new page for any route, you can simply create the folder corresponding to the route in your app directory, for example if you want to add a /auth/login page, create a page.js file in project/app/auth/login/page.js.