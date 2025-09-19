const pool = require('../config/db');
const ExcelJS = require('exceljs');

// ====================== LIST DATA RW ======================
exports.listRw = async (req, res) => {
  try {
    const { sort = 'kode_rw', order = 'ASC' } = req.query;

    // Validasi kolom yang bisa dipakai sorting
    const allowedSort = ['id', 'kode_rw', 'nama_rw', 'alamat', 'created_at'];
    const sortBy = allowedSort.includes(sort) ? sort : 'kode_rw';

    // Validasi urutan ASC / DESC
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const [rows] = await pool.query(
      `SELECT * FROM rw ORDER BY ${sortBy} ${sortOrder}`
    );

    res.render('index', {
      rwList: rows,
      sort: sortBy,
      order: sortOrder,
    });
  } catch (err) {
    console.error('Error listRw:', err);
    res.status(500).send('Gagal memuat data RW');
  }
};

// ====================== FORM TAMBAH RW ======================
exports.addRwForm = (req, res) => {
  res.render('addRw');
};

// Proses tambah
exports.addRw = async (req, res) => {
  try {
    const { kode_rw, nama_rw, alamat } = req.body;

    if (!kode_rw || !nama_rw || !alamat) {
      return res.status(400).send('Semua field wajib diisi!');
    }

    await pool.query(
      'INSERT INTO rw (kode_rw, nama_rw, alamat, created_at) VALUES (?,?,?,NOW())',
      [kode_rw, nama_rw, alamat]
    );

    res.redirect('/');
  } catch (err) {
    console.error('Error addRw:', err);
    res.status(500).send('Gagal menambahkan RW');
  }
};

// ====================== FORM EDIT RW ======================
exports.editRwForm = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM rw WHERE id=?', [id]);

    if (rows.length === 0) {
      return res.status(404).send('Data RW tidak ditemukan');
    }

    res.render('editRw', { rw: rows[0] });
  } catch (err) {
    console.error('Error editRwForm:', err);
    res.status(500).send('Gagal memuat form edit RW');
  }
};

// Proses edit
exports.editRw = async (req, res) => {
  try {
    const { id } = req.params;
    const { kode_rw, nama_rw, alamat } = req.body;

    if (!kode_rw || !nama_rw || !alamat) {
      return res.status(400).send('Semua field wajib diisi!');
    }

    await pool.query(
      'UPDATE rw SET kode_rw=?, nama_rw=?, alamat=? WHERE id=?',
      [kode_rw, nama_rw, alamat, id]
    );

    res.redirect('/');
  } catch (err) {
    console.error('Error editRw:', err);
    res.status(500).send('Gagal mengedit RW');
  }
};

// ====================== HAPUS RW ======================
exports.deleteRw = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM rw WHERE id=?', [id]);
    res.redirect('/');
  } catch (err) {
    console.error('Error deleteRw:', err);
    res.status(500).send('Gagal menghapus RW');
  }
};

// ====================== EXPORT EXCEL ======================
exports.exportExcel = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT kode_rw, nama_rw, alamat, created_at FROM rw ORDER BY id'
    );

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Daftar RW');

    sheet.columns = [
      { header: 'Kode RW', key: 'kode_rw', width: 15 },
      { header: 'Nama RW', key: 'nama_rw', width: 30 },
      { header: 'Alamat', key: 'alamat', width: 40 },
      { header: 'Created At', key: 'created_at', width: 20 },
    ];

    sheet.addRows(rows);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=rw.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Error exportExcel:', err);
    res.status(500).send('Gagal export Excel');
  }
};
