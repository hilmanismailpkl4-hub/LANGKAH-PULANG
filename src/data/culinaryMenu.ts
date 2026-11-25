import { FamilyBanterLine } from './familyWalkBanter';

export type CulinarySpotId = 'angkringan' | 'cafe' | 'kios' | 'martabak' | 'roti' | 'office_pantry' | 'coconut';
export type HeldDrinkVisual =
  | 'wedang'
  | 'coffee'
  | 'tea'
  | 'icecream'
  | 'cocoa'
  | 'martabak'
  | 'peanuts'
  | 'soup'
  | 'roti'
  | 'coconut';

export interface CulinaryMenuItem {
  id: string;
  spot: CulinarySpotId;
  name: string;
  priceLabel: string;
  tagline: string;
  tasteNote: string;
  drinkVisual: HeldDrinkVisual;
  isHot: boolean;
  isFamilyTreat?: boolean;
  journalTitle?: string;
  journalBody?: string;
  familyReaction: FamilyBanterLine[];
}

export interface CulinarySpotInfo {
  id: CulinarySpotId;
  title: string;
  hostName: string;
  subtitle: string;
  seatPos: [number, number, number];
  lookAt: [number, number, number];
  standPos: [number, number, number];
  seatYaw: number;
  tablePropPos: [number, number, number];
}

export const CULINARY_SPOTS: Record<CulinarySpotId, CulinarySpotInfo> = {
  angkringan: {
    id: 'angkringan',
    title: 'Angkringan Pak Slamet',
    hostName: 'Pak Slamet',
    subtitle: 'Sudut Jl. Melati · Wedang Jahe & Sego Kucing',
    seatPos: [-15.2, 0.12, 38.35],
    lookAt: [-15.2, 1.35, 39.8],
    standPos: [-13.4, 0, 38.45],
    seatYaw: 0,
    tablePropPos: [-15.2, 1.4, 39.55],
  },
  cafe: {
    id: 'cafe',
    title: 'Kedai Kopi Sudut',
    hostName: 'Bima',
    subtitle: 'Meja Kayu Teras · Racikan Manual & Roti Panggang',
    seatPos: [-25.0, 0.16, 18.45],
    lookAt: [-20.0, 1.4, 21.0],
    standPos: [-24.0, 0.08, 18.5],
    seatYaw: Math.PI,
    tablePropPos: [-25.0, 0.85, 17.55],
  },
  kios: {
    id: 'kios',
    title: 'Teras Kios 24 Jam Harmoni',
    hostName: 'Mbak Lilis',
    subtitle: 'Meja Bundar Teras · Minuman Hangat & Camilan',
    seatPos: [20.5, 0.12, 15.15],
    lookAt: [20.5, 1.1, 13.6],
    standPos: [21.6, 0, 15.0],
    seatYaw: Math.PI,
    tablePropPos: [20.5, 0.78, 14.2],
  },
  martabak: {
    id: 'martabak',
    title: 'Martabak Manis & Kacang Rebus Bang Udin',
    hostName: 'Bang Udin',
    subtitle: 'Promenade Lampion Tepi Sungai · Jajanan Sore & Malam',
    seatPos: [-38.2, 0.14, 20.5],
    lookAt: [-48.0, 2.0, 20.5],
    standPos: [-36.6, 0, 20.5],
    seatYaw: -Math.PI / 2,
    tablePropPos: [-38.92, 0.56, 20.5],
  },
  roti: {
    id: 'roti',
    title: 'Gerobak Roti Hangat Pak Joko',
    hostName: 'Pak Joko',
    subtitle: 'Gang Perumahan Melati · Roti Panggang Pagi & Sore',
    seatPos: [1.1, 0.12, 53.5],
    lookAt: [2.8, 1.35, 53.2],
    standPos: [0.8, 0, 52.3],
    seatYaw: Math.PI / 2,
    tablePropPos: [2.3, 1.12, 53.2],
  },
  office_pantry: {
    id: 'office_pantry',
    title: 'Pantry Lobi Menara Nusantara',
    hostName: 'Pantry Karyawan',
    subtitle: 'Sudut Kopi & Teh Lobi · Duduk Menghadap Jl. Kenangan',
    seatPos: [31.2, 0.16, -20.2],
    lookAt: [31.2, 1.4, -4.0],
    standPos: [31.2, 0.08, -21.2],
    seatYaw: 0,
    tablePropPos: [32.82, 0.62, -20.18],
  },
  coconut: {
    id: 'coconut',
    title: 'Lapak Es Kelapa Muda Pak Hasan',
    hostName: 'Pak Hasan',
    subtitle: 'Tepi Taman Danau Senja · Kelapa Muda Segar & Pisang Goreng',
    seatPos: [-81.6, 0.14, -8.55],
    lookAt: [-84.0, 1.35, -24.0],
    standPos: [-81.6, 0, -7.55],
    seatYaw: Math.PI,
    tablePropPos: [-81.6, 0.78, -9.6],
  },
};

