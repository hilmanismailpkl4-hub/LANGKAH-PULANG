import { HeldDrinkVisual } from './culinaryMenu';
import { FamilyBanterLine } from './familyWalkBanter';

export interface HomeKitchenRecipe {
  id: string;
  name: string;
  category: string;
  cookTimeLabel: string;
  description: string;
  aromaNote: string;
  heldVisual: HeldDrinkVisual;
  journalTitle?: string;
  journalBody?: string;
  familyLines: FamilyBanterLine[];
}

export const HOME_KITCHEN_RECIPES: HomeKitchenRecipe[] = [
  {
    id: 'home_jasmine_tea',
    name: 'Teh Melati Panas & Roti Bakar Mentega',
    category: 'Seduhan Hangat',
    cookTimeLabel: '5 menit',
    description: 'Daun teh melati diseduh pelan dengan gula batu, ditemani roti panggang oles mentega harum.',
    aromaNote: 'Aroma teh melati memenuhi ruang makan—sejenak seluruh bising jalanan terasa sangat jauh.',
    heldVisual: 'tea',
    familyLines: [
      { speaker: 'nadia', text: 'Wah, tumben Mas Damar yang menyeduh teh melati buat kita! Wanginya enak banget.' },
      { speaker: 'kira', text: 'Roti bakar buatan Ayah renyah banget!! Kira minta tambah mentega sedikit lagi ya!' },
    ],
  },
  {
    id: 'home_chicken_soup',
    name: 'Sup Ayam Wortel Hangat Rumah',
    category: 'Masak Bersama Nadia',
    cookTimeLabel: '15 menit',
    description: 'Kuah kaldu bening dengan potongan wortel, kentang, daun bawang, dan seledri segar.',
    aromaNote: 'Panci sup mendidih pelan di atas kompor—aroma seledri dan bawang putih membuat rumah terasa paling utuh.',
    heldVisual: 'soup',
    journalTitle: 'Aroma Sup Hangat di Dapur Jl. Melati',
    journalBody: 'Hari ini aku berdiri cukup lama di samping kompor dapur bersama Nadia, mengaduk panci sup ayam wortel sambil mendengar cerita Kira tentang sekolahnya. Rupanya kebahagiaan tidak pernah jauh dari dapur sendiri.',
    familyLines: [
      { speaker: 'nadia', text: 'Terima kasih ya Mas sudah bantu potong wortel sama jaga kompor... rasanya hangat banget masak bareng lagi.' },
      { speaker: 'kira', text: 'YEAAY sup ayam hangat!! Kalau Ayah sama Bunda masak bareng, kuahnya jadi dua kali lebih enak!' },
    ],
  },
  {
    id: 'home_fried_rice',
    name: 'Nasi Goreng Kecap Spesial Ayah',
    category: 'Hidangan Malam Keluarga',
    cookTimeLabel: '10 menit',
    description: 'Nasi goreng rumahan wangi bawang putih, kecap manis, telur orak-arik, dan kerupuk renyah.',
    aromaNote: 'Desis wajan panas dan wangi kecap manis terkaramelisasi langsung mengundang senyum dari ruang tamu.',
    heldVisual: 'soup',
    journalTitle: 'Nasi Goreng Kecap Malam Hari',
    journalBody: 'Lama sekali sejak terakhir kali aku memasak nasi goreng kecap di rumah untuk Nadia dan Kira. Sederhana saja, hanya wajan hangat dan tawa kecil di meja makan, tapi rasanya cukup untuk mengobati lelah berbulan-bulan.',
    familyLines: [
      { speaker: 'kira', text: 'HORE!! Nasi goreng kecap bikinan Ayah!! Telur mata sapinya punya Kira ya!' },
      { speaker: 'nadia', text: 'Haha, masih jago ternyata kamu bikin nasi goreng, Mas. Duduk sini, kita makan selagi panas.' },
    ],
  },
  {
    id: 'home_kemangi_fried_rice',
    name: 'Nasi Goreng Kampung Kemangi & Rawit Kebun',
    category: 'Panen Kebun Belakang',
    cookTimeLabel: '12 menit',
    description: 'Nasi goreng bumbu ulek bawang kencur dengan segenggam daun kemangi segar dan cabai rawit petikan kebun belakang Nadia.',
    aromaNote: 'Begitu daun kemangi segar menyentuh nasi panas di wajan, wangi khas masakan kampung Ibu langsung memenuhi rumah.',
    heldVisual: 'soup',
    journalTitle: 'Wangi Kemangi Kebun Belakang di Wajan Malam',
    journalBody: 'Memetik segenggam kemangi segar dari bedeng belakang rumah lalu memasaknya mengikuti takaran buku resep bernoda kunyit membuat dapur malam ini terasa penuh oleh cinta dua generasi.',
    familyLines: [
      { speaker: 'nadia', text: 'Masyaallah wanginya persis banget kayak resep Ibu, Mas! Kemangi petikan belakang rumah emang paling segar ya.' },
      { speaker: 'kira', text: 'Ayah hebat!! Yang piring Kira jangan dikasih cabai rawit merah ya, daun wangi hijaunya aja banyakin!!' },
    ],
  },
  {
    id: 'home_lemongrass_pandan_wedang',
    name: 'Wedang Serai Pandan Gula Batu Warisan Ibu',
    category: 'Seduhan Kebun Belakang',
    cookTimeLabel: '8 menit',
    description: 'Rebusan batang serai geprek dan simpul daun pandan wangi dari kebun belakang dengan gula batu kuning yang menghangatkan dada.',
    aromaNote: 'Uap harum serai geprek dan daun pandan naik perlahan dari panci kecil—mengusir sisa dingin angin malam di pundak.',
    heldVisual: 'tea',
    journalTitle: 'Secangkir Wedang Serai Pandan Tanpa Termos Sunyi',
    journalBody: 'Kali ini wedang serai pandan tidak lagi menunggu dingin di dalam termos tengah malam. Aku menyeduhnya sendiri untuk Nadia dan meminumnya selagi hangat berdua.',
    familyLines: [
      { speaker: 'nadia', text: 'Ya ampun Mas... akhirnya aku ngerasain diseduhin wedang serai pandan buatan kamu. Hangat banget sampai ke hati ❤️' },
      { speaker: 'kira', text: 'Hmmmm baunya kayak kue pandan manis!! Kira mau tiup-tiup cangkir kecilnya bareng Ayah sama Bunda!' },
    ],
  },
];
