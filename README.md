# FocusForge - Productivity Platform

A full-stack productivity application built with React.js, Node.js, Express.js, and MongoDB. FocusForge helps users manage tasks, take notes, track time with Pomodoro technique, and visualize their productivity with analytics.

## 🚀 Features

### Core Features
- **Task Management**: Create, edit, delete, and organize tasks with drag-and-drop functionality
- **Notes System**: Rich markdown notes with pinning, categorization, and trash management
- **Pomodoro Timer**: Customizable focus sessions with break tracking
- **Analytics Dashboard**: Visual insights into productivity patterns
- **Dark/Light Theme**: Beautiful glassmorphism UI with theme switching
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Advanced Features
- **Real-time Authentication**: JWT-based secure authentication
- **Drag & Drop**: Intuitive task and note organization
- **Markdown Support**: Rich text editing for notes
- **Productivity Analytics**: Charts and statistics for progress tracking
- **Motivational Quotes**: Inspirational quotes to boost productivity
- **Session Tracking**: Detailed Pomodoro session history

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest React with hooks and modern features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Chart.js** - Data visualization and analytics
- **React Router** - Client-side routing
- **React Icons** - Beautiful icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
focusforge/
├── src/                    # Frontend source code
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── context/           # React context providers
│   ├── services/          # API services
│   └── assets/            # Static assets
├── server/                # Backend source code
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/            # MongoDB schemas
│   └── routes/            # API routes
├── public/                # Public assets
└── package.json           # Frontend dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd focusforge
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Set up environment variables**
   ```bash
   cd server
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/focusforge
   JWT_SECRET=your-super-secret-jwt-key
   ```

5. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```

6. **Start the frontend development server**
   ```bash
   # In a new terminal
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:5173` to see the application

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/toggle` - Toggle task completion
- `POST /api/tasks/reorder` - Reorder tasks
- `GET /api/tasks/stats` - Get task statistics

### Notes
- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Move note to trash
- `DELETE /api/notes/:id/permanent` - Permanently delete note
- `PATCH /api/notes/:id/restore` - Restore note from trash
- `PATCH /api/notes/:id/pin` - Toggle note pin
- `POST /api/notes/reorder` - Reorder notes
- `GET /api/notes/stats` - Get note statistics

### Pomodoro
- `GET /api/pomodoro` - Get all sessions
- `POST /api/pomodoro/start` - Start new session
- `PATCH /api/pomodoro/:id/complete` - Complete session
- `PUT /api/pomodoro/:id` - Update session
- `DELETE /api/pomodoro/:id` - Delete session
- `GET /api/pomodoro/stats` - Get session statistics

## 🎨 UI Features

### Glassmorphism Design
- Beautiful glass-like effects with backdrop blur
- Smooth transitions and animations
- Consistent color scheme with gradients
- Responsive design for all devices

### Dark/Light Theme
- Automatic theme detection
- Smooth theme transitions
- Persistent theme preference

### Animations
- Framer Motion powered animations
- Micro-interactions for better UX
- Loading states and transitions

## 🔧 Development

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

**Backend:**
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

### Code Quality
- ESLint configuration for both frontend and backend
- Consistent code formatting
- Error boundaries and proper error handling
- TypeScript-ready structure

## 🚀 Deployment

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service

### Backend Deployment
1. Set up environment variables
2. Install dependencies: `npm install --production`
3. Start the server: `npm start`

### Database Setup
- Use MongoDB Atlas for cloud hosting
- Set up proper indexes for performance
- Configure backup strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- Framer Motion for smooth animations
- MongoDB for the flexible database
- The open-source community for inspiration

---

**FocusForge** - Transform your productivity with beautiful, intuitive tools.
