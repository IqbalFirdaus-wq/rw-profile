// controllers/pendudukController.js
const pool    = require('../config/db');
const ExcelJS = require('exceljs');

/* =========================================================
   LIST / DAFTAR PENDUDUK
   ========================================================= */
// controllers/pendudukController.js
exports.listPenduduk = async (req, res) => {
  try {
    const rw_id = req.params.rw_id || null;
    const rt    = req.query.rt || '';

    // Ambil sort & order dari query
    let sort  = req.query.sort  || 'nama';
    let order = req.query.order || 'asc';

    // 🔑 Mapping nama sort di UI -> kolom DB
    const sortMap = {
      rt: 'rt',
      nama: 'nama',
      nik: 'nik',
      tanggal_lahir: 'tanggal_lahir',
      pendidikan: 'pendidikan',
      pekerjaan: 'pekerjaan'
      // kalau mau sort by RW gunakan 'rw_id', bukan kode_rw
    };

    // gunakan kolom yang valid
    const sortColumn = sortMap[sort] || 'nama';
    const sortOrder  = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    // Bangun query dinamis
    let sql = 'SELECT * FROM penduduk';
    const where = [];
    const params = [];

    if (rw_id) { where.push('rw_id=?'); params.push(rw_id); }
    if (rt)    { where.push('rt=?');    params.push(rt);    }
    if (where.length) sql += ' WHERE ' + where.join(' AND ');
    sql += ` ORDER BY ${sortColumn} ${sortOrder}`;

    const [rows]  = await pool.query(sql, params);

    const [allRw] = await pool.query(
      'SELECT id, kode_rw, nama_rw FROM rw ORDER BY kode_rw ASC'
    );

    res.render('penduduk/penduduk', {
      penduduk: rows,
      allRw,
      rw_id,
      kode_rw: rw_id,
      rt,
      sort,
      order,
      title: rw_id ? `Penduduk RW ${rw_id}` : 'Daftar Penduduk'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal menampilkan data penduduk');
  }
};



/* =========================================================
   FORM TAMBAH PENDUDUK
   ========================================================= */
exports.addPendudukForm = async (req, res) => {
  try {
    const rw_id = req.params.rw_id || null;

    // ambil daftar RW untuk dropdown
    const [rwList] = await pool.query(
      'SELECT id, kode_rw, nama_rw FROM rw ORDER BY kode_rw ASC'
    );

    res.render('penduduk/addPenduduk', {
      rw_id,
      rwList,
      title: 'Tambah Penduduk'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal menampilkan form tambah penduduk');
  }
};

/* =========================================================
   SIMPAN DATA BARU
   ========================================================= */
exports.addPenduduk = async (req, res) => {
  try {
    // rw_id bisa dari URL (/penduduk/:rw_id/add) atau dari form (dropdown)
    const rw_id = req.params.rw_id || req.body.rw_id;
    const { rt, nama, nik, jenis_kelamin,
            tanggal_lahir, pendidikan,
            pekerjaan, alamat } = req.body;

    if (!rw_id) {
      return res.status(400).send('RW harus dipilih');
    }

    await pool.query(
      `INSERT INTO penduduk
         (rw_id, rt, nama, nik, jenis_kelamin,
          tanggal_lahir, pendidikan, pekerjaan, alamat)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [rw_id, rt, nama, nik, jenis_kelamin,
       tanggal_lahir, pendidikan, pekerjaan, alamat]
    );

    // arahkan kembali ke daftar penduduk RW yang dipilih
    res.redirect(`/penduduk/${rw_id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal menambah data penduduk');
  }
};

/* =========================================================
   EDIT DATA
   ========================================================= */
   exports.editPendudukForm = async (req, res) => {
    const { id, rw_id } = req.params;
    const [rows] = await pool.query('SELECT * FROM penduduk WHERE id=?', [id]);
    const [rwList] = await pool.query(
      'SELECT id, kode_rw, nama_rw FROM rw ORDER BY kode_rw ASC'
    );
  
    if (!rows.length) return res.status(404).send("Data penduduk tidak ditemukan");
  
    res.render('penduduk/editPenduduk', {
      p: rows[0],
      rw_id,
      rwList,
      title: 'Edit Penduduk'
    });
  };
  
  exports.editPenduduk = async (req, res) => {
    const { id, rw_id } = req.params;
    const { rt, nama, nik, jenis_kelamin,
            tanggal_lahir, pendidikan,
            pekerjaan, alamat } = req.body;
  
    await pool.query(
      `UPDATE penduduk
          SET rt=?, nama=?, nik=?, jenis_kelamin=?, tanggal_lahir=?,
              pendidikan=?, pekerjaan=?, alamat=?
        WHERE id=?`,
      [rt, nama, nik, jenis_kelamin, tanggal_lahir,
       pendidikan, pekerjaan, alamat, id]
    );
  
    res.redirect(`/penduduk/${rw_id}`);
  };
  
  /* =========================================================
     HAPUS DATA
     ========================================================= */
  exports.deletePenduduk = async (req, res) => {
    const { id, rw_id } = req.params;
    await pool.query('DELETE FROM penduduk WHERE id=?', [id]);
    res.redirect(`/penduduk/${rw_id}`);
  };  

/* =========================================================
   EXPORT KE EXCEL
   ========================================================= */
exports.exportExcel = async (req, res) => {
  try {
    const { rw_id } = req.params;
    const [rows] = await pool.query(
      `SELECT nama, nik, jenis_kelamin, tanggal_lahir,
              pendidikan, pekerjaan, alamat
         FROM penduduk
        WHERE rw_id=? ORDER BY nama ASC`,
      [rw_id]
    );

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(`Penduduk RW ${rw_id}`);
    sheet.columns = [
      { header: 'Nama',          key: 'nama',          width: 25 },
      { header: 'NIK',           key: 'nik',           width: 20 },
      { header: 'Jenis Kelamin', key: 'jenis_kelamin', width: 15 },
      { header: 'Tanggal Lahir', key: 'tanggal_lahir', width: 15 },
      { header: 'Pendidikan',    key: 'pendidikan',    width: 20 },
      { header: 'Pekerjaan',     key: 'pekerjaan',     width: 20 },
      { header: 'Alamat',        key: 'alamat',        width: 40 }
    ];
    sheet.addRows(rows);

    res.setHeader('Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition',
      `attachment; filename=penduduk_rw${rw_id}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal export Excel');
  }
};
