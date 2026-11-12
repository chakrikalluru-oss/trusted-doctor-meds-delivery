// Demo catalogue — replace with partner-hospital data once the backend is connected.
export type Hospital = {
  id: string;
  name: string;
  area: string;
  distanceKm: number;
  etaMins: number;
  licence: string;
  pharmacyHours: string;
  phone: string;
};

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  hospitalId: string;
  initials: string;
};

export type CategoryId =
  | "fever-pain"
  | "cold-cough"
  | "acidity"
  | "allergy"
  | "sugar"
  | "bp-heart"
  | "vitamins"
  | "baby-care"
  | "bone-joint"
  | "first-aid";

export type Category = { id: CategoryId; label: string };

// Plain-language health needs, in the order shown on Home (first 8) and Categories (all).
export const categories: Category[] = [
  { id: "fever-pain", label: "Fever & pain" },
  { id: "cold-cough", label: "Cold & cough" },
  { id: "acidity", label: "Acidity & stomach" },
  { id: "allergy", label: "Allergy" },
  { id: "sugar", label: "Sugar" },
  { id: "bp-heart", label: "BP & heart" },
  { id: "vitamins", label: "Vitamins" },
  { id: "baby-care", label: "Baby care" },
  { id: "bone-joint", label: "Bone & joint" },
  { id: "first-aid", label: "First aid" },
];

export type Medicine = {
  id: string;
  category: CategoryId;
  name: string;
  strength: string;
  pack: string;
  price: number;
  mrp: number;
  hospitalId: string;
  doctorIds: string[];
  rx: boolean;
  use: string;
  howToTake: string;
};

export const hospitals: Hospital[] = [
  {
    id: "shanti-care",
    name: "Shanti Care Hospital",
    area: "Civil Lines",
    distanceKm: 3.2,
    etaMins: 35,
    licence: "WB/20B-21B/2187",
    pharmacyHours: "Open 24 hours",
    phone: "+91 98300 00001",
  },
  {
    id: "green-valley",
    name: "Green Valley Multispeciality",
    area: "Station Road",
    distanceKm: 6.8,
    etaMins: 50,
    licence: "WB/20B-21B/3342",
    pharmacyHours: "8 am – 10 pm",
    phone: "+91 98300 00002",
  },
  {
    id: "lakeview",
    name: "Lakeview Children's Clinic",
    area: "Lake Town",
    distanceKm: 4.5,
    etaMins: 40,
    licence: "WB/20B-21B/1906",
    pharmacyHours: "9 am – 9 pm",
    phone: "+91 98300 00003",
  },
];

export const doctors: Doctor[] = [
  { id: "d1", name: "Dr. Anjali Mehta", specialty: "Heart specialist", hospitalId: "shanti-care", initials: "AM" },
  { id: "d2", name: "Dr. Rajesh Iyer", specialty: "General physician", hospitalId: "shanti-care", initials: "RI" },
  { id: "d3", name: "Dr. Farah Khan", specialty: "Diabetes specialist", hospitalId: "green-valley", initials: "FK" },
  { id: "d4", name: "Dr. Suresh Nair", specialty: "Bone & joint", hospitalId: "green-valley", initials: "SN" },
  { id: "d5", name: "Dr. Meera Das", specialty: "Child specialist", hospitalId: "lakeview", initials: "MD" },
];

