const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Dokumentasi API Blog Platform",
      version: "1.0.0",
      description: "Dokumentasi lengkap untuk API Blog Platform",
      contact: {
        name: "Bryannnn12",
        email: "dev@blogplatform.com",
      },
      license: {
        name: "Brynnnn12",
        year: 2025,
      },
    },
    servers: [
      {
        url: "http://localhost:5000/api/v1",
        description: "Server Pengembangan (Development)",
      },
      {
        url: "https://api.blogplatform.com/api/v1",
        description: "Server Produksi (Production)",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Masukkan token JWT dengan format: Bearer <token>",
        },
      },
      responses: {
        UnauthorizedError: {
          description: "Token tidak valid atau tidak tersedia",
        },
        BadRequest: {
          description: "Permintaan tidak valid",
        },
        NotFound: {
          description: "Data tidak ditemukan",
        },
        ServerError: {
          description: "Terjadi kesalahan pada server",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: "Autentikasi",
        description:
          "Operasi terkait login, registrasi, dan otentikasi pengguna",
      },
      {
        name: "Role",
        description: "Operasi terkait manajemen peran pengguna",
      },
      {
        name: "Profil",
        description: "Operasi terkait manajemen data pengguna",
      },
      {
        name: "Kategori",
        description: "Operasi terkait manajemen kategori postingan",
      },
      {
        name: "Komentar",
        description: "Operasi terkait manajemen komentar pada postingan",
      },
      {
        name: "Postingan",
        description: "Operasi terkait manajemen postingan blog",
      },
    ],
    externalDocs: {
      description: "Pelajari lebih lanjut tentang Blog Platform",
      url: "https://blogplatform.com/docs",
    },
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const swaggerDocs = (app) => {
  // Custom CSS untuk Swagger UI
  const customCss = `
    .topbar-wrapper img {content:url('https://via.placeholder.com/150x50?text=Blog+API'); width:150px; height:auto;}
    .swagger-ui .topbar { background-color: #2c3e50; }
    .swagger-ui .info .title { color: #2c3e50; }
    .swagger-ui .btn.authorize { background-color: #3498db; color: white; }
    .swagger-ui .model-box { background: rgba(52, 152, 219, 0.1); }
    .swagger-ui .opblock-tag { font-size: 16px; color: #3498db; }
  `;

  const options = {
    customCss,
    customSiteTitle: "Dokumentasi API Blog Platform",
    customfavIcon: "https://blogplatform.com/favicon.ico",
    swaggerOptions: {
      docExpansion: "list",
      filter: true,
      displayRequestDuration: true,
      defaultModelsExpandDepth: 1,
      defaultModelExpandDepth: 1,
      tryItOutEnabled: true,
      validatorUrl: null,
    },
  };

  // Route untuk UI Swagger
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, options));

  // Route untuk dokumen JSON
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  //   console.log(`Dokumentasi API tersedia di http://localhost:5000/api-docs`);
};

module.exports = swaggerDocs;
