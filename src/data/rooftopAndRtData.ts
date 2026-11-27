export interface TelescopeTarget {
  id: string;
  name: string;
  subtitle: string;
  bearingLabel: string;
  lookAt: [number, number, number];
  caption: string;
}

export interface RtBoardNotice {
  id: string;
  category: string;
  title: string;
  dateLabel: string;
  author: string;
  paperColor: string;
  pinColor: string;
  tiltDeg: number;
  body: string;
  footer: string;
}

/**
 * 4 arah pemandangan zoom optik dari Teropong Koin Rooftop Menara Nusantara.
 */
export const ROOFTOP_TELESCOPE_TARGETS: TelescopeTarget[] = [
  {
    id: 'tel_rumah',
    name: 'Rumah Keluarga Damar · Jl. Melati No. 14',
    subtitle: 'Perumahan Melati (Selatan–Barat Daya)',
    bearingLabel: '212° SBD · 8.0× ZOOM',
    lookAt: [-20.0, 2.6, 66.0],
    caption:
      'Dari ketinggian Menara Nusantara, atap genteng dan lampu kuning hangat di Jl. Melati No. 14 tampak begitu kecil—namun justru di sanalah seluruh alasanmu melangkah pulang.',
  },
  {
    id: 'tel_jembatan',
    name: 'Jembatan Lampion & Sungai Kota',
    subtitle: 'Jl. Kenangan Barat (Barat Daya)',
    bearingLabel: '248° BD · 8.0× ZOOM',
    lookAt: [-48.0, 2.2, 6.0],
    caption:
      'Pylon jembatan gantung, barisan gembok kenangan, dan untaian lampion tepi sungai memantulkan cahaya hangat di atas aliran Sungai Kota.',
  },
  {
    id: 'tel_danau',
    name: 'Taman Kota, Dermaga & Sampan Danau Senja',
    subtitle: 'Kawasan Barat Kota (Barat)',
    bearingLabel: '272° B · 8.0× ZOOM',
    lookAt: [-82.0, 1.5, -26.5],
    caption:
      'Dua sampan kayu tradisional mengayun tenang di permukaan Danau Senja, dikelilingi rindangnya pohon taman dan dermaga kayu tua.',
  },
  {
    id: 'tel_stasiun',
    name: 'Menara Jam & Peron Stasiun Senja',
    subtitle: 'Jalur Komuter Timur (Tenggara)',
    bearingLabel: '118° TG · 8.0× ZOOM',
    lookAt: [80.0, 3.2, -5.0],
    caption:
      'Jam bundar besar di atas Stasiun Senja terus berdetak tenang, mengantar dan menyambut setiap penumpang komuter yang pulang menjelang senja.',
  },
  {
    id: 'tel_sawah',
    name: 'Lembah Sawah Senja & Saung Bambu',
    subtitle: 'Seberang Jembatan Selatan (Barat Daya)',
    bearingLabel: '226° BD · 8.0× ZOOM',
    lookAt: [-76.0, 1.2, 60.0],
    caption:
      'Petak-petak sawah berair dan kincir irigasi bambu berkilau tenang di ujung selatan sungai—tempat almarhumah Ibu dulu menitipkan pesan Ilmu Padi.',
  },
  {
    id: 'tel_tabebuya',
    name: 'Koridor Bunga Tabebuya · Jl. Stasiun Timur',
    subtitle: 'Boulevard Timur Kota (Tenggara)',
    bearingLabel: '136° TG · 8.0× ZOOM',
    lookAt: [64.0, 2.8, 28.0],
    caption:
      'Deretan kanopi Tabebuya merah muda dan kuning keemasan mekar semarak di sepanjang jalan menuju Stasiun Senja.',
  },
];

/**
 * 5 selebaran & pengumuman hangat di Papan Pengumuman RT 04 / RW 02 Perumahan Melati.
 */
