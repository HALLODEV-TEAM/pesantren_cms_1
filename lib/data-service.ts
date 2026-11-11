import fs from "fs";
import path from "path";
import { prisma } from "./prisma";
import {
  INITIAL_USER,
  INITIAL_PROFILE,
  INITIAL_BANNERS,
  INITIAL_ARTICLES,
  INITIAL_PROGRAMS,
  INITIAL_GALLERY,
  INITIAL_TESTIMONIALS,
  INITIAL_FAQS,
  INITIAL_REGISTRATIONS,
} from "./initial-data";

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "store.json");

export interface CategoryItem {
  id: number;
  name: string;
  type: "berita" | "faq" | "galeri";
}

const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: 1, name: "Berita Terbaru", type: "berita" },
  { id: 2, name: "Kegiatan Pondok", type: "berita" },
  { id: 3, name: "Wawasan", type: "berita" },
  { id: 4, name: "Pengumuman", type: "berita" },
  { id: 5, name: "Prestasi", type: "berita" },

  { id: 6, name: "Umum", type: "faq" },
  { id: 7, name: "Pendaftaran (PSB)", type: "faq" },
  { id: 8, name: "Biaya & Beasiswa", type: "faq" },
  { id: 9, name: "Kurikulum & Asrama", type: "faq" },
  { id: 10, name: "Kehidupan Pondok", type: "faq" },

  { id: 11, name: "Kegiatan", type: "galeri" },
  { id: 12, name: "Fasilitas", type: "galeri" },
  { id: 13, name: "Santri", type: "galeri" },
  { id: 14, name: "Prestasi", type: "galeri" },
];

interface DataStore {
  user: typeof INITIAL_USER;
  profile: typeof INITIAL_PROFILE;
  banners: typeof INITIAL_BANNERS;
  articles: typeof INITIAL_ARTICLES;
  programs: typeof INITIAL_PROGRAMS;
  gallery: typeof INITIAL_GALLERY;
  testimonials: typeof INITIAL_TESTIMONIALS;
  faqs: typeof INITIAL_FAQS;
  registrations: typeof INITIAL_REGISTRATIONS;
  categories: CategoryItem[];
}

function getInitialStore(): DataStore {
  return {
    user: { ...INITIAL_USER },
    profile: { ...INITIAL_PROFILE },
    banners: [...INITIAL_BANNERS],
    articles: [...INITIAL_ARTICLES],
    programs: [...INITIAL_PROGRAMS],
    gallery: [...INITIAL_GALLERY],
    testimonials: [...INITIAL_TESTIMONIALS],
    faqs: [...INITIAL_FAQS],
    registrations: [...INITIAL_REGISTRATIONS],
    categories: [...INITIAL_CATEGORIES],
  };
}

let memoryStore: DataStore | null = null;

function loadStore(): DataStore {
  if (memoryStore) return memoryStore;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(STORE_PATH)) {
      const init = getInitialStore();
      fs.writeFileSync(STORE_PATH, JSON.stringify(init, null, 2), "utf-8");
      memoryStore = init;
      return init;
    }
    const raw = fs.readFileSync(STORE_PATH, "utf-8");
    memoryStore = JSON.parse(raw);
    if (!memoryStore?.categories) {
      memoryStore!.categories = [...INITIAL_CATEGORIES];
      saveStore(memoryStore!);
    }
    return memoryStore!;
  } catch (err) {
    console.error("Error reading store.json, using initial store:", err);
    memoryStore = getInitialStore();
    return memoryStore;
  }
}

function saveStore(store: DataStore) {
  memoryStore = store;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving store.json:", err);
  }
}

// Check if database is reachable with 1.5s timeout
let isDbOnline: boolean | null = null;
let lastDbCheck = 0;

async function checkDatabaseOnline(): Promise<boolean> {
  // During build / prerender, use persistent local store to avoid network timeouts
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return false;
  }
  const now = typeof performance !== "undefined" ? performance.now() : 0;
  if (isDbOnline !== null && now - lastDbCheck < 60000) {
    return isDbOnline;
  }
  try {
    const timer = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("DB Timeout")), 1500),
    );
    await Promise.race([prisma.$queryRaw`SELECT 1`, timer]);
    isDbOnline = true;
    lastDbCheck = now;
    return true;
  } catch {
    isDbOnline = false;
    lastDbCheck = now;
    return false;
  }
}

// ----------------- PROFILE -----------------
export async function getProfile() {
  const dbOk = await checkDatabaseOnline();
  if (dbOk) {
    try {
      const p = await prisma.pesantrenProfile.findFirst();
      if (p) return p;
    } catch {}
  }
  return loadStore().profile;
}

