import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { HOSPITAL } from "./hospital.ts";

// Manual env loader to resolve Server Function isolation context issues
try {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    envContent.split("\n").forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = match[2] || "";
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.substring(1, val.length - 1);
        } else if (val.startsWith("'") && val.endsWith("'")) {
          val = val.substring(1, val.length - 1);
        }
        process.env[key] = val;
      }
    });
  }
} catch (e) {
  console.warn("Could not manually load .env file:", e);
}

const MONGODB_URI = process.env.MONGODB_URI;

// Global mongoose connection caching for serverless environments
let isConnected = false;
let connectionPromise: Promise<boolean> | null = null;

export async function connectDB() {
  if (isConnected) {
    return true;
  }
  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
    if (!MONGODB_URI) {
      console.warn("MONGODB_URI is not set. Operating in offline static fallback mode.");
      return false;
    }

    try {
      // Configures quick timeouts (3s) to guarantee high responsiveness if MongoDB cluster is blocked
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 3000,
        connectTimeoutMS: 3000,
      });
      isConnected = true;
      console.log("MongoDB Database Connected Successfully");
      
      // Seed initial records if DB is blank
      await seedDatabase();
      return true;
    } catch (err) {
      console.error("MongoDB Connection Error: ", err);
      isConnected = false;
      connectionPromise = null; // reset promise so we can attempt reconnect later
      return false;
    }
  })();

  return connectionPromise;
}

// Model Schemas
const AdminUserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const DoctorSchema = new mongoose.Schema({
  name: String,
  title: String,
  bio: String,
  experience: Number,
  specialization: String,
  image: String,
});

const HospitalInfoSchema = new mongoose.Schema({
  name: String,
  tagline: String,
  phone: String,
  email: String,
  rating: Number,
  patients: String,
  surgeries: String,
  address: {
    full: String,
  },
});

const GallerySchema = new mongoose.Schema({
  src: String,
  alt: String,
  category: String,
});

const TestimonialSchema = new mongoose.Schema({
  name: String,
  review: String,
  rating: Number,
  date: String,
});

const AppointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: String,
  date: { type: String, required: true },
  service: { type: String, required: true },
  message: String,
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

const ServiceSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  iconName: { type: String, default: "ScanEye" },
  color: { type: String, default: "from-blue-500 to-cyan-500" },
});


// Register models safely with double-registration protection
export const AdminUserModel = mongoose.models.AdminUser || mongoose.model("AdminUser", AdminUserSchema);
export const DoctorModel = mongoose.models.Doctor || mongoose.model("Doctor", DoctorSchema);
export const HospitalInfoModel = mongoose.models.HospitalInfo || mongoose.model("HospitalInfo", HospitalInfoSchema);
export const GalleryModel = mongoose.models.Gallery || mongoose.model("Gallery", GallerySchema);
export const TestimonialModel = mongoose.models.Testimonial || mongoose.model("Testimonial", TestimonialSchema);
export const AppointmentModel = mongoose.models.Appointment || mongoose.model("Appointment", AppointmentSchema);
export const ServiceModel = mongoose.models.Service || mongoose.model("Service", ServiceSchema);

