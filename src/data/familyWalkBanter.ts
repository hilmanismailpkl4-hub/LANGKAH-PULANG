import { LocationId, TimeOfDay } from '../types/game';

export interface FamilyBanterLine {
  speaker: 'nadia' | 'kira' | 'damar';
  text: string;
}

export interface LocationBanterEntry {
  id: string;
  location: LocationId;
  lines: FamilyBanterLine[];
}

export interface SpotBanterEntry {
  id: string;
  x: number;
  z: number;
  radius: number;
  lines: FamilyBanterLine[];
}

/**
 * Obrolan spontan hangat Nadia & Kira saat berjalan sore bersama Damar di tiap zona kota.
 */
export const LOCATION_FAMILY_BANTERS: LocationBanterEntry[] = [
  {
    id: 'fw_taman_1',
    location: 'taman_danau',
    lines: [
      { speaker: 'kira', text: 'Ayah! Lihat air danaunya gerak-gerak kena angin! Kita bikin perahu kertas di dermaga yuk!' },
      { speaker: 'nadia', text: 'Pelan-pelan jalannya ya, Sayang, jangan lari terlalu dekat tepi air.' },
    ],
  },
  {
    id: 'fw_taman_2',
    location: 'taman_danau',
    lines: [
      { speaker: 'nadia', text: 'Mas, ingat nggak? Dulu sebelum Kira lahir, hampir tiap Minggu sore kita duduk di bangku taman ini.' },
      { speaker: 'damar', text: 'Ingat banget, Nad. Ternyata jauh lebih hangat lagi sekarang kita bertiga di sini.' },
    ],
  },
  {
    id: 'fw_jembatan_1',
    location: 'jembatan_sungai',
    lines: [
      { speaker: 'kira', text: 'Waaah, lampu-lampunya mantul di air sungai kayak bintang jatuh, Yah!' },
      { speaker: 'nadia', text: 'Cantik ya, Nak... Dulu Ayah sama Bunda pernah pasang gembok kecil di pagar jembatan ini lho.' },
    ],
  },
  {
    id: 'fw_kedai_1',
    location: 'kedai_bima',
    lines: [
      { speaker: 'kira', text: 'Mmm, wangi cokelat sama roti panggang dari kedai Om Bima enak banget!' },
      { speaker: 'nadia', text: 'Mas, kalau kamu mau mampir duduk sebentar atau petik gitar di dalam, kami temani kok.' },
    ],
  },
  {
    id: 'fw_stasiun_1',
    location: 'stasiun_tua',
    lines: [
      { speaker: 'kira', text: 'Ayah, nanti kalau keretanya lewat kita dadah-dadah bareng ke masinisnya ya!' },
      { speaker: 'nadia', text: 'Suara stasiun lama selalu bikin hati tenang ya, Mas... kayak semua orang akhirnya pulang.' },
    ],
  },
  {
    id: 'fw_musik_1',
    location: 'toko_musik',
    lines: [
      { speaker: 'kira', text: 'Gitar di kaca toko Om Bagas keren banget! Nanti malam Ayah ajarin Kira main satu lagu lagi ya!' },
      { speaker: 'nadia', text: 'Tuh dengar, Mas. Penggemar nomor satumu udah pesan konser di ruang tamu.' },
    ],
  },
  {
    id: 'fw_minimarket_1',
    location: 'minimarket',
    lines: [
      { speaker: 'kira', text: 'Yah... itu Kios Harmoni kan? Di dalamnya ada es krim stroberi sama cat air biru lho...' },
      { speaker: 'nadia', text: 'Haha, kode keras banget sih anak Bunda yang satu ini.' },
    ],
  },
  {
    id: 'fw_perkantoran_1',
    location: 'perkantoran',
    lines: [
      { speaker: 'kira', text: 'Gedung kantor Ayah tinggi banget sampai lehernya Kira pegal lihat ke atas!' },
      { speaker: 'nadia', text: 'Terima kasih ya Mas udah kerja keras buat kami... tapi sekarang waktunya santai dulu, oke?' },
    ],
  },
  {
    id: 'fw_rooftop_1',
    location: 'rooftop',
    lines: [
      { speaker: 'kira', text: 'WHOAAA!! Semua mobil di bawah kelihatan kecil kayak mainan, Ayah!!' },
      { speaker: 'nadia', text: 'Pemandangannya indah banget, Mas... Tapi tetap aja, lampu rumah kita di selatan paling bikin rindu.' },
    ],
  },
  {
    id: 'fw_perumahan_1',
    location: 'perumahan',
    lines: [
      { speaker: 'nadia', text: 'Enak ya jalan santai di gang sendiri begini, nggak perlu buru-buru lihat jam.' },
      { speaker: 'kira', text: 'Iya! Sambil cari kucing oranye "Sore" buat dikasih makan!' },
    ],
  },
  {
    id: 'fw_rumah_1',
    location: 'rumah_damar',
    lines: [
      { speaker: 'nadia', text: 'Rumah Jl. Melati nomor empat belas... selalu terasa paling nyaman kalau pulangnya barengan begini.' },
    ],
  },
];

