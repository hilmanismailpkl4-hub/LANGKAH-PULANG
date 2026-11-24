export interface LakeCatchDef {
  id: string;
  name: string;
  weightLabel: string;
  description: string;
  releaseNote: string;
  isFunnyJunk?: boolean;
}

export interface LittleBookStory {
  id: string;
  title: string;
  authorLabel: string;
  coverColor: string;
  accentColor: string;
  excerpt: string;
  body: string;
  damarReflection: string;
}

export const LAKE_CATCHES: LakeCatchDef[] = [
  {
    id: 'ikan_mas',
    name: 'Ikan Mas Kencana',
    weightLabel: '420 gram',
    description: 'Sisiknya berkilau keemasan memantulkan cahaya langit Danau Senja.',
    releaseNote: 'Damar tersenyum lalu melepasnya kembali ke air—siripnya melesat tenang menghilang di bawah dermaga.',
  },
  {
    id: 'ikan_nila',
    name: 'Ikan Nila Danau',
    weightLabel: '360 gram',
    description: 'Ikan air tawar yang gesit dengan tarikan halus namun terasa mantap di ujung joran.',
    releaseNote: 'Dilepas pelan kembali ke Danau Senja agar danau tetap hidup untuk anak-anak yang datang sore nanti.',
  },
  {
    id: 'ikan_mujair',
    name: 'Ikan Mujair Perak',
    weightLabel: '290 gram',
    description: 'Berwarna keperakan bersih, salah satu penghuni paling setia di tepian dermaga.',
    releaseNote: 'Kembali berenang bebas menimbulkan satu riak cincin kecil di permukaan air.',
  },
  {
    id: 'ikan_sepat',
    name: 'Ikan Sepat Mutiara',
    weightLabel: '140 gram',
    description: 'Kecil dengan corak bintik halus yang cantik saat terkena sinar matahari.',
    releaseNote: 'Damar melepaskannya dengan sangat hati-hati sambil bergumam pelan, "Berenang jauh ya."',
  },
  {
    id: 'ikan_betok',
    name: 'Ikan Betok Hijau',
    weightLabel: '210 gram',
    description: 'Ikan asli perairan tropis Indonesia yang kuat dan penuh energi.',
    releaseNote: 'Begitu menyentuh permukaan air, ikan itu langsung menyelam kembali ke dekat akar teratai.',
  },
  {
    id: 'sandal_kecil',
    name: 'Sandal Jepit Karet Tua',
    weightLabel: '180 gram',
    description: 'Tarikan berat tadi ternyata sebelah sandal biru yang entah milik siapa beberapa bulan lalu.',
    releaseNote: 'Damar tertawa kecil sendiri lalu membuangnya rapi ke tempat sampah taman—lumayan ikut membersihkan danau!',
    isFunnyJunk: true,
  },
];

export const LITTLE_LIBRARY_BOOKS: LittleBookStory[] = [
  {
    id: 'book_train_2155',
    title: 'Catatan dari Penumpang Kereta 21.55',
    authorLabel: 'Anonim · Pekerja Kantoran',
    coverColor: '#364d6b',
    accentColor: '#93c5fd',
    excerpt: 'Tentang seorang ayah yang belajar turun satu stasiun lebih awal demi menenangkan napasnya.',
    body: 'Selama empat tahun, aku selalu berlari mengejar gerbong terakhir pukul 21.55 dengan kepala penuh daftar pekerjaan besok. Suatu Jumat, aku memilih keluar lebih sore, membeli dua potong roti hangat, dan berjalan kaki melewati jembatan sungai. Ternyata dunia tidak runtuh saat aku melambat sepuluh menit. Justru malam itu, untuk pertama kalinya dalam setahun, anakku belum tidur saat aku membuka pintu rumah.',
    damarReflection: 'Rasanya seperti membaca surat yang kutulis sendiri tanpa sadar...',
  },
  {
    id: 'book_ginger_1998',
    title: 'Resep Wedang Jahe & Rumah yang Hangat',
    authorLabel: 'Ditulis tangan oleh Ibu Ratna',
    coverColor: '#7c432b',
    accentColor: '#fcd34d',
    excerpt: 'Secarik kertas buku resep tua beraroma cengkeh dan kenangan sore hujan.',
    body: 'Geprek dua ruas jahe merah yang sudah dibakar sebentar di atas api kecil. Masukkan gula aren secukupnya dan sebatang serai. Jangan buru-buru mendidihkannya dengan api besar—biarkan wanginya keluar pelan-pelan. Sama seperti mengobrol dengan orang yang kita sayangi: yang membuat hangat bukan cepatnya selesai, melainkan kesabaran untuk tetap duduk sampai cangkir terakhir.',
    damarReflection: 'Persis seperti yang selalu Pak Slamet bilang di gerobaknya.',
  },
  {
    id: 'book_rain_child',
    title: 'Surat untuk Anak yang Belum Suka Hujan',
    authorLabel: 'Arsip Perpustakaan Kota',
    coverColor: '#2d5c57',
    accentColor: '#6ee7b7',
    excerpt: 'Kisah pendek tentang payung bening, genangan air, dan sore yang melambat.',
    body: 'Dulu kamu selalu cemberut tiap langit berubah kelabu karena tidak bisa main sepeda di luar. Lalu suatu sore kita berdiri di bawah payung bening, mendengarkan bunyi titik air jatuh satu per satu di plastik tipis di atas kepala kita. Kamu tiba-tiba tertawa dan bilang hujan itu sebenarnya sedang mengetuk pintu supaya semua orang ingat jalan pulang.',
    damarReflection: 'Aku harus membacakan cerita ini buat Kira sebelum tidur nanti malam.',
  },
  {
    id: 'book_old_guitar',
    title: 'Gitar yang Lama Disimpan di Sudut Lemari',
    authorLabel: 'Catatan Kecil · Toko Nada Lama',
    coverColor: '#6b3636',
    accentColor: '#fca5a5',
    excerpt: 'Mengapa mimpi masa muda tidak harus menjadi panggung besar agar tetap bermakna.',
    body: 'Banyak orang mengira jika kita tidak menjadi terkenal, berarti lagu-lagu yang pernah kita tulis gagal. Padahal satu akor sederhana yang dimainkan di ruang tamu kecil pada Minggu sore, sambil seseorang yang kita cintai tersenyum mendengarkannya, sudah jauh lebih besar maknanya daripada tepuk tangan ribuan orang asing.',
    damarReflection: 'Mas Bagas pasti diam-diam ikut menyelipkan catatan ini di kotak buku taman.',
  },
  {
    id: 'book_small_things',
    title: 'Daftar Hal Kecil yang Bikin Hari Ini Senang',
    authorLabel: 'Tulisan Pensil Anak Kelas 2 SD',
    coverColor: '#8c6528',
    accentColor: '#fde68a',
    excerpt: 'Coretan pensil polos dengan gambar bintang kecil di pinggir halamannya.',
    body: '1. Kucing oranye dekat gang mau dielus kepalanya. 2. Es krim stroberi tidak jatuh ke tanah. 3. Melihat ikan warna emas berenang di danau. 4. Bermain ayunan sampai tinggi. 5. Jalan pelan-pelan di taman sambil digandeng tangan Ayah dan Bunda. Kalau lima hal ini ada, besok pasti hari yang paling bagus!',
    damarReflection: 'Anak-anak tidak pernah meminta dunia yang megah... mereka hanya meminta kita benar-benar hadir.',
  },
];