export const CULINARY_MENU_ITEMS: CulinaryMenuItem[] = [
  // === 1. ANGKRINGAN PAK SLAMET ===
  {
    id: 'ang_wedang',
    spot: 'angkringan',
    name: 'Wedang Jahe Merah Bakar',
    priceLabel: 'Rp 6.000',
    tagline: 'Jahe merah geprek bakar, gula aren asli, dan serai wangi.',
    tasteNote: 'Hangatnya langsung turun ke dada—rasa lelah seharian di kantor pelan-pelan mencair bersama uap jahe.',
    drinkVisual: 'wedang',
    isHot: true,
    familyReaction: [
      { speaker: 'nadia', text: 'Wangi jahe bakarnya Pak Slamet nggak pernah berubah ya, Mas. Hangat banget.' },
    ],
  },
  {
    id: 'ang_sego',
    spot: 'angkringan',
    name: 'Sego Kucing Teri & Sate Telur Puyuh',
    priceLabel: 'Rp 10.000',
    tagline: 'Nasi daun pisang orek tempe teri plus dua tusuk sate puyuh bacem.',
    tasteNote: 'Sederhana, gurih manis bacemnya pas, dan anehnya jauh lebih nikmat daripada makan malam mahal di restoran gedung.',
    drinkVisual: 'tea',
    isHot: true,
    familyReaction: [
      { speaker: 'kira', text: 'Sate telur puyuhnya enak banget, Yah! Manis-manis gurih kayak masakan Bunda!' },
    ],
  },
  {
    id: 'ang_family',
    spot: 'angkringan',
    name: 'Traktir Keluarga di Angkringan (Paket Bertiga)',
    priceLabel: 'Rp 24.000',
    tagline: 'Wedang jahe untuk Damar & Nadia, teh manis hangat & sate puyuh buat Kira.',
    tasteNote: 'Duduk berdempetan di bangku kayu panjang di bawah bohlam kuning Pak Slamet—tawa Kira bikin malam terasa begitu utuh.',
    drinkVisual: 'wedang',
    isHot: true,
    isFamilyTreat: true,
    journalTitle: 'Malam Hangat di Angkringan Pak Slamet',
    journalBody: 'Aku mentraktir Nadia dan Kira duduk santai di bangku kayu Angkringan Pak Slamet. Sambil menyeruput wedang jahe dan sate telur puyuh, kami bertiga tertawa lepas di bawah bohlam kuning gerobak.',
    familyReaction: [
      { speaker: 'kira', text: 'Asyik!! Kira boleh tambah satu tusuk sate puyuh lagi kan, Pak Slamet?' },
      { speaker: 'nadia', text: 'Makasih ya Mas sudah traktir kami jajan di sini... rasanya kayak balik pacaran dulu, cuma sekarang ada Kira.' },
    ],
  },

  // === 2. KEDAI KOPI SUDUT BIMA ===
  {
    id: 'cafe_kopi',
    spot: 'cafe',
    name: 'Kopi Gula Aren Manual Brew',
    priceLabel: 'Rp 18.000',
    tagline: 'Biji kopi nusantara seduh manual dengan sirup aren buatan Bima.',
    tasteNote: 'Pahitnya lembut, manis arennya hangat—persis sepuluh menit jeda tenang tanpa menatap jam tangan.',
    drinkVisual: 'coffee',
    isHot: true,
    familyReaction: [
      { speaker: 'nadia', text: 'Racikan Bima memang selalu cocok buat kamu ya, Mas. Pelan-pelan saja minumnya.' },
    ],
  },
  {
    id: 'cafe_roti',
    spot: 'cafe',
    name: 'Cokelat Hangat & Roti Kayu Manis',
    priceLabel: 'Rp 22.000',
    tagline: 'Susu cokelat pekat berbusa halus dengan roti panggang mentega.',
    tasteNote: 'Aroma kayu manis dan cokelat hangat memenuhi meja kayu—membuat ruang kafe terasa seperti rumah kedua.',
    drinkVisual: 'cocoa',
    isHot: true,
    familyReaction: [
      { speaker: 'kira', text: 'Waaah, kumis busa cokelatnya nempel di bibir Kira, Ayah! Hihihi!' },
    ],
  },
  {
    id: 'cafe_family',
    spot: 'cafe',
    name: 'Traktir Nongkrong Keluarga di Kedai Bima',
    priceLabel: 'Rp 48.000',
    tagline: 'Kopi aren untuk Damar, teh chamomile untuk Nadia, & cokelat hangat Kira.',
    tasteNote: 'Bima tersenyum lebar dari balik mesin espresso melihat akhirnya kursi kayu di terasnya penuh oleh keluarga kecil Damar.',
    drinkVisual: 'coffee',
    isHot: true,
    isFamilyTreat: true,
    journalTitle: 'Nongkrong Sore Bertiga di Kedai Bima',
    journalBody: 'Untuk pertama kalinya kami bertiga duduk santai menikmati kopi aren, teh hangat, dan cokelat berbusa di Kedai Kopi Sudut. Bima bilang ini pemandangan terbaik di kedainya sepanjang tahun.',
    familyReaction: [
      { speaker: 'kira', text: 'Cokelat buatan Om Bima paling enak sedunia!! Ayah cobain deh!' },
      { speaker: 'nadia', text: 'Sore yang tenang banget, Mas... kapan-kapan kita sering-sering mampir sini bertiga ya.' },
    ],
  },

  // === 3. TERAS KIOS 24 JAM HARMONI ===
  {
    id: 'kios_teh',
    spot: 'kios',
    name: 'Teh Melati Hangat & Roti Sobek',
    priceLabel: 'Rp 12.000',
    tagline: 'Teh melati seduh panas dalam gelas kertas plus roti sobek keju lembut.',
    tasteNote: 'Duduk di meja bundar teras minimarket sambil memandang lalu lintas sore—sederhana tapi menenangkan.',
    drinkVisual: 'tea',
    isHot: true,
    familyReaction: [
      { speaker: 'nadia', text: 'Teh melatinya wangi sekali, Mas. Enak ya duduk sebentar melihat orang lewat.' },
    ],
  },
  {
    id: 'kios_eskrim',
    spot: 'kios',
    name: 'Es Krim Cone Stroberi Segar',
    priceLabel: 'Rp 9.000',
    tagline: 'Es krim lembut rasa stroberi dingin dalam cone renyah.',
    tasteNote: 'Dingin dan manis di sore kota yang hangat—mengingatkan pada janjimu yang dulu sempat tertunda.',
    drinkVisual: 'icecream',
    isHot: false,
    familyReaction: [
      { speaker: 'kira', text: 'YEEEY ES KRIM STROBERI!! Makasih banyak, Ayaaah!!' },
    ],
  },
  {
    id: 'kios_family',
    spot: 'kios',
    name: 'Jajan Sore Bertiga di Teras Harmoni',
    priceLabel: 'Rp 28.000',
    tagline: 'Dua teh melati hangat & satu es krim cone stroberi ekstra buat Kira.',
    tasteNote: 'Mbak Lilis tersenyum melambaikan tangan dari balik kaca minimarket melihat keluarga kecil itu tertawa di meja teras.',
    drinkVisual: 'tea',
    isHot: true,
    isFamilyTreat: true,
    journalTitle: 'Jajan Es Krim & Teh Hangat di Teras Harmoni',
    journalBody: 'Kami duduk di meja bundar depan Kios Harmoni menikmati teh melati hangat dan es krim stroberi. Tidak perlu tempat mewah—hanya duduk bersama tanpa buru-buru saja sudah terasa istimewa.',
    familyReaction: [
      { speaker: 'kira', text: 'Es krimnya dingin tapi hati Kira hangat banget jalan sama Ayah sama Bunda!' },
      { speaker: 'nadia', text: 'Hati-hati es krimnya menetes ke baju ya, Sayang. Terima kasih ya, Mas.' },
    ],
  },

  // === 4. GEROBAK MARTABAK MANIS & KACANG REBUS TEPI SUNGAI ===
  {
    id: 'martabak_cokelat_keju',
    spot: 'martabak',
    name: 'Martabak Manis Cokelat Keju Susu',
    priceLabel: 'Rp 22.000',
    tagline: 'Adonan lembut wangi mentega dengan taburan mesis cokelat, keju parut, & susu kental manis.',
    tasteNote: 'Wangi mentega panas dan cokelat lumer—dimakan sambil menatap pantulan lampion di permukaan sungai terasa luar biasa damai.',
    drinkVisual: 'martabak',
    isHot: true,
    familyReaction: [
      { speaker: 'kira', text: 'WAAAH kejunya banyak banget, Yah!! Martabak Bang Udin emang paling juara!' },
    ],
  },
  {
    id: 'kacang_rebus_hangat',
    spot: 'martabak',
    name: 'Kacang Rebus Hangat Tepi Sungai',
    priceLabel: 'Rp 10.000',
    tagline: 'Kacang tanah rebus gurih empuk baru diangkat dari dandang mengepul.',
    tasteNote: 'Mengupas kacang rebus hangat satu per satu di pinggir sungai membuat waktu melambat tanpa perlu alasan.',
    drinkVisual: 'peanuts',
    isHot: true,
    familyReaction: [
      { speaker: 'nadia', text: 'Dulu bapak aku juga paling suka beli kacang rebus sore-sore gini, Mas. Gurihnya pas banget.' },
    ],
  },
  {
    id: 'martabak_family',
    spot: 'martabak',
    name: 'Traktir Keluarga Martabak & Kacang Rebus (Paket Tepi Sungai)',
    priceLabel: 'Rp 36.000',
    tagline: 'Satu loyang martabak cokelat keju spesial plus sekantong besar kacang rebus hangat.',
    tasteNote: 'Duduk berdampingan di bangku kayu di bawah untaian lampion tepi sungai—tangan penuh remah cokelat, hati penuh rasa syukur.',
    drinkVisual: 'martabak',
    isHot: true,
    isFamilyTreat: true,
    journalTitle: 'Malam Lampion & Martabak di Tepi Sungai',
    journalBody: 'Aku mengajak Nadia dan Kira duduk di bangku kayu promenade sungai menikmati martabak cokelat keju dan kacang rebus hangat dari gerobak Bang Udin. Di bawah untaian lampion kertas yang memantul di air sungai, kota ini terasa begitu ramah.',
    familyReaction: [
      { speaker: 'kira', text: 'Ayah! Bunda! Lihat lampion-lampionnya mantul di air sungai sambil makan martabak!! Seru bangeeet!' },
      { speaker: 'nadia', text: 'Malam yang hangat banget ya, Mas... nggak nyangka jajan martabak pinggir sungai bisa seindah ini.' },
    ],
  },

  // === 5. GEROBAK ROTI HANGAT KELILING PAK JOKO (PERUMAHAN MELATI) ===
  {
    id: 'roti_cokelat',
    spot: 'roti',
    name: 'Roti Cokelat Lumer Panggang Pagi',
    priceLabel: 'Rp 6.000',
    tagline: 'Roti sobek lembut isi pasta cokelat hangat baru keluar dari oven pagi.',
    tasteNote: 'Empuk dan wangi mentega—bunyi bel gerobak Pak Joko selalu membuat pagi di Gang Melati terasa akrab.',
    drinkVisual: 'roti',
    isHot: true,
    familyReaction: [
      { speaker: 'kira', text: 'Mmm!! Roti cokelat Pak Joko empuk banget kayak bantal awan, Yah!' },
    ],
  },
  {
    id: 'roti_srikaya',
    spot: 'roti',
    name: 'Roti Srikaya Pandan & Keju Parut',
    priceLabel: 'Rp 7.000',
    tagline: 'Olesan selai srikaya pandan harum dipadu parutan keju gurih.',
    tasteNote: 'Manis lembut pandannya membawa kembali ingatan sarapan sederhana sebelum berangkat sekolah dulu.',
    drinkVisual: 'roti',
    isHot: true,
    familyReaction: [
      { speaker: 'nadia', text: 'Kesukaanku banget nih roti srikaya pandan! Makasih ya Mas sudah ingat.' },
    ],
  },
  {
    id: 'roti_family',
    spot: 'roti',
    name: 'Bungkus Roti Sobek Keluarga (3 Rasa Hangat)',
    priceLabel: 'Rp 18.000',
    tagline: 'Isi cokelat, keju, dan srikaya pandan—cukup untuk dinikmati bertiga di teras rumah.',
    tasteNote: 'Pak Joko membungkus roti hangat sambil tersenyum ramah—pagi di perumahan terasa penuh kehidupan.',
    drinkVisual: 'roti',
    isHot: true,
    isFamilyTreat: true,
    journalTitle: 'Pagi Wangi Roti di Gang Melati',
    journalBody: 'Begitu mendengar melodi bel gerobak roti Pak Joko di depan gang, aku langsung mengajak Nadia dan Kira membeli sebungkus roti sobek hangat aneka rasa. Hal sederhana seperti ini rupanya yang membuat sebuah perumahan terasa seperti rumah.',
    familyReaction: [
      { speaker: 'kira', text: 'YEEEY roti hangat bertiga!! Kira mau bagian yang ada cokelat paling banyak ya, Yah!' },
      { speaker: 'nadia', text: 'Enak banget wangi rotinya, Mas... besok pagi kalau dengar bel Pak Joko kita mampir lagi yuk.' },
    ],
  },

  // === 6. PANTRY LOBI MENARA NUSANTARA ===
  {
    id: 'office_americano',
    spot: 'office_pantry',
    name: 'Kopi Hitam Mesin Pantry (Americano)',
    priceLabel: 'Gratis · Pantry',
    tagline: 'Seduhan kopi hitam pekat dari mesin espresso lobi—teman setia rapat siang dan lembur.',
    tasteNote: 'Pahit hangat di gelas kertas—duduk sebentar menghadap kaca Jl. Kenangan membuat kepala terasa jauh lebih jernih.',
    drinkVisual: 'coffee',
    isHot: true,
    familyReaction: [
      { speaker: 'nadia', text: 'Jangan kebanyakan kopi hitam kalau perut belum diisi ya, Mas. Pelan-pelan aja minumnya.' },
    ],
  },
  {
    id: 'office_jasminetea',
    spot: 'office_pantry',
    name: 'Teh Melati Hangat Gelas Kertas',
    priceLabel: 'Gratis · Pantry',
    tagline: 'Seduhan teh melati ringan untuk jeda sepuluh menit jauh dari layar laptop.',
    tasteNote: 'Kadang keputusan paling jernih bukan datang di ruang rapat, melainkan saat duduk diam menatap jalanan di luar kaca lobi.',
    drinkVisual: 'tea',
    isHot: true,
    familyReaction: [
      { speaker: 'kira', text: 'Lobi kantor Ayah lantainya mengilap banget kayak cermin! Enak lihat mobil lewat dari kursi ini!' },
    ],
  },
  {
    id: 'office_family_cocoa',
    spot: 'office_pantry',
    name: 'Cokelat Hangat Pantry Bersama Keluarga',
    priceLabel: 'Gratis · Pantry',
    tagline: 'Tiga gelas cokelat susu hangat untuk dinikmati di kursi jendela lobi sambil memandangi Jl. Kenangan.',
    tasteNote: 'Untuk pertama kalinya lobi kantor yang biasanya dingin terasa begitu hangat—karena ada tawa Nadia dan Kira di sisimu.',
    drinkVisual: 'cocoa',
    isHot: true,
    isFamilyTreat: true,
    journalTitle: 'Jeda Hangat di Lobi Menara Nusantara',
    journalBody: 'Aku mengajak Nadia dan Kira duduk sejenak di kursi jendela lobi kantor sambil menyeruput cokelat hangat dari mesin pantry. Tempat yang dulu terasa penuh tekanan kini terasa jauh lebih bersahabat.',
    familyReaction: [
      { speaker: 'kira', text: 'Waaah mesin cokelat di kantor Ayah canggih banget!! Enak banget lagi rasanya!' },
      { speaker: 'nadia', text: 'Ternyata pemandangan dari lobi kantormu adem juga ya, Mas... apalagi kalau nggak sedang dikejar tenggat.' },
    ],
  },

  // === 7. LAPAK ES KELAPA MUDA PAK HASAN (TEPI TAMAN DANAU SENJA) ===
  {
    id: 'coco_muda_asli',
    spot: 'coconut',
    name: 'Es Kelapa Muda Utuh Asli',
    priceLabel: 'Rp 12.000',
    tagline: 'Kelapa muda hijau segar baru dibelah dengan daging lembut dan es batu bening.',
    tasteNote: 'Tegukan pertama langsung menyapu gerah siang—manis alaminya terasa pas ditemani angin sepoi Danau Senja.',
    drinkVisual: 'coconut',
    isHot: false,
    familyReaction: [
      { speaker: 'nadia', text: 'Segar banget ya Mas air kelapa aslinya! Enak duduk di bawah payung menghadap danau begini.' },
    ],
  },
  {
    id: 'coco_jeruk_cocopandan',
    spot: 'coconut',
    name: 'Es Kelapa Jeruk Peras & Cocopandan',
    priceLabel: 'Rp 15.000',
    tagline: 'Air kelapa muda dingin berpadu perasan jeruk manis dan sirup cocopandan wangi.',
    tasteNote: 'Manis segar dengan sedikit asam jeruk—persis rasa liburan Minggu siang di taman kota.',
    drinkVisual: 'coconut',
    isHot: false,
    familyReaction: [
      { speaker: 'kira', text: 'Waaah warnanya merah muda segar banget, Yah! Ada potongan daging kelapanya juga!' },
    ],
  },
  {
    id: 'coco_family',
    spot: 'coconut',
    name: 'Traktir Keluarga Es Kelapa & Pisang Goreng (Paket Danau)',
    priceLabel: 'Rp 38.000',
    tagline: 'Dua kelapa muda utuh, satu es kelapa cocopandan buat Kira, plus sepiring pisang goreng renyah.',
    tasteNote: 'Pak Hasan tersenyum ramah mengantar kelapa muda dingin ke meja payung—di tepi Danau Senja, waktu terasa begitu lapang.',
    drinkVisual: 'coconut',
    isHot: false,
    isFamilyTreat: true,
    journalTitle: 'Segarnya Es Kelapa Muda di Tepi Danau Senja',
    journalBody: 'Di bawah payung teduh Lapak Pak Hasan, aku mengajak Nadia dan Kira menikmati es kelapa muda dingin dan pisang goreng hangat sambil memandangi riak Danau Senja. Tawa Kira yang menyedot kelapa utuh membuat sore ini terasa sangat ringan.',
    familyReaction: [
      { speaker: 'kira', text: 'Slurppp!! Es kelapa utuhnya dingin banget, Ayah!! Kira mau kerok daging kelapanya pakai sendok!' },
      { speaker: 'nadia', text: 'Nikmat banget duduk santai di tepi danau begini, Mas... rasanya semua penat langsung hilang.' },
    ],
  },
];
