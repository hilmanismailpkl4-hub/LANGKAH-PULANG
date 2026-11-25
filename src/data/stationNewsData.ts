export interface NewsArticle {
  id: string;
  section: string;
  headline: string;
  byline: string;
  summary: string;
  paragraphs: string[];
  closingNote: string;
}

export const STATION_NEWS_EDITION = {
  paperName: 'HARIAN WARTA SENJA',
  tagline: 'Kabar Kota, Warga & Cerita Sederhana · Terbit Setiap Hari',
  priceLabel: 'Rp 4.000',
};

export const STATION_NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'news_lampion_sungai',
    section: 'Tajuk Kota',
    headline: 'Untaian Lampion Tepi Sungai & Martabak Malam Hidupkan Promenade Kota',
    byline: 'Liputan Sore · Tepi Sungai Jl. Kenangan',
    summary: 'Warga kini gemar berjalan kaki di sepanjang tanggul sungai sejak lampu lampion kertas dan gerobak jajanan malam hadir.',
    paragraphs: [
      'Suasana senja di sepanjang Sungai Kota beberapa pekan terakhir tampak jauh lebih hangat. Ratusan pendar kecil dari untaian lampion kertas yang melengkung di atas air menjadi latar favorit keluarga muda maupun pekerja kantoran yang baru pulang.',
      'Di sisi timur tanggul, kepulan uap dari dandang kacang rebus dan wangi mentega martabak manis gerobak Bang Udin selalu membuat langkah pejalan kaki melambat. Banyak warga mengaku hanya butuh duduk sepuluh menit di bangku kayu tepi sungai untuk melepas penat sebelum pulang ke rumah.',
    ],
    closingNote: 'Catatan redaksi: Promenade sungai paling teduh dikunjungi menjelang senja hingga malam tenang.',
  },
  {
    id: 'news_musik_kota',
    section: 'Musik & Budaya',
    headline: 'Gema Akustik Kota: Dari Kaset Lawas "Nada Lama" hingga Gazebo Taman',
    byline: 'Rubrik Seni · Sudut Jl. Kenangan',
    summary: 'Musik akustik sederhana kembali dicintai warga kota berkat panggung terbuka taman dan toko kaset lawas.',
    paragraphs: [
      'Di tengah riuhnya kota modern, Toko Musik "Nada Lama" milik Mas Bagas tetap menjadi persinggahan setia para pencinta kaset pita dan gitar kayu. Beberapa koleksi kaset demo lokal era 2018—termasuk rekaman band kecil "Langkah Kecil"—masih sering diputar di tape deck toko.',
      'Semangat yang sama kini menular ke Gazebo Panggung Akustik di Taman Kota serta tepi sungai barat, tempat pemusik jalanan seperti Mas Seno kerap memetik gitar lembut untuk menemani warga yang baru turun dari jembatan.',
    ],
    closingNote: 'Musik yang jujur tidak pernah membutuhkan panggung megah—cukup satu gitar dan pendengar yang tulus.',
  },
  {
    id: 'news_stasiun_baca',
    section: 'Transportasi & Warga',
    headline: 'Peron Stasiun Senja Makin Tertib, Lapak Buku Bekas & Taman Baca Kian Ramai',
    byline: 'Kabar Peron · Stasiun Kereta Tua Senja',
    summary: 'Kereta komuter kini berhenti tertib dengan sinyal peron baru, sementara kebiasaan membaca buku fisik kembali tumbuh.',
    paragraphs: [
      'Penumpang kereta komuter di Stasiun Senja menyambut baik pembaruan sinyal pengaman rel dan jadwal berhenti peron yang makin teratur. Sambil menunggu kereta berikutnya tiba, banyak warga memanfaatkan waktu untuk mampir ke lapak buku bekas Pak Darman.',
      'Sementara itu di barat kota, kotak buku jalanan "Taman Baca Mini" di tengah Taman Bunga juga terus terisi buku-buku catatan dan kisah pendek titipan warga Perumahan Melati.',
    ],
    closingNote: 'Info peron: Perhatikan lampu sinyal merah berkedip di tepi rel saat rangkaian kereta mendekat.',
  },
  {
    id: 'news_keluarga_akhir_pekan',
    section: 'Keluarga & Rumah',
    headline: 'Tiga Cara Sederhana Menjaga Hangatnya Rumah di Tengah Kesibukan Kerja',
    byline: 'Kolom Akhir Pekan · Perumahan Melati',
    summary: 'Psikolog keluarga mengingatkan bahwa kehadiran utuh lima belas menit lebih berarti daripada sekadar janji mahal.',
    paragraphs: [
      'Banyak orang tua muda terjebak rasa bersalah karena jam lembur yang panjang, lalu mencoba menebusnya dengan rencana liburan besar yang terus tertunda. Padahal menurut pengamatan keseharian warga, anak-anak justru paling mengingat momen-momen kecil yang hangat.',
      'Memasak sup bersama di dapur, menggelar tikar piknik sederhana di rumput Taman Kota, meninggalkan catatan kecil di pintu kulkas, atau sekadar berjalan kaki sore tanpa menatap layar ponsel kerja sudah cukup untuk membuat sebuah rumah terasa penuh kembali.',
    ],
    closingNote: '"Tidak ada langkah pulang yang terlalu sederhana selama kita benar-benar hadir saat tiba."',
  },
];
