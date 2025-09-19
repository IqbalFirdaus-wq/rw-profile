const express = require('express');
const router = express.Router();
const {
  listRw,
  addRwForm, addRw,
  editRwForm, editRw,
  deleteRw,
  exportExcel
} = require('../controllers/rwController');

/**
 * 📋 Daftar RW
 * - Mendukung sorting (?sort=kode_rw&order=ASC/DESC)
 * - Mendukung pencarian (?search=nama_rw)
 */
router.get('/', listRw);

/**
 * ➕ Tambah RW
 */
router.get('/add', addRwForm);   // Form tambah
router.post('/add', addRw);      // Simpan data baru

/**
 * ✏️ Edit RW
 */
router.get('/edit/:id', editRwForm);  // Form edit
router.post('/edit/:id', editRw);     // Update data

/**
 * 🗑 Hapus RW
 */
router.post('/delete/:id', deleteRw);

/**
 * 📤 Export ke Excel
 */
router.get('/export/excel', exportExcel);

module.exports = router;
