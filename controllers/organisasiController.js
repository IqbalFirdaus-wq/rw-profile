const pool = require('../config/db');
const ExcelJS = require('exceljs');

/* =========================================================
   LIST ORGANISASI  (semua RW atau per RW)
   ========================================================= */
exports.listOrganisasi = async (req, res) => {
  try {
    // jika param tidak ada → tampilkan semua RW
    const rw_id = req.params.rw_id || null;

    // sort & order
    let { sort = 'nama', order = 'ASC' } = req.query;
    const allowedSort = ['tipe', 'nama', 'kode_rw'];
    if (!allowedSort.includes(sort)) sort = 'nama';
    order = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    // dropdown RW
    const [allRw] = await pool.query('SELECT id, kode_rw FROM rw ORDER BY kode_rw ASC');

    // query organisasi
    let sql = `
      SELECT o.*, r.kode_rw
      FROM organisasi o
      JOIN rw r ON o.rw_id = r.id
    `;
    const params = [];
    if (rw_id) {
      sql += ' WHERE o.rw_id = ?';
      params.push(rw_id);
    }
    sql += ` ORDER BY ${sort} ${order}`;

    const [rows] = await pool.query(sql, params);

    res.render('Organisasi/organisasi', {
      orgs: rows,
      allRw,
      rw_id,                 // null = semua RW
      kode_rw: rw_id || 'Semua',
      sort,
      order,
      title: rw_id ? `Organisasi RW ${rw_id}` : 'Daftar Semua Organisasi'
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('500', { title: 'Kesalahan Server' });
  }
};

/* =========================================================
   TAMBAH
   ========================================================= */
// controllers/organisasiController.js
exports.addOrganisasiForm = async (req, res) => {
  try {
    // ✅ Ambil semua RW untuk dropdown
    const [rwList] = await pool.query(
      'SELECT id, kode_rw, nama_rw FROM rw ORDER BY kode_rw ASC'
    );

    res.render('Organisasi/addOrganisasi', {
      rw_id: req.params.rw_id || '', // jika ingin preselect RW tertentu
      rwList,                        // 🔑 kirim ke view
      title: 'Tambah Organisasi'
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('500', { title: 'Kesalahan Server' });
  }
};

exports.addOrganisasi = async (req, res) => {
  try {
    // ✅ RW dipilih dari dropdown form
    const { rw_id, tipe, nama, jumlah_unit, jumlah_orang, lokasi, keterangan } = req.body;

    if (!rw_id) {
      return res.status(400).send('RW harus dipilih');
    }

    await pool.query(
      `INSERT INTO organisasi
         (rw_id, tipe, nama, jumlah_unit, jumlah_orang, lokasi, keterangan)
       VALUES (?,?,?,?,?,?,?)`,
      [rw_id, tipe, nama, jumlah_unit, jumlah_orang, lokasi, keterangan]
    );

    // ✅ Redirect ke daftar organisasi RW yang baru dipilih
    res.redirect(`/organisasi/${rw_id}`);
  } catch (err) {
    console.error(err);
    res.status(500).render('500', { title: 'Kesalahan Server' });
  }
};


/* =========================================================
   EDIT ORGANISASI
   ========================================================= */
exports.editOrganisasiForm = async (req, res) => {
  try {
    const { id, rw_id } = req.params;
    const [rows] = await pool.query('SELECT * FROM organisasi WHERE id=?', [id]);
    if (!rows.length) return res.status(404).render('404', { title: 'Organisasi Tidak Ditemukan' });

    // semua RW untuk dropdown jika ingin pindah RW
    const [allRw] = await pool.query('SELECT id, kode_rw FROM rw ORDER BY kode_rw ASC');

    res.render('Organisasi/editOrganisasi', {
      rw_id,
      o: rows[0],       // pakai 'o' sesuai view
      allRw,
      title: 'Edit Organisasi'
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('500', { title: 'Kesalahan Server' });
  }
};

exports.editOrganisasi = async (req, res) => {
  try {
    const { id, rw_id } = req.params;
    const { tipe, nama, jumlah_unit, jumlah_orang, lokasi, keterangan } = req.body;

    await pool.query(
      `UPDATE organisasi
         SET tipe=?, nama=?, jumlah_unit=?, jumlah_orang=?, lokasi=?, keterangan=?
       WHERE id=?`,
      [tipe, nama, jumlah_unit, jumlah_orang, lokasi, keterangan, id]
    );

    res.redirect(`/organisasi/${rw_id}`);
  } catch (err) {
    console.error(err);
    res.status(500).render('500', { title: 'Kesalahan Server' });
  }
};

/* =========================================================
   HAPUS
   ========================================================= */
exports.deleteOrganisasi = async (req, res) => {
  try {
    const { id, rw_id } = req.params;
    await pool.query('DELETE FROM organisasi WHERE id=?', [id]);
    res.redirect(`/organisasi/${rw_id}`);
  } catch (err) {
    console.error(err);
    res.status(500).render('500', { title: 'Kesalahan Server' });
  }
};

/* =========================================================
   EXPORT EXCEL (per RW)
   ========================================================= */
exports.exportExcel = async (req, res) => {
  try {
    const { rw_id } = req.params;
    const [rwRows] = await pool.query('SELECT kode_rw FROM rw WHERE id=?', [rw_id]);
    if (!rwRows.length) return res.status(404).send('RW tidak ditemukan');

    const kode_rw = rwRows[0].kode_rw;
    const [rows] = await pool.query(
      `SELECT r.kode_rw, o.tipe, o.nama, o.jumlah_unit, o.jumlah_orang, o.lokasi, o.keterangan
         FROM organisasi o
         JOIN rw r ON o.rw_id = r.id
        WHERE o.rw_id=? ORDER BY o.nama`,
      [rw_id]
    );

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(`Organisasi RW ${kode_rw}`);
    sheet.columns = [
      { header: 'RW',           key: 'kode_rw',     width: 10 },
      { header: 'Tipe',         key: 'tipe',        width: 20 },
      { header: 'Nama',         key: 'nama',        width: 25 },
      { header: 'Jumlah Unit',  key: 'jumlah_unit', width: 15 },
      { header: 'Jumlah Orang', key: 'jumlah_orang',width: 15 },
      { header: 'Lokasi',       key: 'lokasi',      width: 25 },
      { header: 'Keterangan',   key: 'keterangan',  width: 30 },
    ];
    sheet.addRows(rows);

    res.setHeader('Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition',
      `attachment; filename=organisasi_rw${kode_rw}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal export Excel');
  }
};