/**
 * Obrolan khusus saat melewati sudut spesial kota (Angkringan Pak Slamet, Kucing Sore).
 */
export const SPOT_FAMILY_BANTERS: SpotBanterEntry[] = [
  {
    id: 'fw_spot_angkringan',
    x: -14.5,
    z: 40.0,
    radius: 8.5,
    lines: [
      { speaker: 'nadia', text: 'Wah, angkringan Pak Slamet sudah buka! Wangi wedang jahenya sampai sini, Mas.' },
      { speaker: 'kira', text: 'Kira mau sate telur puyuh sama teh hangat, Yah!' },
    ],
  },
  {
    id: 'fw_spot_cat',
    x: 9.5,
    z: 56.5,
    radius: 7.5,
    lines: [
      { speaker: 'kira', text: 'Ayah! Bunda! Itu kucing oranye "Sore"! Ayo kita elus sama kasih camilan!' },
    ],
  },
  {
    id: 'fw_spot_martabak_lampion',
    x: -38.0,
    z: 22.5,
    radius: 10.5,
    lines: [
      { speaker: 'kira', text: 'Waaah!! Lampu lampion tepi sungainya cantik banget, Yah! Eh, bau martabak cokelat keju juga wangi banget!' },
      { speaker: 'nadia', text: 'Gerobak martabak sama kacang rebus Bang Udin sudah ngebul tuh, Mas. Kita mampir jajan sambil duduk di tepi sungai yuk?' },
    ],
  },
  {
    id: 'fw_spot_coconut_stall',
    x: -83.5,
    z: -9.8,
    radius: 9.0,
    lines: [
      { speaker: 'nadia', text: 'Eh, ada lapak es kelapa muda Pak Hasan di tepi danau! Duduk di bawah payungnya kelihatan adem banget, Mas.' },
      { speaker: 'kira', text: 'Kira mau es kelapa pakai sedotan panjang dong, Ayah!!' },
    ],
  },
  {
    id: 'fw_spot_bakso_cart',
    x: -26.8,
    z: 47.8,
    radius: 9.0,
    lines: [
      { speaker: 'kira', text: 'TING-TING-TING!! Ayah dengar nggak?! Ada gerobak bakso Mas Agung di dekat rumah kita!' },
      { speaker: 'nadia', text: 'Wah, pas banget nih, Mas! Kuah bakso hangat sore-sore begini pasti enak banget.' },
    ],
  },
  {
    id: 'fw_spot_sate_cart',
    x: 13.4,
    z: 29.5,
    radius: 9.5,
    lines: [
      { speaker: 'nadia', text: 'Mmm, wangi asap sate ayam Madura Cak Mat sampai ke seberang jalan, Mas!' },
      { speaker: 'kira', text: 'Ayah, Kira mau sate ayam pakai kecap manis sama lontong dong!' },
    ],
  },
  {
    id: 'fw_spot_dawet_cart',
    x: 42.8,
    z: -13.6,
    radius: 9.0,
    lines: [
      { speaker: 'nadia', text: 'Eh, ada gerobak Es Dawet Ayu Pak Darmo di depan Menara Nusantara! Segar banget kayaknya, Mas.' },
      { speaker: 'kira', text: 'Kira mau es cendol hijau yang ada gulanya manis-manis itu, Yah!' },
    ],
  },
];

