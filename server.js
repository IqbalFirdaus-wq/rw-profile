// ======== server.js ========
// Aplikasi Profil RW – Node.js + Express + EJS + express-ejs-layouts

const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");

const app = express();

// ------------------- Middleware -------------------

// Parsing form urlencoded (bawaan Express, pengganti body-parser)
app.use(express.urlencoded({ extended: false }));

// Static assets (CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

// EJS + Layout
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layout"); // default layout = views/layout.ejs

// Variabel global untuk semua view
app.use((req, res, next) => {
  res.locals.title = "Profil RW"; // default jika tidak di-set per halaman
  next();
});

// ------------------- Routes -------------------
const rwRoutes = require("./routes/rw");
const pendudukRoutes = require("./routes/penduduk");
const organisasiRoutes = require("./routes/organisasi");
const kepengurusanRoutes = require("./routes/kepengurusan");
const keamananRoutes = require("./routes/keamanan");

// Urutan route: spesifik dulu baru root
app.use("/keamanan", keamananRoutes);
app.use("/kepengurusan", kepengurusanRoutes);
app.use("/organisasi", organisasiRoutes);
app.use("/penduduk", pendudukRoutes);
app.use("/", rwRoutes);

// ------------------- Error Handling -------------------

// 404 Not Found
app.use((req, res) => {
  res.status(404).render("404", {
    layout: "layout", 
    title: "Halaman Tidak Ditemukan"
  });
});

// 500 Internal Server Error
app.use((err, req, res, next) => {
  console.error("❌ Internal Server Error:", err.stack);
  res.status(500).render("500", {
    layout: "layout", 
    title: "Kesalahan Server"
  });
});

// ------------------- Server -------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