export async function updateProfile(data: Partial<typeof INITIAL_PROFILE>) {
  const store = loadStore();
  store.profile = { ...store.profile, ...data };
  saveStore(store);

  const dbOk = await checkDatabaseOnline();
  if (dbOk) {
    try {
      await prisma.pesantrenProfile.upsert({
        where: { id: 1 },
        update: data,
        create: { ...store.profile, ...data },
      });
    } catch {}
  }
  return store.profile;
}

// ----------------- BANNERS -----------------
export async function getBanners() {
  const dbOk = await checkDatabaseOnline();
  if (dbOk) {
    try {
      const list = await prisma.banner.findMany({
        orderBy: { order: "asc" },
      });
      if (list && list.length > 0) return list;
    } catch {}
  }
  return loadStore().banners.sort((a, b) => a.order - b.order);
}

export async function createBanner(data: Omit<(typeof INITIAL_BANNERS)[0], "id">) {
  const store = loadStore();
  const nextId =
    store.banners.length > 0
      ? Math.max(...store.banners.map((b) => b.id)) + 1
      : 1;
  const newBanner = { ...data, id: nextId };
  store.banners.push(newBanner);
  saveStore(store);

  const dbOk = await checkDatabaseOnline();
  if (dbOk) {
    try {
      await prisma.banner.create({ data });
    } catch {}
  }
  return newBanner;
}

export async function updateBanner(
  id: number,
  data: Partial<(typeof INITIAL_BANNERS)[0]>,
) {
  const store = loadStore();
  const index = store.banners.findIndex((b) => b.id === id);
  if (index !== -1) {
    store.banners[index] = { ...store.banners[index], ...data };
    saveStore(store);
  }

  const dbOk = await checkDatabaseOnline();
  if (dbOk) {
    try {
      await prisma.banner.update({ where: { id }, data });
    } catch {}
  }
  return store.banners[index];
}

export async function deleteBanner(id: number) {
  const store = loadStore();
  store.banners = store.banners.filter((b) => b.id !== id);
  saveStore(store);

  const dbOk = await checkDatabaseOnline();
  if (dbOk) {
    try {
      await prisma.banner.delete({ where: { id } });
    } catch {}
  }
  return true;
}

// ----------------- ARTICLES -----------------
export async function getArticles(options?: {
  category?: string;
  search?: string;
  isFeatured?: boolean;
  limit?: number;
}) {
  const dbOk = await checkDatabaseOnline();
  if (dbOk) {
    try {
      const where: any = { isPublished: true };
      if (options?.category && options.category !== "Semua") {
        where.category = options.category;
      }
      if (options?.isFeatured !== undefined) {
        where.isFeatured = options.isFeatured;
      }
      if (options?.search) {
        where.OR = [
          { title: { contains: options.search } },
          { excerpt: { contains: options.search } },
        ];
      }
      const list = await prisma.article.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        take: options?.limit,
      });
      if (list && list.length > 0) return list;
    } catch {}
  }

  let list = [...loadStore().articles];
  if (options?.category && options.category !== "Semua") {
    list = list.filter((a) => a.category === options.category);
  }
  if (options?.isFeatured !== undefined) {
    list = list.filter((a) => a.isFeatured === options.isFeatured);
  }
  if (options?.search) {
    const q = options.search.toLowerCase();
    list = list.filter(
      (a) =>
        a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q),
    );
  }
  if (options?.limit) {
    list = list.slice(0, options.limit);
  }
  return list;
}

export async function getArticleBySlug(slug: string) {
  const dbOk = await checkDatabaseOnline();
  if (dbOk) {
    try {
      const art = await prisma.article.findUnique({ where: { slug } });
      if (art) {
        await prisma.article.update({
          where: { slug },
          data: { views: { increment: 1 } },
        });
        return art;
      }
    } catch {}
  }

  const store = loadStore();
  const art = store.articles.find((a) => a.slug === slug);
  if (art) {
    art.views = (art.views || 0) + 1;
    saveStore(store);
    return art;
  }
  return null;
}

export async function getArticleById(id: number) {
  const dbOk = await checkDatabaseOnline();
  if (dbOk) {
    try {
      const art = await prisma.article.findUnique({ where: { id } });
      if (art) return art;
    } catch {}
  }
  return loadStore().articles.find((a) => a.id === id) || null;
}

