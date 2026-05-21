import { createServerFn } from "@tanstack/react-start";
import {
  connectDB,
  AdminUserModel,
  DoctorModel,
  HospitalInfoModel,
  GalleryModel,
  TestimonialModel,
  AppointmentModel,
  ServiceModel
} from "./db.ts";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { HOSPITAL } from "./hospital.ts";
import fs from "fs";
import path from "path";
import https from "https";


const JWT_SECRET = process.env.JWT_SECRET || "sudharshan-secret-key-123456";

// Static In-Memory Sandboxes for Offline Sandbox Operations
let inMemoryClinicInfo: any = {
  name: HOSPITAL.name,
  tagline: HOSPITAL.tagline,
  phone: HOSPITAL.phone,
  email: HOSPITAL.email,
  rating: HOSPITAL.rating,
  patients: HOSPITAL.patients,
  surgeries: HOSPITAL.surgeries,
  address: {
    full: HOSPITAL.address.full,
  },
};

let inMemoryDoctorInfo: any = {
  name: HOSPITAL.doctor,
  title: HOSPITAL.doctorTitle,
  bio: "Dr. Amit Pawar is an acclaimed Retina Specialist with over 15 years of surgical excellence in treating complex macular disorders, diabetic retinopathy, and retinal detachments. He is deeply committed to restoring and preserving vision using advanced surgical diagnostics.",
  experience: HOSPITAL.experience,
  specialization: "Premium Retina Specialist",
  image: "/dr-amit-pawar.jpg",
};

let inMemoryGallery: any[] = [
  { _id: "g1", src: "/retina-scan.jpg", alt: "Advanced Optical Retina Diagnostic Scan", category: "Equipment" },
  { _id: "g2", src: "/modern-lasers.jpg", alt: "Precision Laser Treatment Technology", category: "Equipment" },
  { _id: "g3", src: "/operating-theater.jpg", alt: "Sterile Modern Eye Microsurgery Suite", category: "Surgery" },
  { _id: "g4", src: "/clinic-lobby.jpg", alt: "Sudharshan Eye Hospital Premium Waiting Lobby", category: "Hospital" },
  { _id: "g5", src: "/consultation-room.jpg", alt: "Patient Consultation and Diagnosis Area", category: "Hospital" },
  { _id: "g6", src: "/optical-store.jpg", alt: "Premium Frames and Lenses Outlet", category: "Optical" },
];

let inMemoryTestimonials: any[] = [
  {
    _id: "t1",
    name: "Shivaji Patil",
    review: "Excellent retina treatment by Dr. Amit Pawar. My vision has significantly improved after the laser procedure. Extremely grateful for their modern approach.",
    rating: 5,
    date: "2 weeks ago",
  },
  {
    _id: "t2",
    name: "Dr. Sunita Deshmukh",
    review: "A world-class premium retina center right here in Kolhapur. The diagnostic equipment is state-of-the-art, and the staff treats patients with utmost dignity.",
    rating: 5,
    date: "1 month ago",
  },
  {
    _id: "t3",
    name: "Ramesh Kulkarni",
    review: "Highly professional doctors and clean hospital environment. The cataract surgery was completely painless, and the recovery was extremely rapid.",
    rating: 4,
    date: "3 weeks ago",
  },
];

let inMemoryAppointments: any[] = [];