export const medicines: Medicine[] = [
  { id: "amlodipine-5", category: "bp-heart", name: "Amlodipine", strength: "5 mg", pack: "Strip of 15 tablets", price: 42, mrp: 48, hospitalId: "shanti-care", doctorIds: ["d1"], rx: true, use: "Blood pressure", howToTake: "1 tablet every morning, after breakfast." },
  { id: "atorvastatin-10", category: "bp-heart", name: "Atorvastatin", strength: "10 mg", pack: "Strip of 10 tablets", price: 96, mrp: 110, hospitalId: "shanti-care", doctorIds: ["d1"], rx: true, use: "Cholesterol", howToTake: "1 tablet at night, after dinner." },
  { id: "telmisartan-40", category: "bp-heart", name: "Telmisartan", strength: "40 mg", pack: "Strip of 15 tablets", price: 128, mrp: 145, hospitalId: "shanti-care", doctorIds: ["d1"], rx: true, use: "Blood pressure", howToTake: "1 tablet daily at the same time." },
  { id: "paracetamol-650", category: "fever-pain", name: "Paracetamol", strength: "650 mg", pack: "Strip of 15 tablets", price: 30, mrp: 34, hospitalId: "shanti-care", doctorIds: ["d2"], rx: false, use: "Fever and body pain", howToTake: "1 tablet when needed. Wait 6 hours between doses." },
  { id: "pantoprazole-40", category: "acidity", name: "Pantoprazole", strength: "40 mg", pack: "Strip of 15 tablets", price: 118, mrp: 135, hospitalId: "shanti-care", doctorIds: ["d2"], rx: true, use: "Acidity", howToTake: "1 tablet before breakfast, on an empty stomach." },
  { id: "cetirizine-10", category: "allergy", name: "Cetirizine", strength: "10 mg", pack: "Strip of 10 tablets", price: 22, mrp: 25, hospitalId: "shanti-care", doctorIds: ["d2"], rx: false, use: "Cold and allergy", howToTake: "1 tablet at night. May cause sleepiness." },
  { id: "metformin-500", category: "sugar", name: "Metformin", strength: "500 mg", pack: "Strip of 20 tablets", price: 38, mrp: 44, hospitalId: "green-valley", doctorIds: ["d3"], rx: true, use: "Diabetes (sugar)", howToTake: "1 tablet twice a day, with meals." },
  { id: "glimepiride-1", category: "sugar", name: "Glimepiride", strength: "1 mg", pack: "Strip of 10 tablets", price: 64, mrp: 72, hospitalId: "green-valley", doctorIds: ["d3"], rx: true, use: "Diabetes (sugar)", howToTake: "1 tablet before breakfast." },
  { id: "vitamin-d3", category: "vitamins", name: "Vitamin D3", strength: "60,000 IU", pack: "4 capsules", price: 112, mrp: 125, hospitalId: "green-valley", doctorIds: ["d3", "d4"], rx: false, use: "Bone strength", howToTake: "1 capsule once a week, with milk." },
  { id: "calcium-d3", category: "vitamins", name: "Calcium + D3", strength: "500 mg", pack: "Strip of 15 tablets", price: 89, mrp: 99, hospitalId: "green-valley", doctorIds: ["d4"], rx: false, use: "Bone strength", howToTake: "1 tablet daily after lunch." },
  { id: "diclofenac-gel", category: "bone-joint", name: "Diclofenac Gel", strength: "1%", pack: "30 g tube", price: 74, mrp: 85, hospitalId: "green-valley", doctorIds: ["d4"], rx: false, use: "Joint and muscle pain", howToTake: "Rub gently on the painful area 3 times a day." },
  { id: "paracetamol-syrup", category: "baby-care", name: "Paracetamol Syrup", strength: "250 mg / 5 ml", pack: "60 ml bottle", price: 36, mrp: 40, hospitalId: "lakeview", doctorIds: ["d5"], rx: false, use: "Fever in children", howToTake: "As per child's weight. Use the measuring cup." },
  { id: "ors", category: "acidity", name: "ORS Sachets", strength: "21.8 g", pack: "Pack of 5", price: 55, mrp: 60, hospitalId: "lakeview", doctorIds: ["d5"], rx: false, use: "Loose motions, dehydration", howToTake: "Mix 1 sachet in 1 litre of clean water." },
  { id: "amoxicillin-syrup", category: "baby-care", name: "Amoxicillin Syrup", strength: "125 mg / 5 ml", pack: "60 ml bottle", price: 68, mrp: 76, hospitalId: "lakeview", doctorIds: ["d5"], rx: true, use: "Infections (antibiotic)", howToTake: "Exactly as written by the doctor. Finish the full course." },
  { id: "ibuprofen-400", category: "fever-pain", name: "Ibuprofen", strength: "400 mg", pack: "Strip of 10 tablets", price: 25, mrp: 28, hospitalId: "green-valley", doctorIds: ["d4"], rx: false, use: "Pain and swelling", howToTake: "1 tablet after food, up to 3 times a day." },
  { id: "ambroxol-syrup", category: "cold-cough", name: "Ambroxol Syrup", strength: "30 mg / 5 ml", pack: "100 ml bottle", price: 82, mrp: 92, hospitalId: "shanti-care", doctorIds: ["d2"], rx: false, use: "Cough with phlegm", howToTake: "2 spoons (10 ml) three times a day." },
  { id: "antacid-syrup", category: "acidity", name: "Antacid Syrup", strength: "Mint", pack: "170 ml bottle", price: 98, mrp: 110, hospitalId: "shanti-care", doctorIds: ["d2"], rx: false, use: "Gas and acidity", howToTake: "2 spoons after meals." },
  { id: "antiseptic-liquid", category: "first-aid", name: "Antiseptic Liquid", strength: "4.8%", pack: "100 ml bottle", price: 64, mrp: 70, hospitalId: "green-valley", doctorIds: ["d4"], rx: false, use: "Cleaning cuts and wounds", howToTake: "Mix with water before applying on skin." },
];

export const getCategory = (id: string) => categories.find((c) => c.id === id);
export const medicinesIn = (categoryId: string) => medicines.filter((m) => m.category === categoryId);

export const getHospital = (id: string) => hospitals.find((h) => h.id === id);
export const getMedicine = (id: string) => medicines.find((m) => m.id === id);
export const getDoctor = (id: string) => doctors.find((d) => d.id === id);
export const doctorsAt = (hospitalId: string) => doctors.filter((d) => d.hospitalId === hospitalId);
export const medicinesAt = (hospitalId: string) => medicines.filter((m) => m.hospitalId === hospitalId);

export const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;