export async function createArticle(data: {
  title: string;
  slug?: string;
  category: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  author?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
}) {
  const slug =
    data.slug ||
    data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") +
      "-" +
      Math.floor(Math.random() * 1000);

  const store = loadStore();
  const nextId =
    store.articles.length > 0
      ? Math.max(...store.articles.map((a) => a.id)) + 1
      : 1;

  const newArticle = {
    id: nextId,
    title: data.title,
    slug,
    category: data.category || "Berita Terbaru",
    excerpt: data.excerpt,
    content: data.content,
    imageUrl: data.imageUrl,
    author: data.author || "Admin Pesantren",
    isPublished: data.isPublished !== undefined ? data.isPublished : true,
    isFeatured: !!data.isFeatured,
    views: 0,
    publishedAt: new Date().toISOString(),
  };

  store.articles.unshift(newArticle);
  saveStore(store);

  const dbOk = await checkDatabaseOnline();
  if (dbOk) {
    try {
      await prisma.article.create({
        data: {
          title: newArticle.title,
          slug: newArticle.slug,
          category: newArticle.category,
          excerpt: newArticle.excerpt,
          content: newArticle.content,
          imageUrl: newArticle.imageUrl,
          author: newArticle.author,
          isPublished: newArticle.isPublished,
          isFeatured: newArticle.isFeatured,
          views: 0,
        },
      });
    } catch {}
  }
  return newArticle;
}

export async function updateArticle(
  id: number,
  data: Partial<(typeof INITIAL_ARTICLES)[0]>,
) {
  const store = loadStore();
  const index = store.articles.findIndex((a) => a.id === id);
  if (index !== -1) {
    store.articles[index] = { ...store.articles[index], ...data };
    saveStore(store);
  }

  const dbOk = await checkDatabaseOnline();
  if (dbOk) {
    try {
      await prisma.article.update({
        where: { id },
        data: {
          title: data.title,
          slug: data.slug,
          category: data.category,
          excerpt: data.excerpt,
          content: data.content,
          imageUrl: data.imageUrl,
          author: data.author,
          isPublished: data.isPublished,
          isFeatured: data.isFeatured,
        },
      });
    } catch {}
  }
  return store.articles[index];
}

export async function deleteArticle(id: number) {
  const store = loadStore();
  store.articles = store.articles.filter((a) => a.id !== id);
  saveStore(store);

  const dbOk = await checkDatabaseOnline();
  if (dbOk) {
    try {
      await prisma.article.delete({ where: { id } });
    } catch {}
  }
  return true;
}

// ----------------- EDUCATION PROGRAMS -----------------
export async function getPrograms() {
  const dbOk = await checkDatabaseOnline();
  if (dbOk) {
    try {
      const list = await prisma.educationProgram.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      });
      if (list && list.length > 0) return list;
    } catch {}
  }
  return loadStore().programs.sort((a, b) => a.order - b.order);
}

export async function getProgramBySlug(slug: string) {
  const dbOk = await checkDatabaseOnline();
  if (dbOk) {
    try {
      const p = await prisma.educationProgram.findUnique({ where: { slug } });
      if (p) return p;
    } catch {}
  }
  return loadStore().programs.find((p) => p.slug === slug) || null;
}

export async function createProgram(data: Omit<(typeof INITIAL_PROGRAMS)[0], "id">) {
  const store = loadStore();
  const nextId =
    store.programs.length > 0
      ? Math.max(...store.programs.map((p) => p.id)) + 1
      : 1;
  const newProgram = { ...data, id: nextId };
  store.programs.push(newProgram);
  saveStore(store);

  const dbOk = await checkDatabaseOnline();
  if (dbOk) {
    try {
      await prisma.educationProgram.create({ data });
    } catch {}
  }
  return newProgram;
}

export async function updateProgram(
  id: number,
  data: Partial<(typeof INITIAL_PROGRAMS)[0]>,
) {
  const store = loadStore();
  const index = store.programs.findIndex((p) => p.id === id);
  if (index !== -1) {
    store.programs[index] = { ...store.programs[index], ...data };
    saveStore(store);
  }

  const dbOk = await checkDatabaseOnline();
  if (dbOk) {
    try {
      await prisma.educationProgram.update({ where: { id }, data });
    } catch {}
  }
  return store.programs[index];
}

export async function deleteProgram(id: number) {
  const store = loadStore();
  store.programs = store.programs.filter((p) => p.id !== id);
  saveStore(store);

  const dbOk = await checkDatabaseOnline();
  if (dbOk) {
    try {
      await prisma.educationProgram.delete({ where: { id } });
    } catch {}
  }
  return true;
}

