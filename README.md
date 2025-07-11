# Backend Blog API

Backend API untuk aplikasi blog yang dibangun dengan Node.js, Express.js, dan PostgreSQL. API ini menyediakan fitur lengkap untuk manajemen blog termasuk autentikasi, posts, komentar, dan kategori.

## 🚀 Fitur

- **Autentikasi & Otorisasi**

  - Register dan Login user
  - JWT Token authentication
  - Role-based access (Admin & User)
  - Profile management

- **Manajemen Posts**

  - CRUD operations untuk posts
  - Upload gambar posts
  - Slug generation otomatis
  - Pagination dan search
  - Filter berdasarkan kategori

- **Sistem Komentar**

  - CRUD operations untuk komentar
  - Komentar berdasarkan post
  - User authorization untuk edit/delete

- **Manajemen Kategori**

  - CRUD operations untuk kategori
  - Relasi dengan posts

- **File Upload**

  - Upload gambar untuk posts
  - Validasi file type dan size
  - Automatic image resizing

- **Dokumentasi API**
  - Swagger UI documentation
  - Interactive API testing

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT
- **File Upload**: Multer
- **Validation**: Joi
- **Documentation**: Swagger
- **Environment**: dotenv

## 📋 Prerequisites

- Node.js (v14 atau lebih tinggi)
- PostgreSQL (v12 atau lebih tinggi)
- npm atau yarn

## 🔧 Installation

1. **Clone repository**

```bash
git clone https://github.com/yourusername/backend-blog.git
cd backend-blog
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**

```bash
cp .env.example .env
```

Edit file `.env` dan sesuaikan dengan konfigurasi Anda:

```env
# Database
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_PORT=5432

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=30d

# Server
PORT=5000
NODE_ENV=development

# Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./src/public/uploads
```

4. **Setup database**

```bash
# Buat database
createdb your_db_name

# Jalankan migrasi
npx sequelize-cli db:migrate

# Jalankan seeder (opsional)
npx sequelize-cli db:seed:all
```

5. **Jalankan aplikasi**

```bash
# Development
npm run dev

# Production
npm start
```

## 📚 API Documentation

Setelah server berjalan, akses dokumentasi API di:

```
http://localhost:5000/api/v1/docs
```

## 🔗 API Endpoints

### Authentication

```
POST /api/v1/auth/register     # Register user baru
POST /api/v1/auth/login        # Login user
GET  /api/v1/auth/profile      # Get profile user
PUT  /api/v1/auth/profile      # Update profile user
```

### Posts

```
GET    /api/v1/posts           # Get semua posts (public)
GET    /api/v1/posts/my-posts  # Get posts user (private)
POST   /api/v1/posts           # Create post baru
GET    /api/v1/posts/:slug     # Get detail post
PUT    /api/v1/posts/:slug     # Update post
DELETE /api/v1/posts/:slug     # Delete post
```

### Comments

```
GET    /api/v1/comments/posts/:slug  # Get comments by post
POST   /api/v1/comments/posts/:slug  # Create comment
GET    /api/v1/comments/:id          # Get comment detail
PUT    /api/v1/comments/:id          # Update comment
DELETE /api/v1/comments/:id          # Delete comment
```

### Categories

```
GET    /api/v1/categories      # Get semua kategori
POST   /api/v1/categories      # Create kategori baru
GET    /api/v1/categories/:id  # Get detail kategori
PUT    /api/v1/categories/:id  # Update kategori
DELETE /api/v1/categories/:id  # Delete kategori
```

## 📁 Struktur Folder

```
backend-blog/
├── src/
│   ├── config/
│   │   └── database.js         # Konfigurasi database
│   ├── controllers/
│   │   ├── authController.js   # Authentication logic
│   │   ├── postController.js   # Posts logic
│   │   ├── commentController.js # Comments logic
│   │   └── categoryController.js # Categories logic
│   ├── middlewares/
│   │   ├── authMiddleware.js   # JWT authentication
│   │   ├── errorHandler.js     # Error handling
│   │   └── validation.js       # Input validation
│   ├── models/
│   │   ├── index.js           # Models index
│   │   ├── User.js            # User model
│   │   ├── Post.js            # Post model
│   │   ├── Comment.js         # Comment model
│   │   └── Category.js        # Category model
│   ├── routes/
│   │   ├── authRoutes.js      # Auth routes
│   │   ├── postRoutes.js      # Post routes
│   │   ├── commentRoutes.js   # Comment routes
│   │   └── categoryRoutes.js  # Category routes
│   ├── utils/
│   │   ├── fileUpload.js      # File upload utilities
│   │   ├── paginate.js        # Pagination helper
│   │   ├── slugGenerator.js   # Slug generation
│   │   └── validateImage.js   # Image validation
│   ├── validations/
│   │   ├── authSchema.js      # Auth validation schemas
│   │   ├── postSchema.js      # Post validation schemas
│   │   └── commentSchema.js   # Comment validation schemas
│   ├── public/
│   │   └── uploads/           # Upload directory
│   └── app.js                 # Main app file
├── migrations/                # Database migrations
├── seeders/                   # Database seeders
├── package.json
├── .env.example
└── README.md
```

## 🔐 Authentication

API menggunakan JWT (JSON Web Token) untuk autentikasi. Setelah login berhasil, server akan mengembalikan token yang harus disertakan dalam header untuk mengakses protected routes.

```javascript
// Header format
Authorization: Bearer <your-jwt-token>
```

## 📝 Request/Response Format

### Success Response

```json
{
  "status": "success",
  "message": "Data berhasil diambil",
  "data": {
    // response data
  }
}
```

### Error Response

```json
{
  "status": "error",
  "message": "Error message",
  "error": "Detailed error information"
}
```

### Pagination Response

```json
{
  "status": "success",
  "message": "Data berhasil diambil",
  "data": [...],
  "pagination": {
    "current_page": 1,
    "total_pages": 10,
    "total_count": 100,
    "has_next": true,
    "has_prev": false
  }
}
```

## 🧪 Testing

```bash
# Jalankan semua tests
npm test

# Jalankan tests dengan coverage
npm run test:coverage

# Jalankan tests dalam watch mode
npm run test:watch
```

## 🚀 Deployment

### Production Setup

1. **Environment Variables**

```env
NODE_ENV=production
PORT=5000
DB_HOST=your_production_db_host
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
DB_NAME=your_production_db_name
JWT_SECRET=your_strong_jwt_secret
```

2. **Database Migration**

```bash
NODE_ENV=production npx sequelize-cli db:migrate
```

3. **Start Application**

```bash
npm start
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: "3.8"
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DB_HOST=db
    depends_on:
      - db

  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=blog_db
      - POSTGRES_USER=blog_user
      - POSTGRES_PASSWORD=blog_password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 🤝 Contributing

1. Fork repository
2. Buat branch feature (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buat Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - _Initial work_ - [YourGithub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Express.js team
- Sequelize team
- PostgreSQL team
- All contributors

## 📞 Support

Jika Anda memiliki pertanyaan atau menemukan bug, silakan buat issue di repository ini atau hubungi:

- Email: your.email@example.com
- GitHub Issues: [Create Issue](https://github.com/yourusername/backend-blog/issues)

## 📊 Status

- ✅ Authentication & Authorization
- ✅ Posts Management
- ✅ Comments System
- ✅ Categories Management
- ✅ File Upload
- ✅ API Documentation
- ⏳ Unit Tests
- ⏳ Integration Tests
- ⏳ Email Notifications
- ⏳ Advanced Search
