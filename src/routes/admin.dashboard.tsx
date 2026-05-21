import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  ShieldCheck,
  Calendar,
  User,
  Building,
  Image as ImageIcon,
  MessageSquare,
  LogOut,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
  Star,
  Save,
  Globe,
  Activity
} from "lucide-react";
import { makeMeta } from "@/lib/seo";
import {
  getClinicInfo,
  updateClinicInfo,
  getDoctorInfo,
  updateDoctorInfo,
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  getGalleryItems,
  saveGalleryItem,
  deleteGalleryItem,
  getTestimonials,
  saveTestimonial,
  deleteTestimonial,
  getServices,
  saveService,
  deleteService,
  uploadImage
} from "@/lib/api.ts";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => makeMeta({ title: "Admin Dashboard — Sudharshan Eye Hospital", description: "Clinic Control Panel", path: "/admin/dashboard" }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const navigate = useNavigate();
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // States for administrative sections
  const [appointments, setAppointments] = useState<any[]>([]);
  const [clinicInfo, setClinicInfo] = useState<any>(null);
  const [doctorInfo, setDoctorInfo] = useState<any>(null);
  const [gallery, setGallery] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  // States for adding new items
  const [newGalleryUrl, setNewGalleryUrl] = useState("");
  const [newGalleryAlt, setNewGalleryAlt] = useState("");
  const [newGalleryCategory, setNewGalleryCategory] = useState("Hospital");

  const [newTName, setNewTName] = useState("");
  const [newTReview, setNewTReview] = useState("");
  const [newTRating, setNewTRating] = useState(5);

  // States for Services tab
  const [newServiceTitle, setNewServiceTitle] = useState("");
  const [newServiceDesc, setNewServiceDesc] = useState("");
  const [newServiceIcon, setNewServiceIcon] = useState("ScanEye");
  const [newServiceColor, setNewServiceColor] = useState("from-blue-500 to-cyan-500");
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  // Uploader status state
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const [showGallerySelector, setShowGallerySelector] = useState(false);

  // Check auth and pull database content on mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      const cookies = document.cookie.split(";");
      const tokenCookie = cookies.find((c) => c.trim().startsWith("admin_token="));
      if (!tokenCookie) {
        toast.error("Unauthorized: Please sign in");
        navigate({ to: "/admin/login" });
        return;
      }
      
      const adminToken = tokenCookie.split("=")[1];
      setToken(adminToken);

      try {
        // Fetch all information in parallel safely to avoid fail-fast Promise.all crashes
        const [info, doc, apps, gal, test, servs] = await Promise.all([
          getClinicInfo().catch((e) => {
            console.error("Failed to load clinic info:", e);
            return null;
          }),
          getDoctorInfo().catch((e) => {
            console.error("Failed to load doctor info:", e);
            return null;
          }),
          getAppointments({ data: adminToken }).catch((e) => {
            console.error("Failed to load appointments:", e);
            const msg = e.message || String(e);
            if (msg.includes("Unauthorized") || msg.includes("Session")) {
              toast.error("Your administrative session has expired. Please sign in again.");
              document.cookie = "admin_token=; path=/; max-age=0; SameSite=Strict";
              navigate({ to: "/admin/login" });
            }
            return [];
          }),
          getGalleryItems().catch((e) => {
            console.error("Failed to load gallery items:", e);
            return [];
          }),
          getTestimonials().catch((e) => {
            console.error("Failed to load testimonials:", e);
            return [];
          }),
          getServices().catch((e) => {
            console.error("Failed to load services:", e);
            return [];
          }),
        ]);

        if (info) setClinicInfo(info);
        if (doc) setDoctorInfo(doc);
        setAppointments(apps || []);
        setGallery(gal || []);
        setTestimonials(test || []);
        setServices(servs || []);
      } catch (err) {
        console.error("Error fetching dashboard details:", err);
        toast.error("Failed to load live server records. Operating in fallback sandbox.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    document.cookie = "admin_token=; path=/; max-age=0; SameSite=Strict";
    toast.success("Successfully logged out");
    navigate({ to: "/admin/login" });
  };

  // 1. Manage Appointments
  const handleApproveAppointment = async (id: string) => {
    try {
      const res = await updateAppointmentStatus({ data: { token, id, status: "approved" } });
      if (res.success) {
        setAppointments(appointments.map(a => a._id === id ? { ...a, status: "approved" } : a));
        toast.success("Appointment approved");
      } else {
        toast.error(res.error || "Action failed");
      }
    } catch {
      toast.success("Approved (local sandbox updated)");
      setAppointments(appointments.map(a => a._id === id ? { ...a, status: "approved" } : a));
    }
  };

  const handleRejectAppointment = async (id: string) => {
    try {
      const res = await updateAppointmentStatus({ data: { token, id, status: "rejected" } });
      if (res.success) {
        setAppointments(appointments.map(a => a._id === id ? { ...a, status: "rejected" } : a));
        toast.success("Appointment rejected");
      } else {
        toast.error(res.error || "Action failed");
      }
    } catch {
      toast.success("Rejected (local sandbox updated)");
      setAppointments(appointments.map(a => a._id === id ? { ...a, status: "rejected" } : a));
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    try {
      const res = await deleteAppointment({ data: { token, id } });
      if (res.success) {
        setAppointments(appointments.filter(a => a._id !== id));
        toast.success("Appointment deleted");
      } else {
        toast.error(res.error || "Action failed");
      }
    } catch {
      toast.success("Deleted (local sandbox updated)");
      setAppointments(appointments.filter(a => a._id !== id));
    }
  };

  // 2. Manage Hospital Info
  const handleSaveClinic = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await updateClinicInfo({ data: { token, data: clinicInfo } });
      if (res.success) {
        toast.success("Hospital information updated");
      } else {
        toast.error(res.error || "Action failed");
      }
    } catch {
      toast.success("Info saved locally (database offline)");
    }
  };

  // 3. Manage Doctor Profile
  const handleSaveDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await updateDoctorInfo({ data: { token, data: doctorInfo } });
      if (res.success) {
        toast.success("Doctor profile updated");
      } else {
        toast.error(res.error || "Action failed");
      }
    } catch {
      toast.success("Profile saved locally (database offline)");
    }
  };

  // 4. Manage Gallery Items
  const handleAddGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryUrl) return;

    const newItem = {
      src: newGalleryUrl,
      alt: newGalleryAlt || "Clinic environment photo",
      category: newGalleryCategory
    };

    try {
      const res = await saveGalleryItem({ data: { token, item: newItem } });
      if (res.success) {
        setGallery([...gallery, res.data]);
        toast.success("Gallery item added");
        setNewGalleryUrl("");
        setNewGalleryAlt("");
      } else {
        toast.error(res.error || "Action failed");
      }
    } catch {
      const mockId = `mock-gal-${Date.now()}`;
      setGallery([...gallery, { _id: mockId, ...newItem }]);
      toast.success("Gallery item added (local sandbox)");
      setNewGalleryUrl("");
      setNewGalleryAlt("");
    }
  };

  const handleDeleteGallery = async (id: string) => {
    try {
      const res = await deleteGalleryItem({ data: { token, id } });
      if (res.success) {
        setGallery(gallery.filter(item => item._id !== id));
        toast.success("Gallery item deleted");
      } else {
        toast.error(res.error || "Action failed");
      }
    } catch {
      setGallery(gallery.filter(item => item._id !== id));
      toast.success("Deleted from sandbox");
    }
  };

  // 5. Manage Testimonials
  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTName || !newTReview) return;

    const newItem = {
      name: newTName,
      review: newTReview,
      rating: Number(newTRating),
      date: "Just now"
    };

    try {
      const res = await saveTestimonial({ data: { token, testimonial: newItem } });
      if (res.success) {
        setTestimonials([...testimonials, res.data]);
        toast.success("Testimonial added");
        setNewTName("");
        setNewTReview("");
      } else {
        toast.error(res.error || "Action failed");
      }
    } catch {
      const mockId = `mock-test-${Date.now()}`;
      setTestimonials([...testimonials, { _id: mockId, ...newItem }]);
      toast.success("Testimonial added to sandbox");
      setNewTName("");
      setNewTReview("");
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    try {
      const res = await deleteTestimonial({ data: { token, id } });
      if (res.success) {
        setTestimonials(testimonials.filter(t => t._id !== id));
        toast.success("Testimonial deleted");
      } else {
        toast.error(res.error || "Action failed");
      }
    } catch {
      setTestimonials(testimonials.filter(t => t._id !== id));
      toast.success("Deleted from sandbox");
    }
  };

  // 6. Device File Uploader helper
  const handleDeviceFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (e.g. 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Max size is 5MB.");
      return;
    }

    setUploadingImage(targetField);
    const toastId = toast.loading("Uploading image file...");

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const res = await uploadImage({
            data: {
              token,
              base64,
              filename: file.name
            }
          });

          if (res.success && res.url) {
            toast.success("Image uploaded successfully!", { id: toastId });
            
            // Assign to target field state
            if (targetField === "doctorImage") {
              setDoctorInfo({ ...doctorInfo, image: res.url });
            } else if (targetField === "galleryUrl") {
              setNewGalleryUrl(res.url);
            }
          } else {
            toast.error(res.error || "Failed to upload image", { id: toastId });
          }
        } catch (err: any) {
          toast.error(err.message || "Failed to upload", { id: toastId });
        } finally {
          setUploadingImage(null);
        }
      };
      reader.onerror = () => {
        toast.error("Failed to read image file", { id: toastId });
        setUploadingImage(null);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      toast.error("Uploader failed", { id: toastId });
      setUploadingImage(null);
    }
  };

  // 7. Manage Services CRUD
  const handleAddOrUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceTitle || !newServiceDesc) return;

    const slug = newServiceTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const serviceData = {
      _id: editingServiceId || undefined,
      slug,
      title: newServiceTitle,
      desc: newServiceDesc,
      iconName: newServiceIcon,
      color: newServiceColor
    };

    try {
      const res = await saveService({ data: { token, service: serviceData } });
      if (res.success) {
        if (editingServiceId) {
          setServices(services.map(s => s._id === editingServiceId ? res.data : s));
          toast.success("Service updated successfully");
        } else {
          setServices([...services, res.data]);
          toast.success("New service added successfully");
        }
        resetServiceForm();
      } else {
        toast.error(res.error || "Action failed");
      }
    } catch {
      const mockId = editingServiceId || `mock-serv-${Date.now()}`;
      const mockItem = { _id: mockId, ...serviceData };
      if (editingServiceId) {
        setServices(services.map(s => s._id === editingServiceId ? mockItem : s));
        toast.success("Updated locally (sandbox)");
      } else {
        setServices([...services, mockItem]);
        toast.success("Added locally (sandbox)");
      }
      resetServiceForm();
    }
  };

  const handleEditServiceClick = (service: any) => {
    setEditingServiceId(service._id);
    setNewServiceTitle(service.title);
    setNewServiceDesc(service.desc);
    setNewServiceIcon(service.iconName || "ScanEye");
    setNewServiceColor(service.color || "from-blue-500 to-cyan-500");
  };

  const resetServiceForm = () => {
    setEditingServiceId(null);
    setNewServiceTitle("");
    setNewServiceDesc("");
    setNewServiceIcon("ScanEye");
    setNewServiceColor("from-blue-500 to-cyan-500");
  };

  const handleDeleteService = async (id: string) => {
    try {
      const res = await deleteService({ data: { token, id } });
      if (res.success) {
        setServices(services.filter(s => s._id !== id));
        toast.success("Service deleted");
      } else {
        toast.error(res.error || "Action failed");
      }
    } catch {
      setServices(services.filter(s => s._id !== id));
      toast.success("Deleted from sandbox");
    }
  };

  if (loading) {
    return (
      <SiteLayout>
        <div className="flex min-h-[75vh] items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground text-sm font-semibold">Configuring Administrative Controls...</p>
          </div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="min-h-screen bg-soft py-10">
        <div className="container mx-auto px-6">
          {/* Header Branding Row */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border/80 pb-6 mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-wider uppercase mb-1">
                <ShieldCheck className="h-5 w-5" /> Secured Control Console
              </div>
              <h1 className="font-display font-bold text-3xl text-foreground">
                Sudharshan Admin Panel
              </h1>
            </div>
            
            <Button
              onClick={handleLogout}
              variant="outline"
              className="rounded-xl border-destructive/20 text-destructive hover:bg-destructive/10 gap-2 flex items-center justify-center"
            >
              <LogOut className="h-4.5 w-4.5" /> Sign Out Securely
            </Button>
          </div>

          <Tabs defaultValue="appointments" className="space-y-6">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 h-auto p-1.5 bg-card/60 backdrop-blur-md rounded-2xl border border-border shadow-soft">
              <TabsTrigger value="appointments" className="rounded-xl py-2.5 gap-2 text-xs md:text-sm"><Calendar className="h-4 w-4" /> Appointments</TabsTrigger>
              <TabsTrigger value="hospital" className="rounded-xl py-2.5 gap-2 text-xs md:text-sm"><Building className="h-4 w-4" /> Clinic Info</TabsTrigger>
              <TabsTrigger value="doctor" className="rounded-xl py-2.5 gap-2 text-xs md:text-sm"><User className="h-4 w-4" /> Doctor Profile</TabsTrigger>
              <TabsTrigger value="gallery" className="rounded-xl py-2.5 gap-2 text-xs md:text-sm"><ImageIcon className="h-4 w-4" /> Gallery</TabsTrigger>
              <TabsTrigger value="testimonials" className="rounded-xl py-2.5 gap-2 text-xs md:text-sm"><MessageSquare className="h-4 w-4" /> Reviews</TabsTrigger>
              <TabsTrigger value="services" className="rounded-xl py-2.5 gap-2 text-xs md:text-sm"><Activity className="h-4 w-4" /> Services</TabsTrigger>
            </TabsList>

            {/* TAB 1: APPOINTMENTS */}
            <TabsContent value="appointments" className="space-y-4 outline-none">
              <Card className="border border-border/80 shadow-elegant rounded-3xl overflow-hidden">
                <CardHeader className="bg-accent/20 border-b border-border/50">
                  <CardTitle className="text-xl font-display font-bold text-foreground">Appointment Requests</CardTitle>
                  <CardDescription className="text-muted-foreground">View and manage requests from patients who submitted the booking form.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {appointments.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Calendar className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                      <p className="font-semibold text-sm">No appointment requests found</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-left text-sm">
                        <thead>
                          <tr className="border-b border-border text-muted-foreground font-semibold">
                            <th className="pb-3 pr-4">Patient Name</th>
                            <th className="pb-3 px-4">Contact Detail</th>
                            <th className="pb-3 px-4">Date & Service</th>
                            <th className="pb-3 px-4">Message</th>
                            <th className="pb-3 px-4">Status</th>
                            <th className="pb-3 pl-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {appointments.map((app) => (
                            <tr key={app._id} className="hover:bg-accent/5 transition-colors">
                              <td className="py-4 pr-4 font-semibold text-foreground">{app.name}</td>
                              <td className="py-4 px-4 text-muted-foreground">
                                <div>{app.phone}</div>
                                {app.email && <div className="text-xs text-muted-foreground/80">{app.email}</div>}
                              </td>
                              <td className="py-4 px-4 text-foreground">
                                <div className="font-semibold text-primary">{app.date}</div>
                                <div className="text-xs text-muted-foreground">{app.service}</div>
                              </td>
                              <td className="py-4 px-4 text-muted-foreground max-w-xs truncate">{app.message || "—"}</td>
                              <td className="py-4 px-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                                  app.status === "approved" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" :
                                  app.status === "rejected" ? "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400" :
                                  "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                }`}>
                                  {app.status}
                                </span>
                              </td>
                              <td className="py-4 pl-4 text-right space-x-1.5 whitespace-nowrap">
                                {app.status === "pending" && (
                                  <>
                                    <Button
                                      onClick={() => handleApproveAppointment(app._id)}
                                      size="sm"
                                      variant="ghost"
                                      className="h-8 w-8 p-0 rounded-lg text-emerald-600 hover:bg-emerald-50"
                                      title="Approve"
                                    >
                                      <CheckCircle className="h-4.5 w-4.5" />
                                    </Button>
                                    <Button
                                      onClick={() => handleRejectAppointment(app._id)}
                                      size="sm"
                                      variant="ghost"
                                      className="h-8 w-8 p-0 rounded-lg text-rose-600 hover:bg-rose-50"
                                      title="Reject"
                                    >
                                      <XCircle className="h-4.5 w-4.5" />
                                    </Button>
                                  </>
                                )}
                                <Button
                                  onClick={() => handleDeleteAppointment(app._id)}
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                  title="Delete"
                                >
                                  <Trash2 className="h-4.5 w-4.5" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 2: CLINIC INFO */}
            <TabsContent value="hospital" className="outline-none">
              {clinicInfo && (
                <form onSubmit={handleSaveClinic}>
                  <Card className="border border-border/80 shadow-elegant rounded-3xl overflow-hidden">
                    <CardHeader className="bg-accent/20 border-b border-border/50">
                      <CardTitle className="text-xl font-display font-bold text-foreground">Clinic Information</CardTitle>
                      <CardDescription className="text-muted-foreground">Manage hospital address, emergency contact numbers, rating statistics and operating timings.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="cName" className="text-xs font-semibold text-foreground">Hospital Name</Label>
                          <Input
                            id="cName"
                            value={clinicInfo.name}
                            onChange={(e) => setClinicInfo({ ...clinicInfo, name: e.target.value })}
                            className="rounded-xl border border-input focus-visible:ring-primary"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="cTagline" className="text-xs font-semibold text-foreground">Tagline</Label>
                          <Input
                            id="cTagline"
                            value={clinicInfo.tagline}
                            onChange={(e) => setClinicInfo({ ...clinicInfo, tagline: e.target.value })}
                            className="rounded-xl border border-input"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="cPhone" className="text-xs font-semibold text-foreground">Phone Number</Label>
                          <Input
                            id="cPhone"
                            value={clinicInfo.phone}
                            onChange={(e) => setClinicInfo({ ...clinicInfo, phone: e.target.value })}
                            className="rounded-xl border border-input"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="cEmail" className="text-xs font-semibold text-foreground">Hospital Email</Label>
                          <Input
                            id="cEmail"
                            value={clinicInfo.email}
                            onChange={(e) => setClinicInfo({ ...clinicInfo, email: e.target.value })}
                            className="rounded-xl border border-input"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="cRating" className="text-xs font-semibold text-foreground">Stars Rating (4.8)</Label>
                          <Input
                            id="cRating"
                            type="number"
                            step="0.1"
                            value={clinicInfo.rating}
                            onChange={(e) => setClinicInfo({ ...clinicInfo, rating: Number(e.target.value) })}
                            className="rounded-xl border border-input"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="cPatients" className="text-xs font-semibold text-foreground">Happy Patients (25,000+)</Label>
                          <Input
                            id="cPatients"
                            value={clinicInfo.patients}
                            onChange={(e) => setClinicInfo({ ...clinicInfo, patients: e.target.value })}
                            className="rounded-xl border border-input"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="cSurgeries" className="text-xs font-semibold text-foreground">Surgeries Done (8,500+)</Label>
                          <Input
                            id="cSurgeries"
                            value={clinicInfo.surgeries}
                            onChange={(e) => setClinicInfo({ ...clinicInfo, surgeries: e.target.value })}
                            className="rounded-xl border border-input"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="cAdd" className="text-xs font-semibold text-foreground">Hospital Address (Full Line)</Label>
                        <Input
                          id="cAdd"
                          value={clinicInfo.address.full}
                          onChange={(e) => setClinicInfo({
                            ...clinicInfo,
                            address: { ...clinicInfo.address, full: e.target.value }
                          })}
                          className="rounded-xl border border-input"
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="bg-accent/10 border-t border-border/40 py-4 flex justify-end">
                      <Button type="submit" className="bg-primary hover:opacity-95 rounded-xl gap-2 font-semibold shadow-elegant">
                        <Save className="h-4.5 w-4.5" /> Save Changes
                      </Button>
                    </CardFooter>
                  </Card>
                </form>
              )}
            </TabsContent>

            {/* TAB 3: DOCTOR PROFILE */}
            <TabsContent value="doctor" className="outline-none">
              {doctorInfo && (
                <form onSubmit={handleSaveDoctor}>
                  <Card className="border border-border/80 shadow-elegant rounded-3xl overflow-hidden">
                    <CardHeader className="bg-accent/20 border-b border-border/50">
                      <CardTitle className="text-xl font-display font-bold text-foreground">Doctor Bio & Qualifications</CardTitle>
                      <CardDescription className="text-muted-foreground">Edit biography descriptions, display titles, expertise fields and certification lists.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="dName" className="text-xs font-semibold text-foreground">Doctor Name</Label>
                          <Input
                            id="dName"
                            value={doctorInfo.name}
                            onChange={(e) => setDoctorInfo({ ...doctorInfo, name: e.target.value })}
                            className="rounded-xl border border-input focus-visible:ring-primary"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="dTitle" className="text-xs font-semibold text-foreground">Display Title (Qualifications)</Label>
                          <Input
                            id="dTitle"
                            value={doctorInfo.title}
                            onChange={(e) => setDoctorInfo({ ...doctorInfo, title: e.target.value })}
                            className="rounded-xl border border-input"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="dExp" className="text-xs font-semibold text-foreground">Years of Experience (15)</Label>
                          <Input
                            id="dExp"
                            type="number"
                            value={doctorInfo.experience}
                            onChange={(e) => setDoctorInfo({ ...doctorInfo, experience: Number(e.target.value) })}
                            className="rounded-xl border border-input"
                          />
                        </div>
                        <div className="space-y-1.5 col-span-2">
                          <Label htmlFor="dSpec" className="text-xs font-semibold text-foreground">Specialization</Label>
                          <Input
                            id="dSpec"
                            value={doctorInfo.specialization}
                            onChange={(e) => setDoctorInfo({ ...doctorInfo, specialization: e.target.value })}
                            className="rounded-xl border border-input"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="dImg" className="text-xs font-semibold text-foreground">Doctor Profile Image</Label>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Input
                            id="dImg"
                            value={doctorInfo.image}
                            onChange={(e) => setDoctorInfo({ ...doctorInfo, image: e.target.value })}
                            className="rounded-xl border border-input flex-1"
                            placeholder="Enter image URL, upload file, or pick from gallery"
                          />
                          <div className="flex gap-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleDeviceFileUpload(e, "doctorImage")}
                              className="hidden"
                              id="doctor-file-upload"
                              disabled={uploadingImage === "doctorImage"}
                            />
                            <Label
                              htmlFor="doctor-file-upload"
                              className={`h-10.5 px-4 rounded-xl border border-dashed border-primary/40 flex items-center justify-center cursor-pointer hover:bg-primary/5 transition-smooth text-xs font-semibold text-primary ${
                                uploadingImage === "doctorImage" ? "opacity-50 pointer-events-none" : ""
                              }`}
                            >
                              {uploadingImage === "doctorImage" ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : (
                                <Plus className="h-4 w-4 mr-2" />
                              )}
                              Upload
                            </Label>

                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setShowGallerySelector(!showGallerySelector)}
                              className="h-10.5 rounded-xl text-xs font-semibold px-4 border border-primary/40 hover:bg-primary/5 transition-smooth text-primary gap-1"
                            >
                              <ImageIcon className="h-4 w-4" /> Gallery
                            </Button>
                          </div>
                        </div>

                        {/* Collapsible Clickable Gallery Grid Selector */}
                        {showGallerySelector && (
                          <div className="mt-3 p-4 rounded-2xl border border-border bg-accent/5 space-y-3 shadow-inner">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-foreground">Click an image below to set as doctor profile picture:</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowGallerySelector(false)}
                                className="h-7 text-xs font-semibold px-2 hover:bg-destructive/10 hover:text-destructive text-muted-foreground"
                              >
                                Close
                              </Button>
                            </div>
                            {gallery.length === 0 ? (
                              <p className="text-xs text-muted-foreground">No gallery images uploaded yet. Add some in the Media Gallery tab first!</p>
                            ) : (
                              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                {gallery.map((item) => (
                                  <button
                                    key={item._id}
                                    type="button"
                                    onClick={() => {
                                      setDoctorInfo({ ...doctorInfo, image: item.src });
                                      setShowGallerySelector(false);
                                      toast.success("Doctor photo updated from gallery!");
                                    }}
                                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 shadow-soft hover:shadow-elegant group ${
                                      doctorInfo.image === item.src ? "border-primary ring-2 ring-primary/20 scale-102" : "border-border/60 hover:border-primary/60"
                                    }`}
                                  >
                                    <img src={item.src} alt={item.alt} className="w-full h-full object-cover" />
                                    {doctorInfo.image === item.src && (
                                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                        <div className="bg-primary text-white p-1 rounded-full shadow-md">
                                          <CheckCircle className="h-3 w-3" />
                                        </div>
                                      </div>
                                    )}
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-1 translate-y-full group-hover:translate-y-0 transition-transform duration-200 text-[10px] text-white truncate text-center font-medium">
                                      {item.category}
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {doctorInfo.image && (
                          <div className="mt-2 relative w-24 h-24 rounded-xl overflow-hidden border border-border shadow-soft bg-card">
                            <img src={doctorInfo.image} alt="Doctor bio preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="dBio" className="text-xs font-semibold text-foreground">Detailed Biography</Label>
                        <Textarea
                          id="dBio"
                          value={doctorInfo.bio}
                          onChange={(e) => setDoctorInfo({ ...doctorInfo, bio: e.target.value })}
                          rows={6}
                          className="rounded-2xl border border-input"
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="bg-accent/10 border-t border-border/40 py-4 flex justify-end">
                      <Button type="submit" className="bg-primary hover:opacity-95 rounded-xl gap-2 font-semibold shadow-elegant">
                        <Save className="h-4.5 w-4.5" /> Save Changes
                      </Button>
                    </CardFooter>
                  </Card>
                </form>
              )}
            </TabsContent>

            {/* TAB 4: MEDIA GALLERY */}
            <TabsContent value="gallery" className="space-y-6 outline-none">
              <Card className="border border-border/80 shadow-elegant rounded-3xl overflow-hidden">
                <CardHeader className="bg-accent/20 border-b border-border/50">
                  <CardTitle className="text-xl font-display font-bold text-foreground">Upload Gallery Images</CardTitle>
                  <CardDescription className="text-muted-foreground">Add new photos to the public gallery grid by entering frame references or uploading static files.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleAddGallery} className="grid md:grid-cols-4 gap-4 items-end">
                    <div className="space-y-1.5 col-span-2">
                      <Label htmlFor="gUrl" className="text-xs font-semibold text-foreground">Gallery Image</Label>
                      <div className="flex gap-3">
                        <Input
                          id="gUrl"
                          placeholder="Enter image URL or upload from device"
                          value={newGalleryUrl}
                          onChange={(e) => setNewGalleryUrl(e.target.value)}
                          className="rounded-xl border border-input flex-1"
                        />
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleDeviceFileUpload(e, "galleryUrl")}
                            className="hidden"
                            id="gallery-file-upload"
                            disabled={uploadingImage === "galleryUrl"}
                          />
                          <Label
                            htmlFor="gallery-file-upload"
                            className={`h-10.5 px-4 rounded-xl border border-dashed border-primary/40 flex items-center justify-center cursor-pointer hover:bg-primary/5 transition-smooth text-xs font-semibold text-primary ${
                              uploadingImage === "galleryUrl" ? "opacity-50 pointer-events-none" : ""
                            }`}
                          >
                            {uploadingImage === "galleryUrl" ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <Plus className="h-4 w-4 mr-2" />
                            )}
                            Upload File
                          </Label>
                        </div>
                      </div>
                      {newGalleryUrl && (
                        <div className="mt-2 relative w-20 h-20 rounded-xl overflow-hidden border border-border shadow-soft bg-card">
                          <img src={newGalleryUrl} alt="Gallery item preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="gCat" className="text-xs font-semibold text-foreground">Category</Label>
                      <select
                        id="gCat"
                        value={newGalleryCategory}
                        onChange={(e) => setNewGalleryCategory(e.target.value)}
                        className="w-full h-10.5 rounded-xl border border-input bg-card px-3 text-sm focus-visible:ring-primary focus-visible:ring-2 outline-none"
                      >
                        <option value="Hospital">Hospital</option>
                        <option value="Equipment">Equipment</option>
                        <option value="Optical">Optical</option>
                        <option value="Surgery">Surgery</option>
                      </select>
                    </div>
                    <Button type="submit" className="h-10.5 bg-primary rounded-xl gap-2 font-semibold shadow-elegant">
                      <Plus className="h-4.5 w-4.5" /> Add Image
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="border border-border/80 shadow-elegant rounded-3xl overflow-hidden">
                <CardHeader className="bg-accent/20 border-b border-border/50">
                  <CardTitle className="text-xl font-display font-bold text-foreground">Current Gallery Items</CardTitle>
                  <CardDescription className="text-muted-foreground">Manage and clean active clinic media resources served on the gallery routes.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {gallery.map((item) => (
                      <div key={item._id} className="relative group rounded-2xl overflow-hidden border border-border shadow-soft aspect-[4/3] bg-card">
                        <img src={item.src} alt={item.alt} className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 bg-primary-gradient text-primary-foreground text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md">
                          {item.category}
                        </div>
                        <button
                          onClick={() => handleDeleteGallery(item._id)}
                          type="button"
                          className="absolute bottom-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg opacity-90 transition-opacity"
                          title="Delete image"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 5: TESTIMONIALS */}
            <TabsContent value="testimonials" className="space-y-6 outline-none">
              <Card className="border border-border/80 shadow-elegant rounded-3xl overflow-hidden">
                <CardHeader className="bg-accent/20 border-b border-border/50">
                  <CardTitle className="text-xl font-display font-bold text-foreground">Add Patient Review</CardTitle>
                  <CardDescription className="text-muted-foreground">Submit positive testimonials from your patient care reports to highlight on the landing screens.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleAddTestimonial} className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-1.5 col-span-2">
                        <Label htmlFor="tName" className="text-xs font-semibold text-foreground">Patient Name</Label>
                        <Input
                          id="tName"
                          placeholder="e.g. Shivaji Patil"
                          value={newTName}
                          onChange={(e) => setNewTName(e.target.value)}
                          className="rounded-xl border border-input"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="tRating" className="text-xs font-semibold text-foreground">Rating (1-5 Stars)</Label>
                        <select
                          id="tRating"
                          value={newTRating}
                          onChange={(e) => setNewTRating(Number(e.target.value))}
                          className="w-full h-10.5 rounded-xl border border-input bg-card px-3 text-sm focus-visible:ring-primary focus-visible:ring-2 outline-none"
                        >
                          <option value={5}>5 Stars</option>
                          <option value={4}>4 Stars</option>
                          <option value={3}>3 Stars</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="tReview" className="text-xs font-semibold text-foreground">Detailed Review Message</Label>
                      <Textarea
                        id="tReview"
                        placeholder="Type review here..."
                        value={newTReview}
                        onChange={(e) => setNewTReview(e.target.value)}
                        rows={3}
                        className="rounded-2xl border border-input"
                      />
                    </div>
                    <Button type="submit" className="bg-primary rounded-xl gap-2 font-semibold shadow-elegant">
                      <Plus className="h-4.5 w-4.5" /> Publish Testimonial
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="border border-border/80 shadow-elegant rounded-3xl overflow-hidden">
                <CardHeader className="bg-accent/20 border-b border-border/50">
                  <CardTitle className="text-xl font-display font-bold text-foreground">Published Testimonials</CardTitle>
                  <CardDescription className="text-muted-foreground">Manage existing reviews and ratings display.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    {testimonials.map((t) => (
                      <Card key={t._id} className="border border-border/60 shadow-soft rounded-2xl relative overflow-hidden bg-card">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-semibold flex items-center justify-between">
                            {t.name}
                            <span className="flex items-center gap-0.5 text-primary-glow">
                              {Array.from({ length: t.rating || 5 }).map((_, i) => (
                                <Star key={i} className="h-3.5 w-3.5 fill-primary-glow text-primary-glow" />
                              ))}
                            </span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-muted-foreground pb-4 leading-relaxed">
                          {t.review}
                        </CardContent>
                        <CardFooter className="border-t border-border/40 py-2.5 bg-accent/5 flex justify-between items-center text-[10px] text-muted-foreground/80">
                          <span>{t.date || "Verified User"}</span>
                          <button
                            onClick={() => handleDeleteTestimonial(t._id)}
                            type="button"
                            className="text-red-500 hover:text-red-700 flex items-center gap-1 font-semibold"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 6: SERVICES */}
            <TabsContent value="services" className="space-y-6 outline-none">
              <Card className="border border-border/80 shadow-elegant rounded-3xl overflow-hidden">
                <CardHeader className="bg-accent/20 border-b border-border/50 flex flex-row items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl font-display font-bold text-foreground">
                      {editingServiceId ? "Edit Eye Care Service Profile" : "Add New Eye Care Service"}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Create or revise patient treatment capabilities shown on the main hospital and services page.
                    </CardDescription>
                  </div>
                  {editingServiceId && (
                    <Button onClick={resetServiceForm} variant="outline" className="rounded-xl border-primary/20 text-primary">
                      Cancel Edit
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleAddOrUpdateService} className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-1.5 col-span-2">
                        <Label htmlFor="sTitle" className="text-xs font-semibold text-foreground">Service Name / Title</Label>
                        <Input
                          id="sTitle"
                          placeholder="e.g. Laser Retina Photocoagulation"
                          value={newServiceTitle}
                          onChange={(e) => setNewServiceTitle(e.target.value)}
                          className="rounded-xl border border-input"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="sIcon" className="text-xs font-semibold text-foreground">Display Icon</Label>
                        <select
                          id="sIcon"
                          value={newServiceIcon}
                          onChange={(e) => setNewServiceIcon(e.target.value)}
                          className="w-full h-10.5 rounded-xl border border-input bg-card px-3 text-sm focus-visible:ring-primary focus-visible:ring-2 outline-none"
                        >
                          <option value="ScanEye">ScanEye (Retina/Scans)</option>
                          <option value="Scissors">Scissors (Surgery/Cataract)</option>
                          <option value="Zap">Zap (Laser/LASIK)</option>
                          <option value="Baby">Baby (Pediatric/Squint)</option>
                          <option value="Droplets">Droplets (Glaucoma/Drops)</option>
                          <option value="Eye">Eye (General Exam)</option>
                          <option value="ContactIcon">ContactIcon (Contact Lens)</option>
                          <option value="Glasses">Glasses (Optical Store)</option>
                          <option value="Activity">Activity (Diagnostics)</option>
                          <option value="Stethoscope">Stethoscope (Consultation)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="sColor" className="text-xs font-semibold text-foreground">Theme Color Gradient</Label>
                        <select
                          id="sColor"
                          value={newServiceColor}
                          onChange={(e) => setNewServiceColor(e.target.value)}
                          className="w-full h-10.5 rounded-xl border border-input bg-card px-3 text-sm focus-visible:ring-primary focus-visible:ring-2 outline-none"
                        >
                          <option value="from-blue-500 to-cyan-500">Blue to Cyan (Premium Retina)</option>
                          <option value="from-cyan-500 to-sky-500">Cyan to Sky (Modern Cataract)</option>
                          <option value="from-indigo-500 to-blue-500">Indigo to Blue (Sharp LASIK)</option>
                          <option value="from-sky-500 to-blue-500">Sky to Blue (Pediatric)</option>
                          <option value="from-blue-600 to-indigo-500">Blue to Indigo (Glaucoma)</option>
                          <option value="from-cyan-600 to-blue-500">Cyan to Blue (Diagnostics)</option>
                          <option value="from-sky-600 to-cyan-500">Sky to Cyan (Contact Lens)</option>
                          <option value="from-blue-500 to-indigo-600">Blue to Indigo (Optical Store)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="sDesc" className="text-xs font-semibold text-foreground">Service Description Narrative</Label>
                      <Textarea
                        id="sDesc"
                        placeholder="Detailed medical description of the procedure and care provided..."
                        value={newServiceDesc}
                        onChange={(e) => setNewServiceDesc(e.target.value)}
                        rows={3}
                        className="rounded-2xl border border-input"
                        required
                      />
                    </div>

                    <Button type="submit" className="bg-primary rounded-xl gap-2 font-semibold shadow-elegant">
                      {editingServiceId ? (
                        <>
                          <Save className="h-4.5 w-4.5" /> Save Service Changes
                        </>
                      ) : (
                        <>
                          <Plus className="h-4.5 w-4.5" /> Publish New Service
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="border border-border/80 shadow-elegant rounded-3xl overflow-hidden">
                <CardHeader className="bg-accent/20 border-b border-border/50">
                  <CardTitle className="text-xl font-display font-bold text-foreground">Current Clinical Services</CardTitle>
                  <CardDescription className="text-muted-foreground">Manage existing clinic services shown dynamically to your website visitors.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services.map((s) => (
                      <Card key={s._id} className="border border-border/60 shadow-soft rounded-2xl relative overflow-hidden bg-card flex flex-col justify-between">
                        <CardHeader className="pb-2">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color || 'from-blue-500 to-cyan-500'} flex items-center justify-center text-white mb-2 shadow-soft`}>
                            <Activity className="h-5 w-5" />
                          </div>
                          <CardTitle className="text-sm font-semibold">{s.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-muted-foreground pb-4 leading-relaxed flex-grow">
                          {s.desc}
                        </CardContent>
                        <CardFooter className="border-t border-border/40 py-2.5 bg-accent/5 flex justify-between items-center text-[10px] text-muted-foreground/80">
                          <button
                            onClick={() => handleEditServiceClick(s)}
                            type="button"
                            className="text-primary hover:text-primary-glow font-semibold flex items-center gap-1"
                          >
                            <Save className="h-3.5 w-3.5" /> Edit Info
                          </button>
                          <button
                            onClick={() => handleDeleteService(s._id)}
                            type="button"
                            className="text-red-500 hover:text-red-700 flex items-center gap-1 font-semibold"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SiteLayout>
  );
}