// ----------------- GALLERY -----------------
export async function getGallery(category?: string) {
  const dbOk = await checkDatabaseOnline();
  if (dbOk) {
    try {
      const where = category && category !== "Semua" ? { category } : {};
      const list = await prisma.gallery.findMany({
        where,
        orderBy: { order: "asc" },
      });
      if (list && list.length > 0) return list;
    } catch {}
  }

  let list = loadStore().gallery.sort((a, b) => a.order - b.order);
  if (category && category !== "Semua") {
    list = list.filter((g) => g.category === category);
  }
  return list;
}

export async function createGalleryItem(
  data: Omit<(typeof INITIAL_GALLERY)[0], "id">,
) {
  const store = loadStore();
  const nextId =
    store.gallery.length > 0
      ? Math.max(...store.gallery.map((g) => g.id)) + 1
      : 1;
  const newItem = { ...data, id: nextId };
  store.gallery.push(newItem);
  saveStore(store);

  const dbOk = await checkDatabaseOnline();
  if (dbOk) {
    try {
      await prisma.gallery.create({ data });
    } catch {}
  }
  return newItem;
}

export async function deleteGalleryItem(id: number) {
  const store = loadStore();
  store.gallery = store.gallery.filter((g) => g.id !== id);
  saveStore(store);

  const dbOk = await checkDatabaseOnline();
  if (dbOk) {
    try {
      await prisma.gallery.delete({ where: { id } });
    } catch {}
  }
  return true;
}

// ----------------- TESTIMONIALS -----------------
export async function getTestimonials() {
  const dbOk = await checkDatabaseOnline();
  if (dbOk) {
    try {
      const list = await prisma.testimonial.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      });
      if (list && list.length > 0) return list;
    } catch {}
  }
  return loadStore().testimonials.filter((t) => t.isActive);
}

export async function createTestimonial(
  data: Omit<(typeof INITIAL_TESTIMONIALS)[0], "id">,
) {
  const store = loadStore();
  const nextId =
    store.testimonials.length > 0
      ? Math.max(...store.testimonials.map((t) => t.id)) + 1
      : 1;
  const newItem = { ...data, id: nextId };
  store.testimonials.push(newItem);
  saveStore(store);

  const dbOk = await checkDatabaseOnline();
  if (dbOk) {
    try {
      await prisma.testimonial.create({ data });
    } catch {}
  }
  return newItem;
}

export async function deleteTestimonial(id: number) {
  const store = loadStore();
  store.testimonials = store.testimonials.filter((t) => t.id !== id);
  saveStore(store);

  const dbOk = await checkDatabaseOnline();
  if (dbOk) {
    try {
      await prisma.testimonial.delete({ where: { id } });
    } catch {}
  }
  return true;
}

// ----------------- FAQS -----------------
export async function getFAQs(category?: string) {
  const dbOk = await checkDatabaseOnline();
  if (dbOk) {
    try {
      const where: any = { isActive: true };
      if (category && category !== "Semua") where.category = category;
      const list = await prisma.fAQ.findMany({
        where,
        orderBy: { order: "asc" },
      });
      if (list && list.length > 0) return list;
    } catch {}
  }

  let list = loadStore().faqs.sort((a, b) => a.order - b.order);
  if (category && category !== "Semua") {
    list = list.filter((f) => f.category === category);
  }
  return list;
}

export async function createFAQ(data: Omit<(typeof INITIAL_FAQS)[0], "id">) {
  const store = loadStore();
  const nextId =
    store.faqs.length > 0 ? Math.max(...store.faqs.map((f) => f.id)) + 1 : 1;
  const newItem = { ...data, id: nextId };
  store.faqs.push(newItem);
  saveStore(store);

  const dbOk = await checkDatabaseOnline();
  if (dbOk) {
    try {
      await prisma.fAQ.create({ data });
    } catch {}
  }
  return newItem;
}

export async function deleteFAQ(id: number) {
  const store = loadStore();
  store.faqs = store.faqs.filter((f) => f.id !== id);
  saveStore(store);

  const dbOk = await checkDatabaseOnline();
  if (dbOk) {
    try {
      await prisma.fAQ.delete({ where: { id } });
    } catch {}
  }
  return true;
}

// ----------------- REGISTRATIONS (PSB) -----------------
export async function getRegistrations(options?: {
  status?: string;
  search?: string;
}) {
  const dbOk = await checkDatabaseOnline();
  if (dbOk) {
    try {
      const where: any = {};
      if (options?.status && options.status !== "Semua") {
        where.status = options.status;
      }
      if (options?.search) {
        where.OR = [
          { fullName: { contains: options.search } },
          { registrationNumber: { contains: options.search } },
          { parentName: { contains: options.search } },
        ];
      }
      const list = await prisma.registration.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });
      if (list && list.length > 0) return list;
    } catch {}
  }

  let list = [...loadStore().registrations];
  if (options?.status && options.status !== "Semua") {
    list = list.filter((r) => r.status === options.status);
  }
  if (options?.search) {
    const q = options.search.toLowerCase();
    list = list.filter(
      (r) =>
        r.fullName.toLowerCase().includes(q) ||
        r.registrationNumber.toLowerCase().includes(q) ||
        r.parentName.toLowerCase().includes(q),
    );
  }
  return list;
}

