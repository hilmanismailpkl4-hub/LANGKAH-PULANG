import { FamilyBanterLine } from './familyWalkBanter';

export type CulinarySpotId =
  | 'angkringan'
  | 'cafe'
  | 'kios'
  | 'martabak'
  | 'roti'
  | 'office_pantry'
  | 'coconut'
  | 'bakso'
  | 'sate'
  | 'dawet'
  | 'siomay'
  | 'gorengan'
  | 'pecel_lele'
  | 'doger'
  | 'ketoprak';
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
  | 'coconut'
  | 'sate'
  | 'dawet'
  | 'siomay'
  | 'gorengan'
  | 'pecel_lele'
  | 'doger'
  | 'ketoprak';

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
  bakso: {
    id: 'bakso',
    title: 'Bakso Malang Keliling Mas Agung',
    hostName: 'Mas Agung',
    subtitle: 'Tepi Jl. Melati · Kuah Kaldu Hangat & Pangsit Goreng',
    seatPos: [-24.6, 0.14, 47.8],
    lookAt: [-26.8, 1.35, 47.8],
    standPos: [-24.6, 0, 49.0],
    seatYaw: -Math.PI / 2,
    tablePropPos: [-25.9, 1.18, 47.8],
  },
  sate: {
    id: 'sate',
    title: 'Sate Ayam Madura Cak Mat',
    hostName: 'Cak Mat',
    subtitle: 'Sudut Jl. Cempaka · Bara Arang, Bumbu Kacang & Lontong Hangat',
    seatPos: [13.4, 0.14, 32.55],
    lookAt: [13.4, 1.35, 29.5],
    standPos: [11.9, 0, 32.1],
    seatYaw: Math.PI,
    tablePropPos: [13.4, 0.78, 31.8],
  },
  dawet: {
    id: 'dawet',
    title: 'Es Cendol Dawet Ayu Pak Darmo',
    hostName: 'Pak Darmo',
    subtitle: 'Plaza Menara Nusantara · Cendol Pandan, Santan & Gula Aren Asli',
    seatPos: [40.4, 0.14, -13.6],
    lookAt: [42.8, 1.35, -13.6],
    standPos: [40.4, 0, -12.3],
    seatYaw: Math.PI / 2,
    tablePropPos: [42.2, 1.12, -13.6],
  },
  siomay: {
    id: 'siomay',
    title: 'Siomay Bandung Mang Asep',
    hostName: 'Mang Asep',
    subtitle: 'Tepi Taman Kota · Siomay Ikan Tenggiri, Bumbu Kacang & Jeruk Limau',
    seatPos: [-79.0, 0.14, 10.95],
    lookAt: [-79.0, 1.35, 12.6],
    standPos: [-79.0, 0, 9.75],
    seatYaw: 0,
    tablePropPos: [-79.0, 1.16, 12.05],
  },
  gorengan: {
    id: 'gorengan',
    title: 'Gorengan Hangat Sore Mbak Yuni',
    hostName: 'Mbak Yuni',
    subtitle: 'Trotoar Jl. Cempaka · Tahu Isi, Tempe Mendoan, Pisang Goreng & Cabai Rawit',
    seatPos: [-9.55, 0.14, 31.4],
    lookAt: [-11.2, 1.35, 31.4],
    standPos: [-8.4, 0, 31.4],
    seatYaw: -Math.PI / 2,
    tablePropPos: [-10.65, 1.12, 31.4],
  },
  pecel_lele: {
    id: 'pecel_lele',
    title: 'Warung Tenda Pecel Lele Lamongan "Sari Rasa"',
    hostName: 'Mas Eko',
    subtitle: 'Tepi Jl. Kenangan · Lele Goreng Renyah, Ayam Kremes & Sambal Terasi Ulek',
    seatPos: [44.05, 0.14, 11.18],
    lookAt: [44.05, 1.35, 12.4],
    standPos: [44.05, 0, 10.1],
    seatYaw: 0,
    tablePropPos: [44.05, 0.84, 12.15],
  },
  doger: {
    id: 'doger',
    title: 'Gerobak Es Doger Segar Bang Toni',
    hostName: 'Bang Toni',
    subtitle: 'Trotoar Jl. Cempaka Utara · Es Kelapa Merah Muda, Tape Ketan, Alpukat & Mutiara',
    seatPos: [9.75, 0.14, -25.6],
    lookAt: [11.6, 1.35, -25.6],
    standPos: [8.6, 0, -25.6],
    seatYaw: Math.PI / 2,
    tablePropPos: [11.05, 1.14, -25.6],
  },
  ketoprak: {
    id: 'ketoprak',
    title: 'Ketoprak Jakarta Ulek Cobek Bang Jaja',
    hostName: 'Bang Jaja',
    subtitle: 'Promenade Tepi Sungai · Ketupat, Tahu Goreng, Bihun, Bumbu Kacang & Kerupuk',
    seatPos: [-38.35, 0.14, 36.2],
    lookAt: [-36.5, 1.35, 36.2],
    standPos: [-38.35, 0, 34.8],
    seatYaw: Math.PI / 2,
    tablePropPos: [-37.05, 1.14, 36.2],
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

  // === 8. GEROBAK BAKSO MALANG KELILING MAS AGUNG (TEPI JL. MELATI) ===
  {
    id: 'bakso_urat_hangat',
    spot: 'bakso',
    name: 'Bakso Urat & Tahu Kuah Kaldu Hangat',
    priceLabel: 'Rp 16.000',
    tagline: 'Bakso urat kenyal, bakso halus, tahu isi, mi bihun, bawang goreng & seledri wangi.',
    tasteNote: 'Kuah kaldu sapi panas mengepul di mangkuk ayam jago—begitu diseruput saat angin malam turun, seluruh tubuh langsung hangat.',
    drinkVisual: 'soup',
    isHot: true,
    familyReaction: [
      { speaker: 'nadia', text: 'Wangi kuah kaldu sama seledrinya Mas Agung mantap banget ya, Mas! Nggak perlu pakai saus banyak udah gurih.' },
    ],
  },
  {
    id: 'bakso_mie_pangsit',
    spot: 'bakso',
    name: 'Mie Ayam Bakso & Pangsit Goreng Renyah',
    priceLabel: 'Rp 18.000',
    tagline: 'Mi kenyal tabur ayam kecap manis, dua butir bakso hangat, dan pangsit goreng kriuk.',
    tasteNote: 'Suara "ting-ting-ting" mangkuk bakso keliling memang tak pernah gagal mengundang lapar di sore menjelang malam.',
    drinkVisual: 'soup',
    isHot: true,
    familyReaction: [
      { speaker: 'kira', text: 'Kriuk-kriuk!! Pangsit gorengnya renyah banget, Ayah! Kira suka yang dicelup kuah!' },
    ],
  },
  {
    id: 'bakso_family',
    spot: 'bakso',
    name: 'Traktir Keluarga Bakso Malang Komplit (Paket Bertiga)',
    priceLabel: 'Rp 46.000',
    tagline: 'Tiga mangkuk bakso komplit (tanpa sambal untuk Kira) plus ekstra pangsit goreng dan teh hangat.',
    tasteNote: 'Duduk bersama di bangku kayu samping gerobak di bawah bohlam kuning Mas Agung—hangatnya kuah bakso menyatu dengan tawa keluarga.',
    drinkVisual: 'soup',
    isHot: true,
    isFamilyTreat: true,
    journalTitle: 'Semangkuk Bakso Hangat di Bawah Lampu Malam',
    journalBody: 'Begitu mendengar denting mangkuk "ting-ting-ting" gerobak Mas Agung di tepi Jl. Melati, aku langsung mengajak Nadia dan Kira jajan bakso Malang komplit. Duduk di bangku kayu dengan uap kuah kaldu mengepul, malam di perumahan terasa begitu akrab.',
    familyReaction: [
      { speaker: 'kira', text: 'YEEEY makan bakso bertiga dekat rumah!! Bakso kecilnya kenyal banget, Ayah!!' },
      { speaker: 'nadia', text: 'Enak banget ya Mas nggak perlu masak malam ini, tinggal jajan bakso hangat di depan gang.' },
    ],
  },

  // === 9. GEROBAK SATE AYAM MADURA CAK MAT (SUDUT JL. CEMPAKA) ===
  {
    id: 'sate_ayam_lontong',
    spot: 'sate',
    name: 'Sate Ayam Madura 10 Tusuk + Lontong',
    priceLabel: 'Rp 22.000',
    tagline: 'Daging ayam panggang bara arang, bumbu kacang halus, kecap manis, irisan bawang merah & lontong lembut.',
    tasteNote: 'Wangi asap arang dan gurih manis bumbu kacang Cak Mat langsung membangkitkan selera di sore yang mulai sejuk.',
    drinkVisual: 'sate',
    isHot: true,
    familyReaction: [
      { speaker: 'nadia', text: 'Aroma asap sate Cak Mat dari ujung jalan aja udah menggoda banget ya, Mas!' },
    ],
  },
  {
    id: 'sate_kambing_kecap',
    spot: 'sate',
    name: 'Sate Kambing Muda Bumbu Kecap',
    priceLabel: 'Rp 28.000',
    tagline: 'Potongan daging empuk bakar arang dengan kecap manis, tomat segar, dan irisan kol renyah.',
    tasteNote: 'Empuk dan smoky—paling nikmat disantap selagi masih mengepul di bawah cahaya bohlam gerobak.',
    drinkVisual: 'sate',
    isHot: true,
    familyReaction: [
      { speaker: 'kira', text: 'Asap satenya wangi bangettt! Cak Mat jago banget kipas-kipas arangnya, Yah!' },
    ],
  },
  {
    id: 'sate_family',
    spot: 'sate',
    name: 'Traktir Keluarga Sate Ayam & Lontong (Paket Malam)',
    priceLabel: 'Rp 58.000',
    tagline: '25 tusuk sate ayam bumbu kacang terpisah (ramah anak untuk Kira) plus 3 porsi lontong hangat.',
    tasteNote: 'Duduk bersama menikmati sate hangat di pinggir Jl. Cempaka sementara kipas bambu Cak Mat menerbangkan aroma gurih ke udara malam.',
    drinkVisual: 'sate',
    isHot: true,
    isFamilyTreat: true,
    journalTitle: 'Asap Sate Madura di Sudut Jl. Cempaka',
    journalBody: 'Di sudut Jl. Cempaka dekat Kios Harmoni, aku mengajak Nadia dan Kira duduk menyantap sate ayam Madura dan lontong hangat racikan Cak Mat. Di bawah pijar bara arang merah dan kipasan bambu, malam kota terasa begitu hidup.',
    familyReaction: [
      { speaker: 'kira', text: 'Kira mau sate yang pakai kecap manis aja ya, Ayah! Enak bangettt makannya pakai lontong!' },
      { speaker: 'nadia', text: 'Makasih ya Mas buat makan malam sate Maduranya—bumbu kacangnya Cak Mat juara banget.' },
    ],
  },

  // === 10. GEROBAK ES CENDOL DAWET AYU PAK DARMO (PLAZA MENARA NUSANTARA) ===
  {
    id: 'dawet_original',
    spot: 'dawet',
    name: 'Es Dawet Ayu Cendol Gula Aren Asli',
    priceLabel: 'Rp 10.000',
    tagline: 'Cendol tepung beras hijau pandan, santan gurih segar, dan sirup gula aren kental wangi.',
    tasteNote: 'Manis legit gula aren dan dinginnya es serut langsung meluruhkan penat sepulang dari gedung kantor.',
    drinkVisual: 'dawet',
    isHot: false,
    familyReaction: [
      { speaker: 'nadia', text: 'Wangi gula aren sama daun pandannya asli banget ya, Mas! Segar banget buat sore hari.' },
    ],
  },
  {
    id: 'dawet_nangka_tape',
    spot: 'dawet',
    name: 'Es Dawet Ayu Spesial Nangka & Tape Ketan',
    priceLabel: 'Rp 14.000',
    tagline: 'Tambahan potongan buah nangka harum dan tape ketan manis lembut di atas cendol dingin.',
    tasteNote: 'Rasa tradisional yang selalu terasa hangat di ingatan—persis minuman pulang sekolah masa kecil.',
    drinkVisual: 'dawet',
    isHot: false,
    familyReaction: [
      { speaker: 'kira', text: 'Waaah ada cendol hijau kenyal-kenyal sama buah nangka kuning, Yah! Manis banget!' },
    ],
  },
  {
    id: 'dawet_family',
    spot: 'dawet',
    name: 'Traktir Keluarga Es Dawet Ayu (Paket Plaza Kantor)',
    priceLabel: 'Rp 32.000',
    tagline: 'Tiga gelas besar Es Dawet Ayu lengkap dengan potongan nangka wangi & es batu segar.',
    tasteNote: 'Pak Darmo menyendok cendol dari gentong tanah liat sambil tersenyum ramah—siang menuju sore di plaza kantor jadi terasa santai.',
    drinkVisual: 'dawet',
    isHot: false,
    isFamilyTreat: true,
    journalTitle: 'Segarnya Es Dawet Ayu di Depan Menara Nusantara',
    journalBody: 'Di bawah payung gerobak Pak Darmo di tepi plaza Menara Nusantara, aku mengajak Nadia dan Kira menikmati tiga gelas Es Dawet Ayu dingin. Gurihnya santan dan wangi gula aren mengingatkan bahwa jeda manis sering hadir tepat di tepi jalan biasa.',
    familyReaction: [
      { speaker: 'kira', text: 'Slurppp!! Cendol hijaunya naik lewat sedotan, Ayah!! Enak bangettt es dawetnya Pak Darmo!' },
      { speaker: 'nadia', text: 'Segar banget ya Mas... senang deh lihat kamu masih sempat mampir jajan manis begini sepulang kerja.' },
    ],
  },

  // === 11. GEROBAK SIOMAY BANDUNG MANG ASEP (TEPI TAMAN KOTA) ===
  {
    id: 'siomay_komplit',
    spot: 'siomay',
    name: 'Siomay Bandung Komplit Bumbu Kacang',
    priceLabel: 'Rp 15.000',
    tagline: 'Siomay ikan tenggiri kukus, tahu putih, kentang, kol gulung, telur rebus & perasan jeruk limau.',
    tasteNote: 'Lembut gurih ikan tenggiri berpadu bumbu kacang kental dan wangi jeruk limau—pas banget untuk sore di tepi taman.',
    drinkVisual: 'siomay',
    isHot: true,
    familyReaction: [
      { speaker: 'nadia', text: 'Wangi kukusan siomay sama jeruk limaunya Mang Asep langsung bikin lapar lagi ya, Mas.' },
    ],
  },
  {
    id: 'siomay_batagor',
    spot: 'siomay',
    name: 'Campur Batagor Renyah & Siomay Hangat',
    priceLabel: 'Rp 16.000',
    tagline: 'Perpaduan batagor pangsit renyah dan siomay kukus empuk dengan kecap manis & sambal kacang.',
    tasteNote: 'Kriuk hangat di gigitan pertama, diikuti gurih lembut siomay—jajan sore taman yang selalu bikin betah.',
    drinkVisual: 'siomay',
    isHot: true,
    familyReaction: [
      { speaker: 'kira', text: 'Kriuk-kriuk!! Pangsit batagornya renyah banget, Ayah! Kira suka banget bumbu kacangnya!' },
    ],
  },
  {
    id: 'siomay_family',
    spot: 'siomay',
    name: 'Traktir Keluarga Siomay Bandung (Paket Sore Taman)',
    priceLabel: 'Rp 42.000',
    tagline: 'Tiga piring siomay & batagor hangat (versi bumbu manis tanpa pedas untuk Kira) plus kerupuk.',
    tasteNote: 'Mang Asep cekatan memotong siomay hangat dari panci kukus mengepul sambil menyapa Kira—sore di Taman Kota terasa penuh tawa.',
    drinkVisual: 'siomay',
    isHot: true,
    isFamilyTreat: true,
    journalTitle: 'Sore Hangat Bersama Siomay Mang Asep di Taman Kota',
    journalBody: 'Di tepi Taman Kota dekat taman bermain dan gazebo, kami bertiga duduk di bangku kayu gerobak Mang Asep menyantap Siomay Bandung komplit yang masih mengepul. Sambil ditemani semilir angin sore, jajan sederhana ini terasa begitu lengkap.',
    familyReaction: [
      { speaker: 'kira', text: 'Yeeey!! Kira dapat telur rebus sama kentang kukus paling besar dari Mang Asep! Makasih, Ayaah!' },
      { speaker: 'nadia', text: 'Enak banget ya Mas, apalagi dimakan sore-sore sambil melihat taman begini. Terima kasih sudah traktir.' },
    ],
  },

  // === 12. LAPAK GORENGAN HANGAT SORE MBAK YUNI (TROTOAR JL. CEMPAKA) ===
  {
    id: 'gorengan_campur',
    spot: 'gorengan',
    name: 'Gorengan Hangat Campur & Cabai Rawit',
    priceLabel: 'Rp 10.000',
    tagline: 'Tahu isi sayuran renyah, tempe mendoan daun bawang, bakwan jagung & cabai rawit hijau segar.',
    tasteNote: 'Baru diangkat dari wajan—kriuk hangat di luar, lembut di dalam, persis teman terbaik di sore yang sedikit berangin.',
    drinkVisual: 'gorengan',
    isHot: true,
    familyReaction: [
      { speaker: 'nadia', text: 'Aroma tempe mendoan baru matang di pinggir Jl. Cempaka ini memang paling susah dilewatkan ya, Mas!' },
    ],
  },
  {
    id: 'gorengan_pisang',
    spot: 'gorengan',
    name: 'Pisang Goreng Kepok Renyah & Mendoan',
    priceLabel: 'Rp 12.000',
    tagline: 'Pisang kepok manis berbalut tepung krispi hangat ditemani dua potong tempe mendoan.',
    tasteNote: 'Manis legit pisang kepok hangat bikin langkah pulang ke Jl. Melati terasa jauh lebih santai.',
    drinkVisual: 'gorengan',
    isHot: true,
    familyReaction: [
      { speaker: 'kira', text: 'Pisang gorengnya masih hangat banget, Yah!! Manis dan kriuk-kriuk kesukaan Kira!' },
    ],
  },
  {
    id: 'gorengan_family',
    spot: 'gorengan',
    name: 'Traktir Keluarga Sekantong Gorengan Sore',
    priceLabel: 'Rp 25.000',
    tagline: 'Kantong kertas penuh pisang goreng kepok, tahu isi, bakwan jagung & mendoan buat disantap bertiga.',
    tasteNote: 'Mbak Yuni menyelipkan dua bonus pisang goreng untuk Kira—kami bertiga makan bergantian dari kantong kertas hangat di pinggir jalan.',
    drinkVisual: 'gorengan',
    isHot: true,
    isFamilyTreat: true,
    journalTitle: 'Sekantong Gorengan Hangat di Pinggir Jl. Cempaka',
    journalBody: 'Sepulang berkeliling kota, aku mengajak Nadia dan Kira mampir di lapak gorengan Mbak Yuni. Berbagi pisang goreng hangat, tahu isi, dan mendoan dari satu kantong kertas cokelat terasa begitu sederhana sekaligus membahagiakan.',
    familyReaction: [
      { speaker: 'kira', text: 'Horeee!! Tante Yuni kasih bonus pisang goreng dua buat Kira!! Makasih banyak, Ayaah!' },
      { speaker: 'nadia', text: 'Hati-hati masih panas ya, Sayang, tiup dulu pelan-pelan. Enak banget nih Mas gorengannya!' },
    ],
  },

  // === 13. WARUNG TENDA PECEL LELE LAMONGAN "SARI RASA" (TEPI JL. KENANGAN) ===
  {
    id: 'pecel_lele_komplit',
    spot: 'pecel_lele',
    name: 'Pecel Lele Goreng Garing & Sambal Terasi',
    priceLabel: 'Rp 18.000',
    tagline: 'Dua ekor lele goreng renyah, nasi uduk wangi, sambal tomat terasi ulek, lalapan timun & kemangi.',
    tasteNote: 'Garing di luar, lembut di dalam—dicocol sambal terasi hangat di bawah tenda biru pinggir jalan, nikmat tiada duanya.',
    drinkVisual: 'pecel_lele',
    isHot: true,
    familyReaction: [
      { speaker: 'nadia', text: 'Sambal terasi uleknya Mas Eko harum banget ya, Mas! Persis rasa kaki lima favorit kita.' },
    ],
  },
  {
    id: 'pecel_ayam_kremes',
    spot: 'pecel_lele',
    name: 'Ayam Goreng Kremes, Tahu Tempe & Nasi Uduk',
    priceLabel: 'Rp 22.000',
    tagline: 'Ayam goreng bumbu kuning renyah bertabur kremesan gurih dengan tahu tempe hangat & es teh tawar.',
    tasteNote: 'Aroma nasi uduk daun salam dan kremesan renyah langsung membangkitkan selera makan malam sepulang kerja.',
    drinkVisual: 'pecel_lele',
    isHot: true,
    familyReaction: [
      { speaker: 'kira', text: 'Kremesan ayam gorengnya renyah bangettt, Yah!! Kira suka makan pakai nasi uduk!' },
    ],
  },
  {
    id: 'pecel_lele_family',
    spot: 'pecel_lele',
    name: 'Traktir Makan Malam Keluarga di Tenda Lamongan',
    priceLabel: 'Rp 62.000',
    tagline: 'Pecel lele garing, ayam goreng kremes untuk Kira, tahu tempe bacem, kol goreng & 3 nasi uduk hangat.',
    tasteNote: 'Duduk bersama di bangku panjang di balik spanduk lukis Lamongan sambil ditemani hembusan angin malam Jl. Kenangan—sederhana namun hangat luar biasa.',
    drinkVisual: 'pecel_lele',
    isHot: true,
    isFamilyTreat: true,
    journalTitle: 'Makan Malam Hangat di Warung Tenda Lamongan',
    journalBody: 'Di bawah tenda biru Warung Pecel Lele Sari Rasa pinggir Jl. Kenangan, kami bertiga menikmati makan malam nasi uduk, lele goreng garing, dan ayam kremes hangat. Tidak ada restoran mewah yang bisa menandingi tawa keluarga di meja tenda kaki lima.',
    familyReaction: [
      { speaker: 'kira', text: 'Yeeey makan malam di tenda gambar ikan lele!! Ayam kremesnya enak bangettt, Makasih Ayah!' },
      { speaker: 'nadia', text: 'Makasih ya Mas sudah traktir makan malam di sini—hari ini aku nggak usah cuci piring deh, hehe.' },
    ],
  },

  // === 14. GEROBAK ES DOGER SEGAR BANG TONI (TEPI JL. CEMPAKA UTARA) ===
  {
    id: 'doger_spesial',
    spot: 'doger',
    name: 'Es Doger Spesial Tape Ketan & Alpukat',
    priceLabel: 'Rp 10.000',
    tagline: 'Es serut santan kelapa merah muda lembut, tape ketan hitam, alpukat mentega, dan susu kental manis.',
    tasteNote: 'Dingin manis dan sedikit gurih santan—langsung menghilangkan gerah sore di pinggir Jl. Cempaka.',
    drinkVisual: 'doger',
    isHot: false,
    familyReaction: [
      { speaker: 'nadia', text: 'Enak banget ya Mas es doger Bang Toni, santannya gurih terus alpukatnya matang pas!' },
    ],
  },
  {
    id: 'doger_mutiara',
    spot: 'doger',
    name: 'Es Doger Mutiara Pacar Cina & Roti Tawar',
    priceLabel: 'Rp 12.000',
    tagline: 'Porsi melimpah dengan butiran mutiara kenyal, potongan roti tawar lembut, & serutan es cocopandan.',
    tasteNote: 'Manis segar berwarna merah muda ceria—persis jajanan sore klasik yang bikin hati ikut ringan.',
    drinkVisual: 'doger',
    isHot: false,
    familyReaction: [
      { speaker: 'kira', text: 'Waaah warnanya pink cantik bangettt, Yah!! Ada bola-bola mutiara kenyalnya juga!' },
    ],
  },
  {
    id: 'doger_family',
    spot: 'doger',
    name: 'Traktir Keluarga Es Doger Sore (Paket Bertiga)',
    priceLabel: 'Rp 30.000',
    tagline: 'Tiga gelas besar Es Doger komplit dengan ekstra alpukat & mutiara merah muda untuk dinikmati bertiga.',
    tasteNote: 'Bang Toni cekatan mengerok es doger dari tong stainless sambil tertawa ramah—sore di trotoar Jl. Cempaka terasa manis sekali.',
    drinkVisual: 'doger',
    isHot: false,
    isFamilyTreat: true,
    journalTitle: 'Manisnya Es Doger Bang Toni di Sore Jl. Cempaka',
    journalBody: 'Di bawah payung merah muda Gerobak Es Doger Bang Toni di tepi Jl. Cempaka, aku mengajak Nadia dan Kira menikmati tiga gelas es doger dingin. Melihat Kira bersemangat menyendok mutiara merah muda membuat penat seharian menguap begitu saja.',
    familyReaction: [
      { speaker: 'kira', text: 'Horeee!! Es doger pink bertiga!! Dingin manis enak bangettt, makasih banyak Ayah!' },
      { speaker: 'nadia', text: 'Segar banget ya Mas... terima kasih sudah mengajak mampir jajan es doger sore-sore begini.' },
    ],
  },

  // === 15. GEROBAK KETOPRAK JAKARTA BANG JAJA (PROMENADE TEPI SUNGAI) ===
  {
    id: 'ketoprak_komplit',
    spot: 'ketoprak',
    name: 'Ketoprak Jakarta Komplit & Kerupuk Renyah',
    priceLabel: 'Rp 14.000',
    tagline: 'Ketupat empuk, tahu putih goreng hangat, bihun, taoge segar, bumbu kacang ulek bawang putih & kerupuk.',
    tasteNote: 'Wangi bawang putih ulek di cobek batu dan gurihnya bumbu kacang berpadu sempurna dengan kerupuk kriuk di tepi sungai.',
    drinkVisual: 'ketoprak',
    isHot: true,
    familyReaction: [
      { speaker: 'nadia', text: 'Bumbu kacang ulekan Bang Jaja harum bawang putihnya pas banget ya, Mas! Enak banget!' },
    ],
  },
  {
    id: 'ketoprak_telur_dadar',
    spot: 'ketoprak',
    name: 'Ketoprak Spesial Telur Dadar & Kecap Manis',
    priceLabel: 'Rp 18.000',
    tagline: 'Tambahan telur dadar gurih hangat, taburan bawang goreng melimpah & ekstra kerupuk oranye.',
    tasteNote: 'Mengenyangkan dan penuh rasa rumahan—duduk di bangku pinggir sungai sambil mendengar gemericik air membuat waktu terasa begitu tenang.',
    drinkVisual: 'ketoprak',
    isHot: true,
    familyReaction: [
      { speaker: 'kira', text: 'Kriuk!! Kerupuk oranye dari kaleng biru Bang Jaja renyah banget, Yah! Kira suka telur dadarnya!' },
    ],
  },
  {
    id: 'ketoprak_family',
    spot: 'ketoprak',
    name: 'Traktir Keluarga Ketoprak Tepi Sungai (Paket Bertiga)',
    priceLabel: 'Rp 44.000',
    tagline: 'Tiga piring ketoprak spesial (tanpa cabai untuk Kira) dengan telur dadar hangat & ekstra kerupuk sepuasnya.',
    tasteNote: 'Bang Jaja cekatan mengulek bumbu kacang segar sambil bercerita ringan—sore di tepi Sungai Kota terasa akrab dan penuh tawa.',
    drinkVisual: 'ketoprak',
    isHot: true,
    isFamilyTreat: true,
    journalTitle: 'Sepiring Ketoprak Hangat di Tepi Sungai Kota',
    journalBody: 'Di tepi promenade Sungai Kota, aku mengajak Nadia dan Kira duduk santai di depan gerobak Ketoprak Jakarta Bang Jaja. Suara ulekan cobek batu, renyahnya kerupuk, dan semilir angin sungai membuat sore sederhana ini terasa begitu berharga.',
    familyReaction: [
      { speaker: 'kira', text: 'Yeeey!! Ketoprak pakai kerupuk banyaaak!! Bang Jaja baik banget kasih kerupuk ekstra buat Kira!' },
      { speaker: 'nadia', text: 'Enak banget ya Mas makan ketoprak hangat di pinggir sungai begini... terima kasih sudah traktir kami.' },
    ],
  },
];
