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
];
