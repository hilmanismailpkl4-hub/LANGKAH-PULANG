export interface HomeMailboxLetter {
  id: string;
  senderName: string;
  senderOrigin: string;
  dateLabel: string;
  subject: string;
  kind: 'postcard' | 'letter' | 'invitation' | 'notice';
  stampTitle: string;
  stampColor: string;
  paperTint: string;
  greeting: string;
  paragraphs: string[];
  signOff: string;
  damarReflection: string;
}

/**
 * Koleksi surat & kartu pos hangat di Kotak Surat Pagar Rumah Jl. Melati No. 14.
 */
export const HOME_MAILBOX_LETTERS: HomeMailboxLetter[] = [
  {
    id: 'mail_ibu_bandung',
    senderName: 'Ibu & Bapak',
    senderOrigin: 'Ciumbuleuit, Bandung',
    dateLabel: 'Cap Pos · 2 Hari Lalu',
    subject: 'Kartu Pos & Kabar dari Rumah Bandung',
    kind: 'postcard',
    stampTitle: 'POS RI · 5000',
    stampColor: '#2d6a4f',
    paperTint: '#fdf8ee',
    greeting: 'Untuk Damar, Nadia, dan cucu kesayangan Ibu, Kira,',
    paragraphs: [
      'Di Bandung beberapa hari ini gerimis terus dari jam tiga sore. Setiap kali Bapak menyeduh teh tubruk di teras belakang, kami selalu teringat kalian bertiga di sana.',
      'Damar, Nak, Ibu tahu pekerjaan di kantor memang tidak pernah benar-benar habis. Tapi jangan sampai lupa makan tepat waktu, dan sempatkan duduk santai menemani Nadia sama Kira ya. Anak-anak cepat sekali besar, tahu-tahu nanti Kira sudah masuk SD.',
      'Pekan depan kalau jadi ada titipan lewat sepupu, Ibu mau kirim rengginang lorjuk kesukaan Nadia dan jaket rajut warna kuning buat Kira. Sehat-sehat selalu ya, Nak.',
    ],
    signOff: 'Peluk hangat dari Bandung,\nIbu & Bapak',
    damarReflection:
      'Tulisan tangan Ibu yang sedikit miring selalu punya cara pelan untuk mengingatkanku: sesibuk apa pun aku di kota, aku tetap anak yang selalu didoakan agar pulang dengan tenang.',
  },
  {
    id: 'mail_bima_acoustic',
    senderName: 'Bima Pratama',
    senderOrigin: 'Kedai Kopi Sudut · Jl. Kenangan',
    dateLabel: 'Diselipkan Kemarin Sore',
    subject: 'Undangan Sesi Akustik Santai Akhir Pekan',
    kind: 'invitation',
    stampTitle: 'KOPI SUDUT',
    stampColor: '#9c4a1a',
    paperTint: '#f7efe1',
    greeting: 'Halo Mar!',
    paragraphs: [
      'Maaf kemarin cuma sempat selipkan kartu ini di pagar soalnya pas aku lewat lampu ruang tamu kalian baru nyala dan aku nggak enak ganggu makan malam.',
      'Jumat sore atau akhir pekan ini, kalau kamu pulang agak awal, mampir dong ke Kedai Kopi Sudut. Gitar akustik yang dulu sering kita pakai di sudut kedai baru kuganti senarnya—suaranya hangat banget sekarang.',
      'Nggak ada panggung besar, nggak ada target apa-apa. Cuma kopi tubruk, cokelat hangat buat Kira, dan dua-tiga lagu lama sambil lihat senja. Ditunggu ya, Bro!',
    ],
    signOff: 'Salam hangat & aroma kopi,\nBima',
    damarReflection:
      'Bima selalu begitu—tidak pernah memaksa, tapi selalu menyiapkan satu kursi kosong dan gitar yang sudah disetem untuk kapan pun aku siap kembali bernapas.',
  },
  {
    id: 'mail_rt04_melati',
    senderName: 'Pak Sugeng (Ketua RT 04)',
    senderOrigin: 'Sekretariat RT 04 / RW 02 Melati',
    dateLabel: 'Surat Warga · Pekan Ini',
    subject: 'Info Kerja Bakti & Lampu Taman Gang Melati',
    kind: 'notice',
    stampTitle: 'RT 04 / RW 02',
    stampColor: '#1d4e89',
    paperTint: '#f4f6f8',
    greeting: 'Yth. Bapak/Ibu Keluarga Damar Pratama (Jl. Melati No. 14),',
    paragraphs: [
      'Dengan hormat, kami menginformasikan bahwa hari Minggu pagi pukul 07.30 WIB akan diadakan kerja bakti ringan membersihkan saluran air dan merapikan ranting pohon di sepanjang Gang Perumahan Melati.',
      'Bagi warga yang memiliki tanaman pot di depan pagar atau halaman, kami sangat mengapresiasi upaya Bapak/Ibu menjaga suasana gang kita tetap asri, teduh, dan nyaman dilalui anak-anak bersepeda sore.',
      'Setelah kerja bakti selesai, Ibu-Ibu PKK sudah menyiapkan bubur kacang hijau dan teh hangat di dekat pos gang. Kehadiran Bapak/Ibu sangat kami nantikan.',
    ],
    signOff: 'Hormat kami,\nSugeng Hariyanto · Ketua RT 04',
    damarReflection:
      'Sudah lama sekali aku tidak ikut kerja bakti Minggu pagi bareng bapak-bapak gang karena selalu beralasan capek lembur. Rasanya minggu ini aku benar-benar ingin turun ikut menyapu.',
  },
  {
    id: 'mail_bu_wati_resep',
    senderName: 'Bu Wati',
    senderOrigin: 'Tetangga Jl. Melati No. 16',
    dateLabel: 'Catatan Kecil · Tadi Pagi',
    subject: 'Terima Kasih & Resep Kolak Pisang Sore',
    kind: 'letter',
    stampTitle: 'TETANGGA MELATI',
    stampColor: '#b5536b',
    paperTint: '#fef6f2',
    greeting: 'Mbak Nadia & Mas Damar yang baik,',
    paragraphs: [
      'Terima kasih banyak ya kemarin sudah menyapa dan menanyakan kabar Ibu. Teras rumah Ibu sekarang terasa jauh lebih terang dan tenang setiap kali malam tiba.',
      'Tadi pagi Ibu sempat panen sedikit daun pandan wangi dari kebun belakang, nanti kalau sempat mampir silakan ambil ya. Di bawah ini Ibu tuliskan takaran gula aren dan santan untuk kolak pisang kepok yang kemarin sempat ditanyakan Mbak Nadia: 2 keping gula aren, 2 lembar pandan simpul, sejumput garam, dimasak api kecil sampai wangi.',
      'Salam sayang buat Kira yang selalu semangat menyapa sambil berangkat sekolah ya!',
    ],
    signOff: 'Dari tetangga sebelah,\nBu Wati',
    damarReflection:
      'Hal-hal kecil di perumahan ini—daun pandan, sapaan pagi, dan resep kolak tulisan tangan—diam-diam membuat rumah ini terasa jauh lebih luas daripada sekadar empat dinding.',
  },
];
