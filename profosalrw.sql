-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 19, 2025 at 04:44 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `profosalrw`
--

-- --------------------------------------------------------

--
-- Table structure for table `ekonomi_unit`
--

CREATE TABLE `ekonomi_unit` (
  `id` int(11) NOT NULL,
  `rw_id` int(11) NOT NULL,
  `jenis` varchar(255) DEFAULT NULL,
  `jumlah_unit` int(11) DEFAULT 0,
  `jumlah_anggota` int(11) DEFAULT 0,
  `keterangan` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `keamanan`
--

CREATE TABLE `keamanan` (
  `id` int(11) NOT NULL,
  `rw_id` int(11) NOT NULL,
  `pos_keamanan_unit` int(11) DEFAULT 0,
  `pos_keamanan_baik` int(11) DEFAULT 0,
  `pos_keamanan_rusak` int(11) DEFAULT 0,
  `jumlah_linmas` int(11) DEFAULT 0,
  `jumlah_satpam` int(11) DEFAULT 0,
  `jumlah_cctv` int(11) DEFAULT 0,
  `cctv_baik` int(11) DEFAULT 0,
  `cctv_rusak` int(11) DEFAULT 0,
  `titik_rawan` text DEFAULT NULL,
  `jumlah_apar` int(11) DEFAULT 0,
  `jumlah_sprinkle` int(11) DEFAULT 0,
  `jumlah_sumber_air` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `keamanan`
--

INSERT INTO `keamanan` (`id`, `rw_id`, `pos_keamanan_unit`, `pos_keamanan_baik`, `pos_keamanan_rusak`, `jumlah_linmas`, `jumlah_satpam`, `jumlah_cctv`, `cctv_baik`, `cctv_rusak`, `titik_rawan`, `jumlah_apar`, `jumlah_sprinkle`, `jumlah_sumber_air`) VALUES
(4, 3, 2, 2, 0, 4, 4, 0, 0, 0, '0', 1, 1, 10);

-- --------------------------------------------------------

--
-- Table structure for table `kepengurusan_rw`
--

CREATE TABLE `kepengurusan_rw` (
  `id` int(11) NOT NULL,
  `rw_id` int(11) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `jabatan` varchar(100) NOT NULL,
  `no_ktp` varchar(50) DEFAULT NULL,
  `telp` varchar(50) DEFAULT NULL,
  `alamat` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kepengurusan_rw`
--

INSERT INTO `kepengurusan_rw` (`id`, `rw_id`, `nama`, `jabatan`, `no_ktp`, `telp`, `alamat`, `created_at`) VALUES
(9, 3, 'Nama Pengurus', 'Ketua', '1234', '0812...', 'Alamat', '2025-09-18 09:06:15');

-- --------------------------------------------------------

--
-- Table structure for table `legalitas`
--

CREATE TABLE `legalitas` (
  `id` int(11) NOT NULL,
  `rw_id` int(11) NOT NULL,
  `jenis` varchar(255) DEFAULT NULL,
  `nomor` varchar(255) DEFAULT NULL,
  `tanggal` date DEFAULT NULL,
  `masa_bakti` varchar(255) DEFAULT NULL,
  `file_path` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `organisasi`
--

CREATE TABLE `organisasi` (
  `id` int(11) NOT NULL,
  `rw_id` int(11) NOT NULL,
  `tipe` varchar(100) DEFAULT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `jumlah_unit` int(11) DEFAULT 0,
  `jumlah_orang` int(11) DEFAULT 0,
  `lokasi` varchar(255) DEFAULT NULL,
  `keterangan` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `organisasi`
--

INSERT INTO `organisasi` (`id`, `rw_id`, `tipe`, `nama`, `jumlah_unit`, `jumlah_orang`, `lokasi`, `keterangan`) VALUES
(1, 1, 'Karang Taruna', 'Karang Taruna RW 01', 1, 25, 'Balai RW 01', 'Aktif setiap akhir pekan'),
(6, 3, 'Karang Taruna', 'Karang Taruna RW 12', 2, 30, 'jl coba', 'coba');

-- --------------------------------------------------------

--
-- Table structure for table `pendidikan_unit`
--

CREATE TABLE `pendidikan_unit` (
  `id` int(11) NOT NULL,
  `rw_id` int(11) NOT NULL,
  `jenis` varchar(255) DEFAULT NULL,
  `jumlah_unit` int(11) DEFAULT 0,
  `jumlah_guru` int(11) DEFAULT 0,
  `jumlah_orang` int(11) DEFAULT 0,
  `keterangan` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `penduduk`
--

CREATE TABLE `penduduk` (
  `id` int(11) NOT NULL,
  `rw_id` int(11) NOT NULL,
  `rt` int(11) DEFAULT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `nik` varchar(50) DEFAULT NULL,
  `jenis_kelamin` enum('L','P') DEFAULT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `pendidikan` enum('sd','smp','sma','d3','s1','s2','s3') DEFAULT NULL,
  `pekerjaan` enum('tidak bekerja','mengurus rumah tangga','pelajar','mahasiswa','pensiunan','pns','tni','polisi','perdagangan','petani','nelayan','swasta','bumn','bumd','bhl','tukang','seniman','mekanik','tabib','wartawan') DEFAULT NULL,
  `alamat` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `penduduk`
--

INSERT INTO `penduduk` (`id`, `rw_id`, `rt`, `nama`, `nik`, `jenis_kelamin`, `tanggal_lahir`, `pendidikan`, `pekerjaan`, `alamat`, `created_at`) VALUES
(5, 3, 4, 'iqbal', '32000000', 'L', '2025-09-14', 'sd', 'tidak bekerja', 'bojong', '2025-09-16 02:56:01'),
(7, 4, 4, 'saifudin', '3200000000', 'L', '2025-08-14', 's1', 'mahasiswa', 'coba', '2025-09-17 01:55:09'),
(8, 2, 4, 'Test', '320000000', 'P', '2025-07-17', 'sd', 'pelajar', 'test', '2025-09-17 01:55:55'),
(9, 2, 1, 'coba', '3200000000', 'P', '2025-07-14', 'sd', 'mengurus rumah tangga', 'coba', '2025-09-17 02:04:07'),
(11, 3, 8, 'arif', '32xxxxxxxxxxx', 'L', '2001-08-10', 's1', 'bumn', 'jl test', '2025-09-18 04:09:57');

-- --------------------------------------------------------

--
-- Table structure for table `rw`
--

CREATE TABLE `rw` (
  `id` int(11) NOT NULL,
  `kode_rw` varchar(50) NOT NULL,
  `nama_rw` varchar(255) NOT NULL,
  `alamat` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rw`
--

INSERT INTO `rw` (`id`, `kode_rw`, `nama_rw`, `alamat`, `created_at`, `updated_at`) VALUES
(1, '01', 'Dudung', 'Jl. Damai No.1', '2025-09-15 11:17:34', '2025-09-17 06:08:53'),
(2, '02', 'Dadang', 'Jl. Sejahtera No.5', '2025-09-15 11:17:34', '2025-09-16 05:00:19'),
(3, '03', 'Gaos Darmawan', 'Bojong Kaler', '2025-09-16 02:53:05', '2025-09-18 09:07:55'),
(4, '04', 'Dodong', 'coba', '2025-09-16 07:13:51', '2025-09-18 09:07:48'),
(6, '06', 'Coba', 'Coba', '2025-09-17 04:30:27', '2025-09-18 09:07:41');

-- --------------------------------------------------------

--
-- Table structure for table `sarana_prasarana`
--

CREATE TABLE `sarana_prasarana` (
  `id` int(11) NOT NULL,
  `rw_id` int(11) NOT NULL,
  `kategori` varchar(255) DEFAULT NULL,
  `nama_item` varchar(255) DEFAULT NULL,
  `kondisi` varchar(50) DEFAULT NULL,
  `jumlah` int(11) DEFAULT 0,
  `keterangan` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sdm_cacat`
--

CREATE TABLE `sdm_cacat` (
  `id` int(11) NOT NULL,
  `rw_id` int(11) NOT NULL,
  `tipe` varchar(100) DEFAULT NULL,
  `jumlah` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sdm_pekerjaan`
--

CREATE TABLE `sdm_pekerjaan` (
  `id` int(11) NOT NULL,
  `rw_id` int(11) NOT NULL,
  `pekerjaan` varchar(255) DEFAULT NULL,
  `jumlah` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sdm_pendidikan`
--

CREATE TABLE `sdm_pendidikan` (
  `id` int(11) NOT NULL,
  `rw_id` int(11) NOT NULL,
  `tingkat` varchar(100) DEFAULT NULL,
  `jumlah` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sdm_umur`
--

CREATE TABLE `sdm_umur` (
  `id` int(11) NOT NULL,
  `rw_id` int(11) NOT NULL,
  `umur_kategori` varchar(100) DEFAULT NULL,
  `laki` int(11) DEFAULT 0,
  `perempuan` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `seksi`
--

CREATE TABLE `seksi` (
  `id` int(11) NOT NULL,
  `rw_id` int(11) NOT NULL,
  `nama_seksi` varchar(255) DEFAULT NULL,
  `jumlah_unit` int(11) DEFAULT 0,
  `jumlah_orang` int(11) DEFAULT 0,
  `keterangan` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ekonomi_unit`
--
ALTER TABLE `ekonomi_unit`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rw_id` (`rw_id`);

--
-- Indexes for table `keamanan`
--
ALTER TABLE `keamanan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rw_id` (`rw_id`);

--
-- Indexes for table `kepengurusan_rw`
--
ALTER TABLE `kepengurusan_rw`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_rw` (`rw_id`);

--
-- Indexes for table `legalitas`
--
ALTER TABLE `legalitas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rw_id` (`rw_id`);

--
-- Indexes for table `organisasi`
--
ALTER TABLE `organisasi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rw_id` (`rw_id`);

--
-- Indexes for table `pendidikan_unit`
--
ALTER TABLE `pendidikan_unit`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rw_id` (`rw_id`);

--
-- Indexes for table `penduduk`
--
ALTER TABLE `penduduk`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rw_id` (`rw_id`);

--
-- Indexes for table `rw`
--
ALTER TABLE `rw`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kode_rw` (`kode_rw`);

--
-- Indexes for table `sarana_prasarana`
--
ALTER TABLE `sarana_prasarana`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rw_id` (`rw_id`);

--
-- Indexes for table `sdm_cacat`
--
ALTER TABLE `sdm_cacat`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rw_id` (`rw_id`);

--
-- Indexes for table `sdm_pekerjaan`
--
ALTER TABLE `sdm_pekerjaan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rw_id` (`rw_id`);

--
-- Indexes for table `sdm_pendidikan`
--
ALTER TABLE `sdm_pendidikan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rw_id` (`rw_id`);

--
-- Indexes for table `sdm_umur`
--
ALTER TABLE `sdm_umur`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rw_id` (`rw_id`);

--
-- Indexes for table `seksi`
--
ALTER TABLE `seksi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rw_id` (`rw_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ekonomi_unit`
--
ALTER TABLE `ekonomi_unit`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `keamanan`
--
ALTER TABLE `keamanan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `kepengurusan_rw`
--
ALTER TABLE `kepengurusan_rw`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `legalitas`
--
ALTER TABLE `legalitas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `organisasi`
--
ALTER TABLE `organisasi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `pendidikan_unit`
--
ALTER TABLE `pendidikan_unit`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `penduduk`
--
ALTER TABLE `penduduk`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `rw`
--
ALTER TABLE `rw`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `sarana_prasarana`
--
ALTER TABLE `sarana_prasarana`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sdm_cacat`
--
ALTER TABLE `sdm_cacat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sdm_pekerjaan`
--
ALTER TABLE `sdm_pekerjaan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sdm_pendidikan`
--
ALTER TABLE `sdm_pendidikan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sdm_umur`
--
ALTER TABLE `sdm_umur`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `seksi`
--
ALTER TABLE `seksi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ekonomi_unit`
--
ALTER TABLE `ekonomi_unit`
  ADD CONSTRAINT `ekonomi_unit_ibfk_1` FOREIGN KEY (`rw_id`) REFERENCES `rw` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `keamanan`
--
ALTER TABLE `keamanan`
  ADD CONSTRAINT `keamanan_ibfk_1` FOREIGN KEY (`rw_id`) REFERENCES `rw` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `legalitas`
--
ALTER TABLE `legalitas`
  ADD CONSTRAINT `legalitas_ibfk_1` FOREIGN KEY (`rw_id`) REFERENCES `rw` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `organisasi`
--
ALTER TABLE `organisasi`
  ADD CONSTRAINT `organisasi_ibfk_1` FOREIGN KEY (`rw_id`) REFERENCES `rw` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pendidikan_unit`
--
ALTER TABLE `pendidikan_unit`
  ADD CONSTRAINT `pendidikan_unit_ibfk_1` FOREIGN KEY (`rw_id`) REFERENCES `rw` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `penduduk`
--
ALTER TABLE `penduduk`
  ADD CONSTRAINT `penduduk_ibfk_1` FOREIGN KEY (`rw_id`) REFERENCES `rw` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sarana_prasarana`
--
ALTER TABLE `sarana_prasarana`
  ADD CONSTRAINT `sarana_prasarana_ibfk_1` FOREIGN KEY (`rw_id`) REFERENCES `rw` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sdm_cacat`
--
ALTER TABLE `sdm_cacat`
  ADD CONSTRAINT `sdm_cacat_ibfk_1` FOREIGN KEY (`rw_id`) REFERENCES `rw` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sdm_pekerjaan`
--
ALTER TABLE `sdm_pekerjaan`
  ADD CONSTRAINT `sdm_pekerjaan_ibfk_1` FOREIGN KEY (`rw_id`) REFERENCES `rw` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sdm_pendidikan`
--
ALTER TABLE `sdm_pendidikan`
  ADD CONSTRAINT `sdm_pendidikan_ibfk_1` FOREIGN KEY (`rw_id`) REFERENCES `rw` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sdm_umur`
--
ALTER TABLE `sdm_umur`
  ADD CONSTRAINT `sdm_umur_ibfk_1` FOREIGN KEY (`rw_id`) REFERENCES `rw` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `seksi`
--
ALTER TABLE `seksi`
  ADD CONSTRAINT `seksi_ibfk_1` FOREIGN KEY (`rw_id`) REFERENCES `rw` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