let inMemoryServices: any[] = [
  { _id: "s1", slug: "retina", title: "Retina Treatment", desc: "Advanced care for diabetic retinopathy, macular degeneration, and retinal detachment.", iconName: "ScanEye", color: "from-blue-500 to-cyan-500" },
  { _id: "s2", slug: "cataract", title: "Cataract Surgery", desc: "Bladeless phaco surgery with premium IOL lenses for crystal-clear vision.", iconName: "Scissors", color: "from-cyan-500 to-sky-500" },
  { _id: "s3", slug: "lasik", title: "LASIK Consultation", desc: "Freedom from glasses with safe, precise laser vision correction.", iconName: "Zap", color: "from-indigo-500 to-blue-500" },
  { _id: "s4", slug: "pediatric", title: "Pediatric Eye Care", desc: "Specialized eye care, vision development and squint treatment for children.", iconName: "Baby", color: "from-sky-500 to-blue-500" },
  { _id: "s5", slug: "glaucoma", title: "Glaucoma Treatment", desc: "Early detection and lifelong management to protect your optic nerve.", iconName: "Droplets", color: "from-blue-600 to-indigo-500" },
  { _id: "s6", slug: "checkup", title: "Comprehensive Eye Checkup", desc: "Full diagnostic eye examination using modern equipment.", iconName: "Eye", color: "from-cyan-600 to-blue-500" },
  { _id: "s7", slug: "contact-lens", title: "Contact Lens Services", desc: "Soft, RGP, toric and multifocal lenses — fitted by experts.", iconName: "ContactIcon", color: "from-sky-600 to-cyan-500" },
  { _id: "s8", slug: "optical", title: "Optical Store", desc: "Premium designer frames, lenses and sunglasses in-house.", iconName: "Glasses", color: "from-blue-500 to-indigo-600" },
  { _id: "s9", slug: "diabetic-retina", title: "Diabetic Retina Care", desc: "Screening and treatment plans for diabetes-related vision changes.", iconName: "Activity", color: "from-cyan-500 to-blue-600" },
  { _id: "s10", slug: "vision-testing", title: "Vision Testing", desc: "Computerised refraction and detailed vision assessments.", iconName: "Stethoscope", color: "from-indigo-600 to-blue-500" },
];

// BSON/ObjectID Recursive Serializer to prevent TanStack Start / Seroval crashes
function serializeDoc(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(serializeDoc);
  }
  
  // If it is a mongoose document, convert it to a plain object first
  if (obj && typeof obj.toObject === "function") {
    obj = obj.toObject();
  }
  
  if (typeof obj === "object") {
    // If it's a MongoDB ObjectId instance
    if (obj.constructor && obj.constructor.name === "ObjectId") {
      return obj.toString();
    }
    // Also check standard toString signature for ObjectId
    if (obj._bsontype === "ObjectID" || (obj.toHexString && typeof obj.toHexString === "function")) {
      return obj.toString();
    }
    
    const newObj: any = {};
    for (const key of Object.keys(obj)) {
      newObj[key] = serializeDoc(obj[key]);
    }
    return newObj;
  }
  
  return obj;
}

// SECURE ADMINISTRATIVE LOGIN
export const loginAdmin = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: any }) => {
    const { username, password } = data;
    
    const dbConnected = await connectDB();
    if (!dbConnected) {
      // Offline fallback verification
      if (username === "admin" && (password === "admin123" || password === "sudharshan2026")) {
        const token = jwt.sign({ username: "admin", role: "admin" }, JWT_SECRET, { expiresIn: "4h" });
        return { success: true, token };
      }
      return { success: false, error: "Invalid credentials" };
    }

    try {
      const admin = await AdminUserModel.findOne({ username });
      if (!admin) {
        return { success: false, error: "Administrative profile not found" };
      }

      const match = await bcrypt.compare(password, admin.password);
      if (!match) {
        return { success: false, error: "Incorrect session password" };
      }

      const token = jwt.sign({ username: admin.username, role: "admin" }, JWT_SECRET, { expiresIn: "4h" });
      return { success: true, token };
    } catch (e: any) {
      return { success: false, error: e.message || "An authentication error occurred" };
    }
  });

// HOSPITAL INFO APIS
export const getClinicInfo = createServerFn({ method: "GET" })
  .handler(async () => {
    const dbConnected = await connectDB();
    if (!dbConnected) {
      return inMemoryClinicInfo;
    }
    try {
      const info = await HospitalInfoModel.findOne();
      return info ? serializeDoc(info) : inMemoryClinicInfo;
    } catch {
      return inMemoryClinicInfo;
    }
  });

export const updateClinicInfo = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: { token: string; data: any } }) => {
    try {
      const decoded = jwt.verify(data.token, JWT_SECRET) as any;
      if (!decoded || decoded.role !== "admin") {
        return { success: false, error: "Unauthorized access token" };
      }
    } catch {
      return { success: false, error: "Invalid session credentials" };
    }

    const dbConnected = await connectDB();
    if (!dbConnected) {
      inMemoryClinicInfo = { ...inMemoryClinicInfo, ...data.data };
      return { success: true, data: inMemoryClinicInfo };
    }

    try {
      let info = await HospitalInfoModel.findOne();
      if (!info) {
        info = new HospitalInfoModel(data.data);
      } else {
        Object.assign(info, data.data);
      }
      await info.save();
      return { success: true, data: serializeDoc(info) };
    } catch (e: any) {
      return { success: false, error: e.message || "Failed to write updates to Database" };
    }
  });

