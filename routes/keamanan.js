const express = require('express');
const router = express.Router();
const keamananCtrl = require('../controllers/keamananController');

// =========================================================
// TAMBAH
// =========================================================
router.get('/add', keamananCtrl.addKeamananForm);
router.post('/add', keamananCtrl.addKeamanan);

// EDIT
router.get('/:rw_id/edit/:id', keamananCtrl.editKeamananForm);
router.post('/:rw_id/edit/:id', keamananCtrl.editKeamanan);

// DELETE
router.post('/:rw_id/delete/:id', keamananCtrl.deleteKeamanan);


// =========================================================
// EXPORT EXCEL
// =========================================================
router.get('/:rw_id/export/excel', keamananCtrl.exportExcel);

// =========================================================
// LIST (semua & per RW) – taruh paling bawah
// =========================================================
router.get('/', keamananCtrl.listKeamanan);
router.get('/:rw_id', keamananCtrl.listKeamanan);

module.exports = router;