/**
 * Obrolan spontan sesuai cuaca / waktu saat berjalan bersama.
 */
export const WEATHER_FAMILY_BANTERS: Partial<Record<TimeOfDay, FamilyBanterLine[][]>> = {
  rain_dusk: [
    [
      { speaker: 'kira', text: 'Asyik! Payung bening Kira bisa lihat titik-titik hujan jatuh dari atas!' },
      { speaker: 'nadia', text: 'Hati-hati ya Sayang, jangan injak genangan terlalu dalam nanti sepatumu basah.' },
    ],
    [
      { speaker: 'nadia', text: 'Aroma aspal basah sore-sore gini selalu mengingatkan aku waktu kita pertama pindah ke kota ini, Mas.' },
    ],
  ],
  night: [
    [
      { speaker: 'kira', text: 'Lampu-lampu jalannya hangat banget ya, Yah... Kira udah agak ngantuk tapi masih mau jalan sebentar lagi.' },
      { speaker: 'damar', text: 'Kalau capek bilang Ayah ya, Nak. Nanti Ayah gendong sampai rumah.' },
    ],
  ],
};

/**
 * Obrolan hangat acak saat pemain menekan tombol [T] Ajak Ngobrol Santai.
 */
export const CASUAL_FAMILY_BANTERS: FamilyBanterLine[][] = [
  [
    { speaker: 'kira', text: 'Ayah, besok hari Minggu kita belajar naik sepeda lagi di taman ya!' },
    { speaker: 'damar', text: 'Janji, Nak. Besok Ayah matikan notifikasi kerja seharian penuh buat Kira sama Bunda.' },
  ],
  [
    { speaker: 'nadia', text: 'Mas, pulang nanti mau dimasakin sop hangat atau kita jajan wedang jahe Pak Slamet aja?' },
    { speaker: 'kira', text: 'Dua-duanya boleh nggak, Bunda? Hehe!' },
  ],
  [
    { speaker: 'nadia', text: 'Kamu tahu nggak, Mas? Hari ini langkahmu kelihatan jauh lebih ringan daripada minggu lalu.' },
    { speaker: 'damar', text: 'Soalnya sekarang aku tahu arah pulangnya ke mana, Nad.' },
  ],
  [
    { speaker: 'kira', text: 'Ayah, coba lihat deh, kalau kita jalan pelan-pelan begini bayangan kita jadi panjang banget!' },
    { speaker: 'nadia', text: 'Biar nggak cepat hilang, foto bareng dulu yuk nanti pakai kamera Ayah!' },
  ],
  [
    { speaker: 'kira', text: 'Tadi di sekolah, teman-teman Kira bilang gambar keluarga Kira paling bagus karena semuanya senyum!' },
    { speaker: 'damar', text: 'Ayah bangga banget sama kamu, Sayang.' },
  ],
  [
    { speaker: 'nadia', text: 'Kalau lelah berhenti dulu di bangku taman nggak apa-apa ya, Mas. Nggak ada yang mengejar kita sore ini.' },
  ],
];

/**
 * Reaksi spontan Nadia & Kira untuk momen spesial & aktivitas bersama.
 */