// DOCTOR BIOGRAPHY APIS
export const getDoctorInfo = createServerFn({ method: "GET" })
  .handler(async () => {
    const dbConnected = await connectDB();
    if (!dbConnected) {
      return inMemoryDoctorInfo;
    }
    try {
      const doc = await DoctorModel.findOne();
      return doc ? serializeDoc(doc) : inMemoryDoctorInfo;
    } catch {
      return inMemoryDoctorInfo;
    }
  });

export const updateDoctorInfo = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: { token: string; data: any } }) => {
    try {
      const decoded = jwt.verify(data.token, JWT_SECRET) as any;
      if (!decoded || decoded.role !== "admin") {
        return { success: false, error: "Unauthorized access token" };
      }
    } catch {
      return { success: false, error: "Invalid session credentials" };
    }

    const dbConnected = await connectDB();
    if (!dbConnected) {
      inMemoryDoctorInfo = { ...inMemoryDoctorInfo, ...data.data };
      return { success: true, data: inMemoryDoctorInfo };
    }

    try {
      let doc = await DoctorModel.findOne();
      if (!doc) {
        doc = new DoctorModel(data.data);
      } else {
        Object.assign(doc, data.data);
      }
      await doc.save();
      return { success: true, data: serializeDoc(doc) };
    } catch (e: any) {
      return { success: false, error: e.message || "Failed to update Doctor profile" };
    }
  });

// GALLERY SHOWCASE APIS
export const getGalleryItems = createServerFn({ method: "GET" })
  .handler(async () => {
    const dbConnected = await connectDB();
    if (!dbConnected) {
      return inMemoryGallery;
    }
    try {
      const items = await GalleryModel.find().lean();
      return items.length > 0 ? items.map((i: any) => ({ ...i, _id: i._id.toString() })) : inMemoryGallery;
    } catch {
      return inMemoryGallery;
    }
  });

export const saveGalleryItem = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: { token: string; item: any } }) => {
    try {
      const decoded = jwt.verify(data.token, JWT_SECRET) as any;
      if (!decoded || decoded.role !== "admin") {
        return { success: false, error: "Unauthorized access token" };
      }
    } catch {
      return { success: false, error: "Invalid session credentials" };
    }

    const dbConnected = await connectDB();
    if (!dbConnected) {
      const newItem = { _id: `gal-${Date.now()}`, ...data.item };
      inMemoryGallery.push(newItem);
      return { success: true, data: newItem };
    }

    try {
      const item = new GalleryModel(data.item);
      await item.save();
      const saved = item.toObject();
      return { success: true, data: { ...saved, _id: saved._id.toString() } };
    } catch (e: any) {
      return { success: false, error: e.message || "Failed to save gallery element" };
    }
  });

export const deleteGalleryItem = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: { token: string; id: string } }) => {
    try {
      const decoded = jwt.verify(data.token, JWT_SECRET) as any;
      if (!decoded || decoded.role !== "admin") {
        return { success: false, error: "Unauthorized access token" };
      }
    } catch {
      return { success: false, error: "Invalid session credentials" };
    }

    const dbConnected = await connectDB();
    if (!dbConnected) {
      inMemoryGallery = inMemoryGallery.filter((item) => item._id !== data.id);
      return { success: true };
    }

    try {
      await GalleryModel.findByIdAndDelete(data.id);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || "Failed to remove gallery element" };
    }
  });

// TESTIMONIAL APIS
export const getTestimonials = createServerFn({ method: "GET" })
  .handler(async () => {
    const dbConnected = await connectDB();
    if (!dbConnected) {
      return inMemoryTestimonials;
    }
    try {
      const testimonials = await TestimonialModel.find().lean();
      return testimonials.length > 0 ? testimonials.map((t: any) => ({ ...t, _id: t._id.toString() })) : inMemoryTestimonials;
    } catch {
      return inMemoryTestimonials;
    }
  });