export const RT_BOARD_NOTICES: RtBoardNotice[] = [
  {
    id: 'rt_kerja_bakti',
    category: 'Pengumuman Resmi RT',
    title: 'Kerja Bakti Bersih Gang & Selokan Minggu Pagi',
    dateLabel: 'Minggu · 07.30 WIB',
    author: 'Pak Sugeng (Ketua RT 04)',
    paperColor: '#fef9c3',
    pinColor: '#dc2626',
    tiltDeg: -1.4,
    body: 'Mengundang seluruh warga Jl. Melati untuk bergotong royong membersihkan saluran air, memangkas ranting pohon tepi jalan, dan mengecat ulang garis lapangan bulu tangkis gang. Setelah selesai, Ibu-Ibu PKK menyediakan bubur kacang hijau & teh melati hangat di Pos Kamling.',
    footer: 'Bawa sapu lidi, sabit, atau senyum pagi Anda!',
  },
  {
    id: 'rt_posyandu',
    category: 'Kesehatan Warga',
    title: 'Jadwal Posyandu Balita & Cek Tensi Lansia',
    dateLabel: 'Rabu Pekan Depan · 09.00 WIB',
    author: 'Ibu-Ibu Kader Posyandu Melati',
    paperColor: '#fce7f3',
    pinColor: '#2563eb',
    tiltDeg: 1.2,
    body: 'Pemeriksaan tumbuh kembang balita, pembagian vitamin A, bubur kacang hijau balita, serta cek tekanan darah gratis bagi warga lanjut usia bertempat di serambi Balai Warga sebelah rumah Bu Wati.',
    footer: 'Buku KIA mohon dibawa ya, Ibu-Ibu.',
  },
  {
    id: 'rt_ronda',
    category: 'Keamanan & Guyub',
    title: 'Jadwal Ronda Santai Pos Kamling RT 04',
    dateLabel: 'Berlaku Bulan Ini · 22.00–01.00',
    author: 'Seksi Keamanan RT 04',
    paperColor: '#e0f2fe',
    pinColor: '#16a34a',
    tiltDeg: -0.9,
    body: '• Malam Rabu: Pak Budi, Mas Joko, Pak RT\n• Malam Jumat: Pak Slamet, Mas Agung, Pak Karno\n• Malam Sabtu: Mas Damar (Jl. Melati No. 14), Pak Hendri, Mas Yudi\n\nTermos kopi panas & papan catur selalu siap di Pos Kamling. Kentongan dipukul 3 kali tiap pergantian jam aman.',
    footer: 'Mari jaga ketenangan gang kita bersama.',
  },
  {
    id: 'rt_kucing_sore',
    category: 'Catatan Tetangga',
    title: 'Titip Sayang untuk Kucing Oranye "Sore"',
    dateLabel: 'Catatan Ramah Warga',
    author: 'Bu Rina & Warga Gang Melati',
    paperColor: '#dcfce7',
    pinColor: '#d97706',
    tiltDeg: 1.6,
    body: 'Halo tetangga semua! Kucing oranye "Sore" yang biasa nongkrong dekat pohon gang minggu lalu sudah dibawa ke dokter hewan dan diberi vitamin oleh patungan warga. Boleh dielus dan diberi pakan kucing/ikan tanpa duri ya, mohon jangan diberi tulang keras.',
    footer: 'Terima kasih sudah ikut menyayangi Sore!',
  },
  {
    id: 'rt_bulutangkis',
    category: 'Olahraga Warga',
    title: 'Main Bulu Tangkis Santai Sore & Malam',
    dateLabel: 'Selasa & Sabtu · 17.00–21.00',
    author: 'Karang Taruna Melati',
    paperColor: '#ffedd5',
    pinColor: '#7c3aed',
    tiltDeg: -1.1,
    body: 'Lampu sorot Lapangan Bulu Tangkis ujung timur Gang Melati sudah menyala terang kembali! Warga dewasa maupun anak-anak dipersilakan meramaikan lapangan. Raket cadangan dan kok tersedia di bangku tepi lapangan.',
    footer: 'Sehat bareng, guyub bareng!',
  },
  {
    id: 'rt_kebun_toga',
    category: 'PKK & Lingkungan Hijau',
    title: 'Kebun TOGA Belakang Gang & Panen Sawah Selatan',
    dateLabel: 'Program Hijau RT 04',
    author: 'Ibu-Ibu PKK Melati',
    paperColor: '#ecfccb',
    pinColor: '#15803d',
    tiltDeg: 1.0,
    body: 'Kebun Tanaman Obat Keluarga (Jahe Merah, Kunyit, Serai & Lidah Buaya) di halaman belakang deretan rumah Jl. Melati sudah rimbun! Warga boleh memetik secukupnya untuk wedang keluarga. Jangan lupa mampir menikmati udara sore di Saung Bambu Lembah Sawah seberang Jembatan Selatan.',
    footer: 'Hijau halaman kita, sehat keluarga kita!',
  },
];