export async function createRegistration(data: {
  fullName: string;
  gender: string;
  birthPlace: string;
  birthDate: string;
  programChoice: string;
  parentName: string;
  parentPhone: string;
  address: string;
  previousSchool: string;
  notes?: string;
}) {
  const store = loadStore();
  const count = store.registrations.length + 1;
  const regNumber = `PSB-2026-${String(count).padStart(3, "0")}`;

  const newItem = {
    id: count,
    registrationNumber: regNumber,
    ...data,
    birthDate: new Date(data.birthDate).toISOString(),
    status: "Menunggu Verifikasi",
    notes: data.notes || "",
    createdAt: new Date().toISOString(),
  };

  store.registrations.unshift(newItem);
  saveStore(store);

  const dbOk = await checkDatabaseOnline();
  if (dbOk) {
    try {
      await prisma.registration.create({
        data: {
          registrationNumber: regNumber,
          fullName: data.fullName,
          gender: data.gender,
          birthPlace: data.birthPlace,
          birthDate: new Date(data.birthDate),
          programChoice: data.programChoice,
          parentName: data.parentName,
          parentPhone: data.parentPhone,
          address: data.address,
          previousSchool: data.previousSchool,
          status: "Menunggu Verifikasi",
          notes: data.notes,
        },
      });
    } catch {}
  }
  return newItem;
}

export async function updateRegistrationStatus(
  id: number,
  status: string,
  notes?: string,
) {
  const store = loadStore();
  const item = store.registrations.find((r) => r.id === id);
  if (item) {
    item.status = status;
    if (notes !== undefined) item.notes = notes;
    saveStore(store);
  }

  const dbOk = await checkDatabaseOnline();
  if (dbOk) {
    try {
      await prisma.registration.update({
        where: { id },
        data: { status, ...(notes !== undefined ? { notes } : {}) },
      });
    } catch {}
  }
  return item;
}

export async function deleteRegistration(id: number) {
  const store = loadStore();
  store.registrations = store.registrations.filter((r) => r.id !== id);
  saveStore(store);

  const dbOk = await checkDatabaseOnline();
  if (dbOk) {
    try {
      await prisma.registration.delete({ where: { id } });
    } catch {}
  }
  return true;
}

// ----------------- DASHBOARD STATS -----------------
export async function getDashboardStats() {
  const store = loadStore();
  const totalArticles = store.articles.length;
  const totalPrograms = store.programs.length;
  const totalGallery = store.gallery.length;
  const totalRegistrations = store.registrations.length;
  const pendingRegistrations = store.registrations.filter(
    (r) => r.status === "Menunggu Verifikasi",
  ).length;
  const acceptedRegistrations = store.registrations.filter(
    (r) => r.status === "Lulus Seleksi",
  ).length;

  return {
    totalArticles,
    totalPrograms,
    totalGallery,
    totalRegistrations,
    pendingRegistrations,
    acceptedRegistrations,
    recentArticles: store.articles.slice(0, 5),
    recentRegistrations: store.registrations.slice(0, 5),
  };
}

// ----------------- MASTER CATEGORIES -----------------
export async function getCategories(type?: string): Promise<CategoryItem[]> {
  const store = loadStore();
  if (!store.categories) {
    store.categories = [...INITIAL_CATEGORIES];
    saveStore(store);
  }
  if (type) {
    return store.categories.filter((c) => c.type === type);
  }
  return store.categories;
}

export async function createCategory(data: {
  name: string;
  type: "berita" | "faq" | "galeri";
}): Promise<CategoryItem> {
  const store = loadStore();
  if (!store.categories) store.categories = [...INITIAL_CATEGORIES];
  const nextId =
    store.categories.length > 0
      ? Math.max(...store.categories.map((c) => c.id)) + 1
      : 1;
  const newCat: CategoryItem = {
    id: nextId,
    name: data.name.trim(),
    type: data.type,
  };
  store.categories.push(newCat);
  saveStore(store);
  return newCat;
}

export async function deleteCategory(id: number): Promise<boolean> {
  const store = loadStore();
  if (!store.categories) return false;
  store.categories = store.categories.filter((c) => c.id !== id);
  saveStore(store);
  return true;
}