export const saveTestimonial = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: { token: string; testimonial: any } }) => {
    try {
      const decoded = jwt.verify(data.token, JWT_SECRET) as any;
      if (!decoded || decoded.role !== "admin") {
        return { success: false, error: "Unauthorized access token" };
      }
    } catch {
      return { success: false, error: "Invalid session credentials" };
    }

    const dbConnected = await connectDB();
    if (!dbConnected) {
      const newT = { _id: `test-${Date.now()}`, ...data.testimonial };
      inMemoryTestimonials.push(newT);
      return { success: true, data: newT };
    }

    try {
      const t = new TestimonialModel(data.testimonial);
      await t.save();
      const saved = t.toObject();
      return { success: true, data: { ...saved, _id: saved._id.toString() } };
    } catch (e: any) {
      return { success: false, error: e.message || "Failed to create patient testimonial" };
    }
  });

export const deleteTestimonial = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: { token: string; id: string } }) => {
    try {
      const decoded = jwt.verify(data.token, JWT_SECRET) as any;
      if (!decoded || decoded.role !== "admin") {
        return { success: false, error: "Unauthorized access token" };
      }
    } catch {
      return { success: false, error: "Invalid session credentials" };
    }

    const dbConnected = await connectDB();
    if (!dbConnected) {
      inMemoryTestimonials = inMemoryTestimonials.filter((t) => t._id !== data.id);
      return { success: true };
    }

    try {
      await TestimonialModel.findByIdAndDelete(data.id);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || "Failed to delete testimonial" };
    }
  });

// APPOINTMENT REQUEST APIS
export const getAppointments = createServerFn({ method: "GET" })
  .handler(async ({ data: adminToken }: { data: string }) => {
    try {
      const decoded = jwt.verify(adminToken, JWT_SECRET) as any;
      if (!decoded || decoded.role !== "admin") {
        throw new Error("Unauthorized");
      }
    } catch {
      throw new Error("Unauthorized Session Context");
    }

    const dbConnected = await connectDB();
    if (!dbConnected) {
      return inMemoryAppointments;
    }
    try {
      const list = await AppointmentModel.find().sort({ createdAt: -1 }).lean();
      return list.map((a: any) => ({ ...a, _id: a._id.toString() }));
    } catch {
      return inMemoryAppointments;
    }
  });

export const saveAppointment = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: any }) => {
    const dbConnected = await connectDB();
    if (!dbConnected) {
      const newApp = { _id: `app-${Date.now()}`, ...data, status: "pending", createdAt: new Date() };
      inMemoryAppointments.unshift(newApp);
      return { success: true, data: newApp };
    }

    try {
      const app = new AppointmentModel(data);
      await app.save();
      const saved = app.toObject();
      return { success: true, data: { ...saved, _id: saved._id.toString() } };
    } catch (e: any) {
      return { success: false, error: e.message || "Failed to register appointment request" };
    }
  });

export const updateAppointmentStatus = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: { token: string; id: string; status: string } }) => {
    try {
      const decoded = jwt.verify(data.token, JWT_SECRET) as any;
      if (!decoded || decoded.role !== "admin") {
        return { success: false, error: "Unauthorized access token" };
      }
    } catch {
      return { success: false, error: "Invalid session credentials" };
    }

    const dbConnected = await connectDB();
    if (!dbConnected) {
      inMemoryAppointments = inMemoryAppointments.map((a) =>
        a._id === data.id ? { ...a, status: data.status } : a
      );
      return { success: true };
    }

    try {
      await AppointmentModel.findByIdAndUpdate(data.id, { status: data.status });
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || "Failed to update appointment status" };
    }
  });

export const deleteAppointment = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: { token: string; id: string } }) => {
    try {
      const decoded = jwt.verify(data.token, JWT_SECRET) as any;
      if (!decoded || decoded.role !== "admin") {
        return { success: false, error: "Unauthorized access token" };
      }
    } catch {
      return { success: false, error: "Invalid session credentials" };
    }

    const dbConnected = await connectDB();
    if (!dbConnected) {
      inMemoryAppointments = inMemoryAppointments.filter((a) => a._id !== data.id);
      return { success: true };
    }

    try {
      await AppointmentModel.findByIdAndDelete(data.id);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || "Failed to remove appointment entry" };
    }
  });

// SERVICES CRUD APIS
export const getServices = createServerFn({ method: "GET" })
  .handler(async () => {
    const dbConnected = await connectDB();
    if (!dbConnected) {
      return inMemoryServices;
    }
    try {
      const list = await ServiceModel.find().lean();
      return list.length > 0 ? list.map((s: any) => ({ ...s, _id: s._id.toString() })) : inMemoryServices;
    } catch {
      return inMemoryServices;
    }
  });