async function seedDatabase() {
  try {
    // 1. Seed Admin credentials
    const adminCount = await AdminUserModel.countDocuments();
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await AdminUserModel.create({
        username: "admin",
        password: hashedPassword,
      });
      console.log("Default admin account seeded (admin / admin123)");
    }

    // 2. Seed Clinic Details
    const clinicCount = await HospitalInfoModel.countDocuments();
    if (clinicCount === 0) {
      await HospitalInfoModel.create({
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
      });
      console.log("Clinic metadata details seeded");
    }

    // 3. Seed Doctor bio details
    const doctorCount = await DoctorModel.countDocuments();
    if (doctorCount === 0) {
      await DoctorModel.create({
        name: HOSPITAL.doctor,
        title: HOSPITAL.doctorTitle,
        bio: "Dr. Amit Pawar is an acclaimed Retina Specialist with over 15 years of surgical excellence in treating complex macular disorders, diabetic retinopathy, and retinal detachments. He is deeply committed to restoring and preserving vision using advanced surgical diagnostics.",
        experience: HOSPITAL.experience,
        specialization: "Premium Retina Specialist",
        image: "/dr-amit-pawar.jpg",
      });
      console.log("Doctor Amit Pawar profile seeded");
    }

    // 4. Seed Gallery items
    const galleryCount = await GalleryModel.countDocuments();
    if (galleryCount === 0) {
      await GalleryModel.insertMany([
        { src: "/retina-scan.jpg", alt: "Advanced Optical Retina Diagnostic Scan", category: "Equipment" },
        { src: "/modern-lasers.jpg", alt: "Precision Laser Treatment Technology", category: "Equipment" },
        { src: "/operating-theater.jpg", alt: "Sterile Modern Eye Microsurgery Suite", category: "Surgery" },
        { src: "/clinic-lobby.jpg", alt: "Sudharshan Eye Hospital Premium Waiting Lobby", category: "Hospital" },
        { src: "/consultation-room.jpg", alt: "Patient Consultation and Diagnosis Area", category: "Hospital" },
        { src: "/optical-store.jpg", alt: "Premium Frames and Lenses Outlet", category: "Optical" },
      ]);
      console.log("Gallery showcase images seeded");
    }

    // 5. Seed Testimonials
    const testimonialCount = await TestimonialModel.countDocuments();
    if (testimonialCount === 0) {
      await TestimonialModel.insertMany([
        {
          name: "Shivaji Patil",
          review: "Excellent retina treatment by Dr. Amit Pawar. My vision has significantly improved after the laser procedure. Extremely grateful for their modern approach.",
          rating: 5,
          date: "2 weeks ago",
        },
        {
          name: "Dr. Sunita Deshmukh",
          review: "A world-class premium retina center right here in Kolhapur. The diagnostic equipment is state-of-the-art, and the staff treats patients with utmost dignity.",
          rating: 5,
          date: "1 month ago",
        },
        {
          name: "Ramesh Kulkarni",
          review: "Highly professional doctors and clean hospital environment. The cataract surgery was completely painless, and the recovery was extremely rapid.",
          rating: 4,
          date: "3 weeks ago",
        },
      ]);
      console.log("Patient reviews and testimonials seeded");
    }

    // 6. Seed Services
    const serviceCount = await ServiceModel.countDocuments();
    if (serviceCount === 0) {
      await ServiceModel.insertMany([
        { slug: "retina", title: "Retina Treatment", desc: "Advanced care for diabetic retinopathy, macular degeneration, and retinal detachment.", iconName: "ScanEye", color: "from-blue-500 to-cyan-500" },
        { slug: "cataract", title: "Cataract Surgery", desc: "Bladeless phaco surgery with premium IOL lenses for crystal-clear vision.", iconName: "Scissors", color: "from-cyan-500 to-sky-500" },
        { slug: "lasik", title: "LASIK Consultation", desc: "Freedom from glasses with safe, precise laser vision correction.", iconName: "Zap", color: "from-indigo-500 to-blue-500" },
        { slug: "pediatric", title: "Pediatric Eye Care", desc: "Specialized eye care, vision development and squint treatment for children.", iconName: "Baby", color: "from-sky-500 to-blue-500" },
        { slug: "glaucoma", title: "Glaucoma Treatment", desc: "Early detection and lifelong management to protect your optic nerve.", iconName: "Droplets", color: "from-blue-600 to-indigo-500" },
        { slug: "checkup", title: "Comprehensive Eye Checkup", desc: "Full diagnostic eye examination using modern equipment.", iconName: "Eye", color: "from-cyan-600 to-blue-500" },
        { slug: "contact-lens", title: "Contact Lens Services", desc: "Soft, RGP, toric and multifocal lenses — fitted by experts.", iconName: "ContactIcon", color: "from-sky-600 to-cyan-500" },
        { slug: "optical", title: "Optical Store", desc: "Premium designer frames, lenses and sunglasses in-house.", iconName: "Glasses", color: "from-blue-500 to-indigo-600" },
        { slug: "diabetic-retina", title: "Diabetic Retina Care", desc: "Screening and treatment plans for diabetes-related vision changes.", iconName: "Activity", color: "from-cyan-500 to-blue-600" },
        { slug: "vision-testing", title: "Vision Testing", desc: "Computerised refraction and detailed vision assessments.", iconName: "Stethoscope", color: "from-indigo-600 to-blue-500" },
      ]);
      console.log("Services list seeded");
    }
  } catch (err) {
    console.error("Database Seeding Failed: ", err);
  }
}
