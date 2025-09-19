const express = require('express');
const router  = express.Router();
const orgCtrl = require('../controllers/organisasiController');

// 🔹 Tambah harus di atas supaya tidak tertangkap :rw_id
router.get('/add',  orgCtrl.addOrganisasiForm);
router.post('/add', orgCtrl.addOrganisasi);

// 🔹 Daftar semua RW
router.get('/', orgCtrl.listOrganisasi);

// 🔹 Daftar per RW
router.get('/:rw_id', orgCtrl.listOrganisasi);

// 🔹 Edit / Delete
router.get('/:rw_id/edit/:id',   orgCtrl.editOrganisasiForm);
router.post('/:rw_id/edit/:id',  orgCtrl.editOrganisasi);
router.post('/:rw_id/delete/:id',orgCtrl.deleteOrganisasi);

// 🔹 Export Excel
router.get('/:rw_id/export/excel', orgCtrl.exportExcel);

module.exports = router;