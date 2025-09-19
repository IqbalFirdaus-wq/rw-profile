const pool = require('../config/db');
const ExcelJS = require('exceljs');

/* =========================================================
   LIST KEAMANAN
   ========================================================= */
   exports.listKeamanan = async (req, res) => {
    try {
      const rw_id = req.params.rw_id || null;
  
      // 🔹 Ambil query sorting (default: sort by nama_rw ASC)
      const sort = req.query.sort || 'nama';
      const order = req.query.order || 'ASC';
  
      const [rwList] = await pool.query(
        'SELECT id, kode_rw, nama_rw FROM rw ORDER BY kode_rw ASC'
      );
  
      let sql = `
        SELECT k.*, r.kode_rw, r.nama_rw
        FROM keamanan k
        JOIN rw r ON k.rw_id = r.id
      `;
      const params = [];
  
      if (rw_id) {
        sql += ' WHERE k.rw_id=?';
        params.push(rw_id);
      }
  
      // 🔹 Tambahkan ORDER BY dinamis
      if (sort === 'nama') {
        sql += ` ORDER BY r.nama_rw ${order}`;
      } else if (sort === 'kode_rw') {
        sql += ` ORDER BY r.kode_rw ${order}`;
      } else {
        sql += ' ORDER BY r.kode_rw ASC, k.id DESC';
      }
  
      const [rows] = await pool.query(sql, params);
  
      let activeRw = null;
      if (rw_id) {
        const [rwRows] = await pool.query('SELECT * FROM rw WHERE id=?', [rw_id]);
        activeRw = rwRows.length > 0 ? rwRows[0] : null;
      }
  
      res.render('keamanan/keamanan', {
        keamanan: rows,
        rwList,
        rw_id,
        kode_rw: activeRw ? activeRw.kode_rw : '',
        title: activeRw ? `Data Keamanan RW ${activeRw.kode_rw}` : 'Data Keamanan',
        sort,   // ✅ kirim ke EJS
        order   // ✅ kirim ke EJS
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Gagal menampilkan data keamanan');
    }
  };  

/* =========================================================
   FORM TAMBAH
   ========================================================= */
   exports.addKeamananForm = async (req, res) => {
    try {
      const [rwList] = await pool.query(
        'SELECT id, kode_rw, nama_rw FROM rw ORDER BY kode_rw ASC'
      );
  
      // ambil rw_id dari query string (misalnya /keamanan/add?rw_id=3)
      const { rw_id } = req.query;
  
      res.render('keamanan/addKeamanan', { 
        rwList,
        rw_id: rw_id || null,   // supaya tidak undefined di EJS
        title: 'Tambah Data Keamanan'
      });
    } catch (err) {
      console.error("❌ Gagal load form tambah keamanan:", err);
      res.status(500).send("Internal Server Error");
    }
  };
  
  /* =========================================================
     PROSES TAMBAH
     ========================================================= */
  exports.addKeamanan = async (req, res) => {
    try {
      const {
        rw_id,
        pos_keamanan_unit,
        pos_keamanan_baik,
        pos_keamanan_rusak,
        jumlah_linmas,
        jumlah_satpam,
        jumlah_cctv,
        cctv_baik,
        cctv_rusak,
        titik_rawan,
        jumlah_apar,
        jumlah_sprinkle,
        jumlah_sumber_air
      } = req.body;
  
      await pool.query(
        `INSERT INTO keamanan 
        (rw_id, pos_keamanan_unit, pos_keamanan_baik, pos_keamanan_rusak, jumlah_linmas, jumlah_satpam, jumlah_cctv, cctv_baik, cctv_rusak, titik_rawan, jumlah_apar, jumlah_sprinkle, jumlah_sumber_air)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          rw_id, pos_keamanan_unit, pos_keamanan_baik, pos_keamanan_rusak,
          jumlah_linmas, jumlah_satpam, jumlah_cctv,
          cctv_baik, cctv_rusak, titik_rawan,
          jumlah_apar, jumlah_sprinkle, jumlah_sumber_air
        ]
      );
  
      res.redirect(`/keamanan/${rw_id}`);
    } catch (err) {
      console.error("❌ Gagal menambah data keamanan:", err);
      res.status(500).send('Gagal menambah data keamanan');
    }
  };
  

/* =========================================================
   EDIT
   ========================================================= */
exports.editKeamananForm = async (req, res) => {
  const { id, rw_id } = req.params;
  const [rows] = await pool.query('SELECT * FROM keamanan WHERE id=?', [id]);
  const [rwRows] = await pool.query('SELECT * FROM rw WHERE id=?', [rw_id]);

  res.render('keamanan/editKeamanan', { 
    k: rows[0], 
    rw_id, 
    rw: rwRows[0] || null,
    title: 'Edit Data Keamanan' 
  });
};

exports.editKeamanan = async (req, res) => {
  const { id, rw_id } = req.params;
  const {
    pos_keamanan_unit,
    pos_keamanan_baik,
    pos_keamanan_rusak,
    jumlah_linmas,
    jumlah_satpam,
    jumlah_cctv,
    cctv_baik,
    cctv_rusak,
    titik_rawan,
    jumlah_apar,
    jumlah_sprinkle,
    jumlah_sumber_air
  } = req.body;

  await pool.query(
    `UPDATE keamanan SET 
      pos_keamanan_unit=?, pos_keamanan_baik=?, pos_keamanan_rusak=?, 
      jumlah_linmas=?, jumlah_satpam=?, jumlah_cctv=?, 
      cctv_baik=?, cctv_rusak=?, titik_rawan=?, 
      jumlah_apar=?, jumlah_sprinkle=?, jumlah_sumber_air=?
     WHERE id=?`,
    [pos_keamanan_unit, pos_keamanan_baik, pos_keamanan_rusak, jumlah_linmas, jumlah_satpam, jumlah_cctv, cctv_baik, cctv_rusak, titik_rawan, jumlah_apar, jumlah_sprinkle, jumlah_sumber_air, id]
  );

  res.redirect(`/keamanan/${rw_id}`);
};

/* =========================================================
   HAPUS
   ========================================================= */
exports.deleteKeamanan = async (req, res) => {
  const { id, rw_id } = req.params;
  await pool.query('DELETE FROM keamanan WHERE id=?', [id]);
  res.redirect(`/keamanan/${rw_id}`);
};

/* =========================================================
   EXPORT EXCEL
   ========================================================= */
exports.exportExcel = async (req, res) => {
  try {
    const { rw_id } = req.params;

    const [rwRows] = await pool.query('SELECT kode_rw FROM rw WHERE id=?', [rw_id]);
    if (rwRows.length === 0) {
      return res.status(404).send('RW tidak ditemukan');
    }
    const kode_rw = rwRows[0].kode_rw;

    const [rows] = await pool.query(
      `SELECT pos_keamanan_unit, pos_keamanan_baik, pos_keamanan_rusak, 
              jumlah_linmas, jumlah_satpam, jumlah_cctv, 
              cctv_baik, cctv_rusak, titik_rawan, 
              jumlah_apar, jumlah_sprinkle, jumlah_sumber_air
       FROM keamanan WHERE rw_id=? ORDER BY id ASC`,
      [rw_id]
    );

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(`Keamanan RW ${kode_rw}`);

    sheet.columns = [
      { header: 'Pos Unit',       key: 'pos_keamanan_unit', width: 15 },
      { header: 'Pos Baik',       key: 'pos_keamanan_baik', width: 15 },
      { header: 'Pos Rusak',      key: 'pos_keamanan_rusak', width: 15 },
      { header: 'Jumlah Linmas',  key: 'jumlah_linmas', width: 15 },
      { header: 'Jumlah Satpam',  key: 'jumlah_satpam', width: 15 },
      { header: 'Jumlah CCTV',    key: 'jumlah_cctv', width: 15 },
      { header: 'CCTV Baik',      key: 'cctv_baik', width: 15 },
      { header: 'CCTV Rusak',     key: 'cctv_rusak', width: 15 },
      { header: 'Titik Rawan',    key: 'titik_rawan', width: 40 },
      { header: 'Jumlah APAR',    key: 'jumlah_apar', width: 15 },
      { header: 'Jumlah Sprinkle',key: 'jumlah_sprinkle', width: 15 },
      { header: 'Jumlah Sumber Air', key: 'jumlah_sumber_air', width: 15 },
    ];

    sheet.addRows(rows);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=keamanan_rw${kode_rw}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal export Excel');
  }
};
