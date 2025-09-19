const express = require('express');
const router  = express.Router();
const pendudukCtrl = require('../controllers/pendudukController');

// ===== ROUTES PENDUDUK =====

// daftar semua penduduk atau filter RW
router.get('/', pendudukCtrl.listPenduduk);

// form tambah penduduk global
router.get('/add', pendudukCtrl.addPendudukForm);
router.post('/add', pendudukCtrl.addPenduduk);

// daftar penduduk per RW
router.get('/:rw_id', pendudukCtrl.listPenduduk);

// form tambah penduduk per RW (opsional)
router.get('/:rw_id/add', pendudukCtrl.addPendudukForm);
router.post('/:rw_id/add', pendudukCtrl.addPenduduk);

// edit penduduk
router.get('/:rw_id/:id/edit', pendudukCtrl.editPendudukForm);
router.post('/:rw_id/:id/edit', pendudukCtrl.editPenduduk);

// hapus penduduk
router.post('/:rw_id/:id/delete', pendudukCtrl.deletePenduduk);

// export excel
router.get('/:rw_id/export/excel', pendudukCtrl.exportExcel);

module.exports = router;
