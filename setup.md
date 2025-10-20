# TownHall Project Setup Guide

A modern digital town hall platform built with Django (backend) and Next.js (frontend) for citizen engagement, business management, and government operations.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Python 3.8+** - [Download here](https://www.python.org/downloads/)
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/downloads)
- **MySQL** - [Download here](https://dev.mysql.com/downloads/)

## Project Structure

```
TownHall/
├── frontend/          # Next.js React application
├── businessowner/     # Django app for business owners
├── citizen/           # Django app for citizens
├── government/        # Django app for government officials
├── townhall_project/  # Django project settings
├── manage.py         # Django management script
├── requirements.txt  # Python dependencies
└── setup.md         # This file
```

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/sd2389/TownHall.git
cd TownHall
```

### 2. Backend Setup (Django)

#### Install Python Dependencies

```bash
# Create a virtual environment (recommended)
python -m venv townhallvenv

# Activate virtual environment
# On Windows:
townhallvenv\Scripts\activate
# On macOS/Linux:
source townhallvenv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### Database Setup

1. **Install MySQL** and create a database:
   ```sql
   CREATE DATABASE townhall_db;
   ```

2. **Configure Database Settings**:
   - Copy `env_template.txt` to `.env`
   - Update database credentials in `.env`:
     ```
     DATABASE_NAME=townhall_db
     DATABASE_USER=your_username
     DATABASE_PASSWORD=your_password
     DATABASE_HOST=localhost
     DATABASE_PORT=3306
     ```

3. **Run Migrations**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

4. **Create Superuser** (optional):
   ```bash
   python manage.py createsuperuser
   ```

#### Start Django Server

```bash
python manage.py runserver
```

The Django backend will be available at `http://localhost:8000`

### 3. Frontend Setup (Next.js)

#### Install Node Dependencies

```bash
cd frontend
npm install
```

#### Start Development Server

```bash
npm run dev
```

The Next.js frontend will be available at `http://localhost:3000`

## Development Scripts

### Backend (Django)

```bash
# Run development server
python manage.py runserver

# Run with specific port
python manage.py runserver 8001

# Create new migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run tests
python manage.py test

# Collect static files (for production)
python manage.py collectstatic
```

### Frontend (Next.js)

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

## Environment Configuration

### Backend Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_NAME=townhall_db
DATABASE_USER=your_username
DATABASE_PASSWORD=your_password
DATABASE_HOST=localhost
DATABASE_PORT=3306

# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

### Frontend Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=TownHall

# Optional: Analytics, etc.
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

## Database Schema

The project includes three main Django apps:

- **Citizen**: Handles citizen complaints, feedback, and voting
- **Business Owner**: Manages business licenses and permits
- **Government**: Administrative functions and complaint management

## Features

### Citizen Portal
- File and track complaints
- Vote on community proposals
- View announcements
- Access municipal services

### Business Portal
- Manage business licenses
- Submit permit applications
- View business-related announcements
- Track application status

### Government Portal
- Manage citizen complaints
- Create announcements
- Review business applications
- Generate reports

## Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Ensure MySQL is running
   - Check database credentials in `.env`
   - Verify database exists

2. **Module Not Found Errors**:
   - Ensure virtual environment is activated
   - Run `pip install -r requirements.txt`
   - Check Python path

3. **Frontend Build Errors**:
   - Clear Next.js cache: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`
   - Check Node.js version (18+ required)

4. **Port Already in Use**:
   - Django: Use `python manage.py runserver 8001`
   - Next.js: Use `npm run dev -- -p 3001`

### Performance Optimization

1. **Enable Redis** (optional):
   ```bash
   # Install Redis
   # Ubuntu/Debian:
   sudo apt-get install redis-server
   
   # macOS:
   brew install redis
   
   # Start Redis
   redis-server
   ```

2. **Database Optimization**:
   - Use database indexes for frequently queried fields
   - Enable query caching
   - Use database connection pooling

## Production Deployment

### Backend (Django)

1. **Set Production Environment**:
   ```env
   DEBUG=False
   ALLOWED_HOSTS=your-domain.com
   SECRET_KEY=your-production-secret-key
   ```

2. **Install Production Dependencies**:
   ```bash
   pip install gunicorn psycopg2-binary
   ```

3. **Collect Static Files**:
   ```bash
   python manage.py collectstatic
   ```

4. **Run with Gunicorn**:
   ```bash
   gunicorn townhall_project.wsgi:application
   ```

### Frontend (Next.js)

1. **Build for Production**:
   ```bash
   npm run build
   ```

2. **Start Production Server**:
   ```bash
   npm start
   ```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit: `git commit -m "Add feature"`
5. Push: `git push origin feature-name`
6. Create a Pull Request

## Support

For issues and questions:
- Check the troubleshooting section above
- Review Django and Next.js documentation
- Create an issue in the repository

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Happy Coding! 🏛️**