export const EVENT_FAMILY_BANTERS: Record<string, FamilyBanterLine[]> = {
  walk_start_home: [
    { speaker: 'kira', text: 'YEAAAY!! Jalan-jalan bareng Ayah sama Bunda! Kira udah siap dari tadi!' },
    { speaker: 'nadia', text: 'Ayo Mas, kamu yang pimpin jalannya ya. Kami ikut di sampingmu.' },
  ],
  walk_start_away: [
    { speaker: 'nadia', text: 'Akhirnya ketemu juga! Tadi Kira semangat banget minta menyusul Ayah jalan sore.' },
    { speaker: 'kira', text: 'Ayo Ayah, tunjukin tempat paling seru di kota ini!' },
  ],
  walk_end: [
    { speaker: 'nadia', text: 'Terima kasih ya Mas buat waktu jalan barengnya... kami duluan istirahat di rumah ya.' },
    { speaker: 'kira', text: 'Dadah Ayah! Nanti cepat pulang ke rumah lagi ya!' },
  ],
  activity_cat: [
    { speaker: 'kira', text: 'Lucu bangettt! Kucing Sore langsung mendekat sambil bunyi purr-purr, Yah!' },
    { speaker: 'nadia', text: 'Sepertinya Sore sudah hafal banget sama keluarga kita ya.' },
  ],
  activity_boat: [
    { speaker: 'kira', text: 'Berlayar yang jauh ya, perahu kertas Ayah sama Kira!! Jangan tenggelam!' },
    { speaker: 'nadia', text: 'Lihat senyumnya, Mas... hal sesederhana ini sudah cukup bikin harinya sempurna.' },
  ],
  activity_guitar: [
    { speaker: 'kira', text: 'Prok prok prok!! Lagu Ayah bagus banget!! Main lagi dong nanti di rumah!' },
    { speaker: 'nadia', text: 'Suara gitar kamu tetap yang paling menenangkan, Mas.' },
  ],
  activity_coffee: [
    { speaker: 'nadia', text: 'Nikmati kopinya pelan-pelan ya, Mas. Aku dan Kira duduk santai menemani di sini.' },
  ],
  activity_bench: [
    { speaker: 'nadia', text: 'Anginnya sejuk banget ya duduk bertiga begini... rasanya waktu boleh berhenti sebentar.' },
  ],
  activity_photo: [
    { speaker: 'kira', text: 'Ciisss!! Lihat deh Yah, foto keluarga kita pasti bagus banget di galeri HP!' },
  ],
  interior_music_cassette: [
    { speaker: 'kira', text: 'Wah, suara kasetnya bunyi "klik" kayak di film lama, Yah! Lagunya enak banget!' },
    { speaker: 'nadia', text: 'Dulu kamu sampai rela nabung uang makan demi beli kaset-kaset di rak ini kan, Mas?' },
  ],
  interior_kios_fridge: [
    { speaker: 'kira', text: 'Dingin banget udaranya!! Kira mau susu stroberi yang botol merah muda ya, Ayah!' },
    { speaker: 'nadia', text: 'Satu saja ya Sayang, biar nanti malam nggak batuk.' },
  ],
  interior_kira_desk: [
    { speaker: 'kira', text: 'Ayah lihat boneka beruang Kira! Tadi pagi Kira juga gambar Ayah sama Bunda di buku baru!' },
    { speaker: 'nadia', text: 'Tiap malam sebelum tidur dia selalu merapikan krayonnya sendiri lho, Mas.' },
  ],
  activity_swing: [
    { speaker: 'kira', text: 'WIIIHH!! Dorong lebih tinggi lagi, Ayaaah!! Seru bangeeet!!' },
    { speaker: 'nadia', text: 'Pegangan rantai yang erat ya Sayang! Haha, lihat mukanya senang banget, Mas!' },
  ],
  activity_koi: [
    { speaker: 'kira', text: 'Waaah!! Ikan koi warna oranye sama kuningnya langsung datang rebutan makan, Yah!!' },
    { speaker: 'nadia', text: 'Air danaunya jernih banget hari ini, ikannya kelihatan jelas semua ya.' },
  ],
  activity_kite: [
    { speaker: 'kira', text: 'TINGGI BANGET, AYAH!! Layangannya hampir menyentuh awan senja!! Tarik lagi benangnya!' },
    { speaker: 'nadia', text: 'Keren banget, Mas! Dulu kamu jago main layangan waktu kecil ya?' },
  ],
  activity_bus_stop: [
    { speaker: 'nadia', text: 'Duduk berteduh di halte sambil lihat lampu mobil lewat itu ada tenangnya sendiri ya, Mas.' },
    { speaker: 'kira', text: 'Kira hitung ada berapa mobil warna merah yang lewat depan halte kita!' },
  ],
  activity_pigeons: [
    { speaker: 'kira', text: 'WAAAH!! Burung merpatinya datang semua makan remah roti dari Ayah!! Gemes bangettt!' },
    { speaker: 'nadia', text: 'Pelan-pelan geraknya ya Sayang, biar burungnya nggak kaget terbang lagi.' },
  ],
  after_rain_rainbow: [
    { speaker: 'kira', text: 'AYAAAH!! BUNDAAA!! Lihat ke langit barat di atas danau ada PELANGI!!' },
    { speaker: 'nadia', text: 'Cantik banget ya, Mas... sehabis hujan reda, langit kota ini selalu terasa baru lagi.' },
  ],
  activity_picnic: [
    { speaker: 'kira', text: 'YEAAAY piknik di rumput taman!! Kira mau semangka dingin sama teh hangatnya Bunda!' },
    { speaker: 'nadia', text: 'Nyaman banget ya duduk di tikar begini, Mas... rasanya nggak pengin cepat-cepat pulang.' },
  ],
  activity_fountain: [
    { speaker: 'kira', text: 'Kira udah lempar koin harapan ke air mancur! Kira doain Ayah sehat terus sama sering jalan bareng Kira!' },
    { speaker: 'nadia', text: 'Aamiin, Sayang... dengar suara percikan air mancur di sore hari bikin adem banget.' },
  ],
  activity_busker: [
    { speaker: 'kira', text: 'Waaah petikan gitar Om Seno di tepi sungai enak banget, Yah! Mirip lagu yang Ayah mainin di rumah!' },
    { speaker: 'nadia', text: 'Sore di tepi sungai sambil dengar gitar akustik begini bikin langkah terasa ringan banget ya, Mas.' },
  ],
  activity_office_lounge: [
    { speaker: 'kira', text: 'Dari kursi jendela kantor Ayah kelihatan semua angkot sama halte bus di seberang jalan!' },
    { speaker: 'nadia', text: 'Istirahat sebentar di sini enak ya, Mas... menarik napas dulu sebelum melangkah lagi.' },
  ],
  activity_water_garden: [
    { speaker: 'nadia', text: 'Wah, terima kasih banyak ya Mas sudah bantu menyiram pot melati sama mawar di teras! Langsung kelihatan segar banget daunnya.' },
    { speaker: 'kira', text: 'Bunga matahari kecil punya Kira juga ikut mekar tuh, Ayah!! Wangi tanah basahnya enak banget!' },
  ],
  activity_home_mailbox: [
    { speaker: 'nadia', text: 'Ada kartu pos dari Ibu di Bandung ya, Mas? Nanti malam kita telepon Ibu bareng Kira yuk.' },
    { speaker: 'kira', text: 'Horeee!! Nenek kirim jaket kuning buat Kira!!' },
  ],
  activity_bridge_locks: [
    { speaker: 'nadia', text: 'Gembok-gembok kecil di pagar jembatan ini makin banyak ya, Mas... tapi gembok tembaga kita dari 2019 tetap paling manis.' },
    { speaker: 'kira', text: 'Waaah lampu-lampu kecil di pagar jembatannya kayak kunang-kunang baris rapi di atas sungai, Yah!' },
  ],
  activity_river_angler: [
    { speaker: 'kira', text: 'Sssst!! Pelan-pelan jalannya, Bunda, nanti ikan yang mau dipancing Pak Karno kabur!' },
    { speaker: 'nadia', text: 'Tenang banget ya lihat warga duduk santai memancing di pinggir sungai begini.' },
  ],
  activity_vinyl_turntable: [
    { speaker: 'kira', text: 'Waaah piringan hitamnya muter-muter terus jarumnya gerak sendiri, Ayah!! Keren bangeeet!' },
    { speaker: 'nadia', text: 'Suara piringan hitam di Toko Nada Lama memang beda ya, Mas... hangat dan bikin betah lama-lama.' },
  ],
  activity_kios_vending: [
    { speaker: 'kira', text: 'KLUNG!! Minuman dinginnya jatuh dari mesin bercahaya! Kira suka banget lampu biru Kios Harmoni malam-malam!' },
    { speaker: 'nadia', text: 'Segar ya, Mas, mampir sebentar beli minuman dingin di pinggir jalan sambil lihat bus kota lewat.' },
  ],
  activity_cafe_cat: [
    { speaker: 'kira', text: 'Sssst... lucu bangettt kucing "Moka" bobo melingkar di kursi Om Bima! Bulunya lembut banget, Yah!' },
    { speaker: 'nadia', text: 'Nyenyak banget tidurnya, kayaknya Moka ikut menikmati wangi kopi sama musik pelan di kedai ini.' },
  ],
  activity_corner_warung: [
    { speaker: 'nadia', text: 'Warung Bu Rina ini penolong banget lho Mas kalau mendadak kehabisan gula atau kecap malam-malam.' },
    { speaker: 'kira', text: 'Lihat Yah, kerupuk putih di toples besarnya kelihatan renyah banget!' },
  ],
  activity_badminton: [
    { speaker: 'kira', text: 'PLOK! PLOK!! Keren banget koknya terbang tinggi banget lewat net, Ayah!! Besok ajarin Kira main ya!' },
    { speaker: 'nadia', text: 'Wah, seru banget! Lama nggak lihat kamu main bulu tangkis di lapangan gang kayak dulu, Mas!' },
  ],
  activity_park_stretch: [
    { speaker: 'nadia', text: 'Tarik napas pelan-pelan, Mas... enak banget peregangan bareng warga di rumput taman begini.' },
    { speaker: 'kira', text: 'Kira bisa angkat tangan paling tinggi nih, lihat deh Ayah!!' },
  ],
  activity_toy_train: [
    { speaker: 'kira', text: 'TUT-TUUUT!! Kereta kayu Kira jalan lagi!! Ayah lihat, keretanya lewat jembatan kecil tuh!!' },
    { speaker: 'nadia', text: 'Dari minggu lalu dia terus cerita pengin main kereta kayu itu bareng Ayah di karpet.' },
  ],
  activity_close_laptop: [
    { speaker: 'nadia', text: 'Akhirnya laptop kantornya ditutup juga ya, Mas... sekarang waktunya benar-benar istirahat di rumah.' },
    { speaker: 'kira', text: 'Horeee!! Ayah nggak kerja lagi malam ini! Ayo main sama Kira!' },
  ],
  activity_kentongan: [
    { speaker: 'kira', text: 'TOK-TOK-TOK!! Suara kentongan bambunya nyaring banget, Ayah!! Kayak di cerita ronda malam!' },
    { speaker: 'nadia', text: 'Haha, pelan-pelan ya Mas, nanti bapak-bapak RT 04 mengira sudah waktunya ronda malam nih.' },
  ],
  activity_pos_kamling: [
    { speaker: 'nadia', text: 'Adem ya duduk sebentar di Pos Kamling sambil lihat papan catur sama termos kopi begini.' },
    { speaker: 'kira', text: 'Ayah, nanti ajarin Kira main catur pakai kuda-kudaan kecil itu ya!' },
  ],
  activity_kota_senja_monument: [
    { speaker: 'nadia', text: '"Kota Senja — Ruang untuk Pulang"... bagus banget ya kalimat di tugu taman bundar ini, Mas.' },
    { speaker: 'kira', text: 'Bunga-bunga di sekeliling tugunya warna-warni banget! Nanti kita foto di sini ya, Yah!' },
  ],
  activity_rooftop_telescope: [
    { speaker: 'kira', text: 'AYAAAH!! Gantian dong Kira mau intip lewat teropongnya!! Kelihatan rumah kita nggak di bawah?!' },
    { speaker: 'nadia', text: 'Lucu ya Mas, dari atas sini rumah kita kelihatan kecil banget, tapi tetap paling terang di hati.' },
  ],
  activity_rt_board: [
    { speaker: 'nadia', text: 'Eh, lihat tuh Mas di papan pengumuman RT, nama kamu masuk jadwal ronda malam Sabtu lho!' },
    { speaker: 'kira', text: 'Hihi, ada tulisan tentang kucing oranye "Sore" juga di papan pengumuman, Bunda!' },
  ],
  activity_melati_projector: [
    { speaker: 'kira', text: 'WAAAH!! Layar tancap di kompleks kita nyala, Ayah!! Kayak bioskop di bawah bintang!' },
    { speaker: 'nadia', text: 'Lucu ya Mas, duduk di tikar bareng tetangga sambil nonton proyektor begini rasanya hangat banget.' },
  ],
  activity_cafe_bikes: [
    { speaker: 'nadia', text: 'Keren ya sekarang Kedai Bima makin ramai sampai ada rak sepeda khusus sama motor antar kopi segala.' },
    { speaker: 'kira', text: 'Kring-kring!! Nanti kalau Kira udah gede, Kira mau gowes sepeda sendiri ke kedai Om Bima ah!' },
  ],
  activity_wind_chime: [
    { speaker: 'nadia', text: 'Suara lonceng bambu di teras itu selalu jadi tanda favoritku kalau angin sore mulai bertiup, Mas.' },
    { speaker: 'kira', text: 'Klotak-klotak merdu banget, Yah!! Kayak musik kayu waktu liburan di desa nenek!' },
  ],
  activity_river_artist: [
    { speaker: 'kira', text: 'WAAAH!! Lukisan Jembatan Lampion punya Om Dimas mirip banget sama aslinya, Ayah!! Kira mau belajar melukis juga!' },
    { speaker: 'nadia', text: 'Indah banget ya warna langit senjanya di kanvas... bikin kita ingat betapa cantiknya kota ini kalau mau berhenti sebentar.' },
  ],
  activity_station_gate: [
    { speaker: 'kira', text: 'BIP-BIP!! Pintunya langsung kebuka sendiri warna hijau, Ayah!! Keren bangettt!' },
    { speaker: 'nadia', text: 'Ingat nggak Mas, dulu tiap sore kamu pasti lewat gerbang tap stasiun ini sambil buru-buru mengejar kereta?' },
  ],
  activity_pak_ujang: [
    { speaker: 'nadia', text: 'Pak Ujang telaten banget ya Mas menjahit sepatu dengan tangan... awet banget hasil jahitannya.' },
    { speaker: 'kira', text: 'Sepatu kerja Ayah jadi kinclong lagi kayak baru!! Makasih, Kakek Ujang!' },
  ],
  activity_pingpong: [
    { speaker: 'kira', text: 'TIK-TOK! TIK-TOK!! Bolanya cepet banget memantul di meja biru, Ayah!! Kira mau pegang bet merahnya!' },
    { speaker: 'nadia', text: 'Wah, seru banget! Meja ping-pong RT 04 ini bikin sore di kompleks kita makin ramai ya, Mas.' },
  ],
  activity_atm_booth: [
    { speaker: 'nadia', text: 'Ambil uang tunai secukupnya aja ya Mas buat jajan kaki lima nanti malam.' },
    { speaker: 'kira', text: 'Bip-bip... bunyi mesin uangnya lucu banget, Yah! Nanti beli es krim juga ya!' },
  ],
  activity_station_opang: [
    { speaker: 'nadia', text: 'Abang-abang ojek di depan stasiun ini ramah banget ya, Mas... dari dulu selalu hafal alamat Jl. Melati.' },
    { speaker: 'kira', text: 'Halo Om Hendra!! Motornya helmnya ada dua biar penumpang nggak kehujanan ya!' },
  ],
  activity_park_balloon: [
    { speaker: 'kira', text: 'WAAAH!! BALONNYA TERBANG NGIKUTIN KIRA, AYAH!! Makasih banyak, Kira pegang talinya erat-erat!' },
    { speaker: 'nadia', text: 'Lucu banget lihatnya, Mas... senyum Kira langsung selebar langit sore!' },
  ],
  activity_retro_payphone: [
    { speaker: 'nadia', text: 'Ya ampun, boks telepon umum sama bis surat oranye ini masih awet ya, Mas! Ingat dulu kamu nelepon aku pakai koin gopean?' },
    { speaker: 'kira', text: 'Teleponnya ada kabel keritingnya, Bunda!! Terus suratnya dimasukin ke kotak oranye besar itu?' },
  ],
  activity_garden_swing: [
    { speaker: 'nadia', text: 'Adem banget ya Mas berayun pelan di kursi kayu ini sambil memandang Danau Senja...' },
    { speaker: 'kira', text: 'Ayun pelan-pelan ya Ayah! Enak banget anginnya, kayak lagi liburan!' },
  ],
  activity_melati_chess: [
    { speaker: 'kira', text: 'Waaah!! Kuda putihnya Ayah melompat "tok!" di papan kotak-kotak!! Pak Yanto sampai ketawa!' },
    { speaker: 'nadia', text: 'Akrab banget ya Mas tetangga RT 04 kita, sore-sore santai main catur sambil ngopi di dekat Pos Ronda.' },
  ],
  activity_krl_led_board: [
    { speaker: 'kira', text: 'Lihat deh Bunda, papan lampunya bisa ngasih tahu berapa meter lagi keretanya datang!! Keren banget!' },
    { speaker: 'nadia', text: 'Sekarang Stasiun Senja makin rapi dan informatif ya, Mas... nggak perlu bingung lagi menunggu kereta.' },
  ],
  activity_lotus_pond: [
    { speaker: 'kira', text: 'WAAAH!! Bunga teratai warna pink-nya mekar besar banget di atas air, Bunda!! Tadi ada kodok kecil loncat!' },
    { speaker: 'nadia', text: 'Cantik banget sudut danau yang ini ya, Mas... daun teratainya mengapung tenang bikin hati ikut adem.' },
  ],
  activity_plaza_weather_totem: [
    { speaker: 'kira', text: 'Kincir angin kecil di atas papan kantor Ayah muter-muter terus!! Suhu kotanya kelihatan besar banget!' },
    { speaker: 'nadia', text: 'Kualitas udaranya masih baik dan segar ya hari ini, Mas. Pas banget buat jalan sore tanpa buru-buru.' },
  ],
  activity_melati_birdcage: [
    { speaker: 'kira', text: 'Cuit-cuit!! Burung kuning kecilnya nyanyi merdu banget di sangkar bambu, Ayah!! Dia loncat-loncat!' },
    { speaker: 'nadia', text: 'Suara burung kicau dari teras tetangga itu bikin pagi di Jl. Melati terasa damai sekali ya, Mas.' },
  ],
  activity_nada_poster_bench: [
    { speaker: 'nadia', text: 'Lihat deh Mas, poster konser akustik tahun sembilan puluhan itu masih tertempel rapi di samping Toko Musik Nada Lama!' },
    { speaker: 'kira', text: 'Wah, bangkunya adem banget di bawah pohon! Nanti kalau Ayah manggung lagi, poster Ayah ditempel di sini ya!' },
  ],
  activity_drinking_fountain: [
    { speaker: 'kira', text: 'Waaah airnya melengkung jernih kayak air mancur mini, Ayah!! Segar banget habis jalan kaki di taman!' },
    { speaker: 'nadia', text: 'Enak banget ya Mas taman kota sekarang punya keran air siap minum yang bersih dan terawat begini.' },
  ],
  activity_river_stone_bench: [
    { speaker: 'nadia', text: 'Duduk di bangku batu tepi sungai ini adem banget ya, Mas... suara airnya bikin pikiran langsung tenang.' },
    { speaker: 'kira', text: 'Ayah, lihat pantulan Menara Nusantara sama lampion di sungai dari sini!! Keren bangeeet!' },
  ],
  activity_park_wayfinder: [
    { speaker: 'kira', text: 'Ayah! Panah kayunya nunjuk ke Danau Senja, Toko Musik, sama Gerobak Jasuke!! Kira bisa jadi pemandu jalan!' },
    { speaker: 'nadia', text: 'Rapi banget ya penunjuk arah sama lampu-lampu tamannya, Mas... sore di jalur pejalan kaki ini terasa makin hangat.' },
  ],
};