export const saveService = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: { token: string; service: any } }) => {
    try {
      const decoded = jwt.verify(data.token, JWT_SECRET) as any;
      if (!decoded || decoded.role !== "admin") {
        return { success: false, error: "Unauthorized access token" };
      }
    } catch {
      return { success: false, error: "Invalid session credentials" };
    }

    const dbConnected = await connectDB();
    if (!dbConnected) {
      if (data.service._id) {
        inMemoryServices = inMemoryServices.map((s) => s._id === data.service._id ? { ...s, ...data.service } : s);
        return { success: true, data: data.service };
      } else {
        const newS = { _id: `service-${Date.now()}`, ...data.service };
        inMemoryServices.push(newS);
        return { success: true, data: newS };
      }
    }

    try {
      if (data.service._id) {
        const updated = await ServiceModel.findByIdAndUpdate(data.service._id, data.service, { new: true }).lean();
        return { success: true, data: { ...updated, _id: updated._id.toString() } };
      } else {
        const service = new ServiceModel(data.service);
        await service.save();
        const saved = service.toObject();
        return { success: true, data: { ...saved, _id: saved._id.toString() } };
      }
    } catch (e: any) {
      return { success: false, error: e.message || "Failed to save eye service profile" };
    }
  });

export const deleteService = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: { token: string; id: string } }) => {
    try {
      const decoded = jwt.verify(data.token, JWT_SECRET) as any;
      if (!decoded || decoded.role !== "admin") {
        return { success: false, error: "Unauthorized access token" };
      }
    } catch {
      return { success: false, error: "Invalid session credentials" };
    }

    const dbConnected = await connectDB();
    if (!dbConnected) {
      inMemoryServices = inMemoryServices.filter((s) => s._id !== data.id);
      return { success: true };
    }

    try {
      await ServiceModel.findByIdAndDelete(data.id);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || "Failed to remove eye service profile" };
    }
  });

// SECURE DEVICE FILE UPLOADER WITH CLOUDINARY & LOCAL FILESYSTEM FALLBACK
export const uploadImage = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: { token: string; base64: string; filename: string } }) => {
    try {
      const decoded = jwt.verify(data.token, JWT_SECRET) as any;
      if (!decoded || decoded.role !== "admin") {
        return { success: false, error: "Unauthorized access token" };
      }
    } catch {
      return { success: false, error: "Invalid session credentials" };
    }

    const { base64, filename } = data;
    const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || "").replace(/['"]/g, "");
    const uploadPreset = (process.env.CLOUDINARY_UPLOAD_PRESET || "ml_default").replace(/['"]/g, "");

    // 1. Cloudinary upload if config is present
    if (cloudName) {
      try {
        const result = await new Promise<any>((resolve, reject) => {
          const postData = JSON.stringify({
            file: base64,
            upload_preset: uploadPreset,
          });

          const options = {
            hostname: "api.cloudinary.com",
            port: 443,
            path: `/v1_1/${cloudName}/image/upload`,
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Content-Length": Buffer.byteLength(postData),
            },
          };

          const req = https.request(options, (res) => {
            let body = "";
            res.on("data", (chunk) => (body += chunk));
            res.on("end", () => {
              try {
                const parsed = JSON.parse(body);
                if (parsed.secure_url) {
                  resolve(parsed);
                } else {
                  reject(new Error(parsed.error?.message || "Cloudinary upload failed"));
                }
              } catch (err) {
                reject(err);
              }
            });
          });

          req.on("error", (err) => reject(err));
          req.write(postData);
          req.end();
        });

        return { success: true, url: result.secure_url };
      } catch (err: any) {
        console.error("Cloudinary upload error, falling back locally:", err);
      }
    }

    // 2. High-performance offline local filesystem fallback
    try {
      const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      
      const dir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const fileExt = path.extname(filename) || ".jpg";
      const baseName = path.basename(filename, fileExt).replace(/[^a-zA-Z0-9]/g, "-");
      const uniqueFilename = `${Date.now()}-${baseName}${fileExt}`;
      
      fs.writeFileSync(path.join(dir, uniqueFilename), buffer);
      return { success: true, url: `/uploads/${uniqueFilename}` };
    } catch (e: any) {
      return { success: false, error: e.message || "Failed to save file to local system storage" };
    }
  });
