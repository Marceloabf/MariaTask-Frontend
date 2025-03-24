## MARIA TASK

A responsive web application for task management built with Angular, featuring user authentication, task management, and a clean, intuitive interface.

## Overview

This frontend application provides a user-friendly interface for the Task Management system, allowing users to:

- Register and log in securely
- Create, edit, delete, and mark tasks as complete
- Filter tasks by status (pending, completed, in progress)
- View and interact with the application on both desktop and mobile devices


## Technologies Used

- **Angular**: Frontend framework
- **PrimeNG**: UI component library
- **Bootstrap**: CSS framework for responsive design
- **Angular Router**: For navigation and route guards
- **HttpClient**: For API communication
- **RxJS**: For reactive programming


## Features

### Authentication

- Secure login and registration
- JWT token-based authentication
- Session management using sessionStorage
- Route guards to protect authenticated routes


### Task Management

- Interactive task board
- See Task Progress Overview
- Create new tasks
- Edit existing tasks
- Mark tasks as complete/incomplete
- Delete tasks
- Filter tasks by status


### User Experience

- Responsive design for desktop and mobile
- Intuitive user interface
- Form validation
- Loading indicators
- Error handling


## Installation and Setup

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- Angular CLI (v14 or later)


### Installation Steps

1. Clone the repository:

```shellscript
git clone https://github.com/Marceloabf/MariaTask-Frontend
cd MariaTask-Frontend
```


2. Install dependencies:

```shellscript
npm install
```


3. Start the development server:

```shellscript
ng serve
```


4. Open your browser and navigate to:

```plaintext
http://localhost:4200
```


## Authentication Flow

1. User enters credentials on the login page
2. Application sends credentials to the backend API
3. Upon successful authentication, the API returns a JWT token
4. The token is stored in sessionStorage
5. The application uses the token for subsequent API requests
6. Route guards prevent unauthorized access to protected routes
7. When the user logs out, the token is removed from sessionStorage


## API Integration

The application communicates with two APIs:

1. **Backend API**: For user authentication and task management

1. Endpoint: `/`


2. **External Public API**: For additional features

1. Endpoint: `https://zenquotes.io"*`
2. Proxied to pathRewrite: {"^/api/quotes": "/api/random"}
3. Used for fetching complementary information (e.g., motivational quotes)


## Security Measures

- JWT tokens stored in sessionStorage (cleared on browser close)
- Authentication guards for protected routes
- HTTP interceptors for attaching authentication headers
- Input validation to prevent malicious data


## Future Improvements

- **Input Sanitization**: Prevent script injection in input fields
- **Offline Support**: Implement service workers for offline functionality
- **Accessibility**: Improve accessibility compliance
- **Drag-and-Drop**: Implement drag-and-drop for task reordering
- **Notifications**: Add in-app notifications for task deadlines
- **Multi-language Support**: Add internationalization


## Development

### Code Style

This project follows the Angular style guide. To ensure code quality:

```shellscript
# Run linting
ng lint

# Run tests
ng test

# Run end-to-end tests
ng e2e
```

### Building for Production

```shellscript
ng build --prod
```

The build artifacts will be stored in the `dist/` directory.

## License

[MIT](LICENSE)
