"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPropertyAction, updatePropertyAction } from "@/lib/actions/admin";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Building2,
  MapPin,
  IndianRupee,
  Layers,
  Sparkles,
  Image as ImageIcon,
  Plus,
  Trash2,
  Save,
  Globe,
  Loader2,
  Star,
  CheckCircle2,
} from "lucide-react";
import {
  PropertyType,
  ListingCategory,
  FurnishingStatus,
  FacingDirection,
} from "@prisma/client";

export interface AdminPropertyFormData {
  id?: string;
  title: string;
  tagline?: string | null;
  description: string;
  propertyType: PropertyType;
  listingCategory?: ListingCategory;
  price: number | string | { toString(): string };
  pricePerSqFt?: number | string | { toString(): string } | null;
  priceOnRequest?: boolean;
  isNegotiable?: boolean;
  city: string;
  locality: string;
  subLocality?: string | null;
  landmark?: string | null;
  address: string;
  pincode: string;
  state?: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  balconies?: number | null;
  builtUpAreaSqFt?: number | string | { toString(): string } | null;
  carpetAreaSqFt?: number | string | { toString(): string } | null;
  plotAreaSqYards?: number | string | { toString(): string } | null;
  plotAreaCents?: number | string | { toString(): string } | null;
  facing?: FacingDirection | null;
  furnishing?: FurnishingStatus | null;
  floorNumber?: number | null;
  totalFloors?: number | null;
  ageOfProperty?: number | null;
  reraApproved?: boolean;
  reraNumber?: string | null;
  isFeatured?: boolean;
  isVerified?: boolean;
  assignedToId?: string | null;
  amenities?: unknown;
  images?: { url: string; altText?: string | null; caption?: string | null; isFeatured?: boolean }[];
  [key: string]: unknown;
}

interface PropertyFormProps {
  initialData?: AdminPropertyFormData;
  teamMembers?: { id: string; name: string; role: string }[];
  canPublish?: boolean;
}

const COMMON_AMENITIES = [
  "24/7 Security",
  "Car Parking",
  "Lift / Elevator",
  "100% Power Backup",
  "Clubhouse",
  "Gated Community",
  "Children Play Area",
  "Borewell & Municipal Water",
  "CCTV Surveillance",
  "Swimming Pool",
  "Gymnasium",
  "Vastu Compliant",
  "Intercom Facility",
  "Solar Fencing",
  "Underground Drainage",
  "Rainwater Harvesting",
];

const ANDHRA_CITIES = [
  "Guntur",
  "Vijayawada",
  "Amaravati",
  "Mangalagiri",
  "Tadepalli",
  "Tenali",
  "Narasaraopet",
  "Bapatla",
];

export function PropertyForm({
  initialData,
  teamMembers = [],
}: PropertyFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Form states
  const [title, setTitle] = useState(initialData?.title || "");
  const [tagline, setTagline] = useState(initialData?.tagline || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [propertyType, setPropertyType] = useState<PropertyType>(
    initialData?.propertyType || PropertyType.APARTMENT
  );
  const [listingCategory, setListingCategory] = useState<ListingCategory>(
    initialData?.listingCategory || ListingCategory.BUY_PROPERTY
  );

  // Pricing
  const [price, setPrice] = useState(initialData?.price ? String(initialData.price) : "");
  const [pricePerSqFt, setPricePerSqFt] = useState(
    initialData?.pricePerSqFt ? String(initialData.pricePerSqFt) : ""
  );
  const [priceOnRequest, setPriceOnRequest] = useState(initialData?.priceOnRequest || false);
  const [isNegotiable, setIsNegotiable] = useState(initialData?.isNegotiable || false);

  // Location
  const [city, setCity] = useState(initialData?.city || "Guntur");
  const [locality, setLocality] = useState(initialData?.locality || "");
  const [subLocality, setSubLocality] = useState(initialData?.subLocality || "");
  const [landmark, setLandmark] = useState(initialData?.landmark || "");
  const [address, setAddress] = useState(initialData?.address || "");
  const [pincode, setPincode] = useState(initialData?.pincode || "522002");
  const [state, setState] = useState(initialData?.state || "Andhra Pradesh");

  // Specifications
  const [bedrooms, setBedrooms] = useState(initialData?.bedrooms ? String(initialData.bedrooms) : "");
  const [bathrooms, setBathrooms] = useState(
    initialData?.bathrooms ? String(initialData.bathrooms) : ""
  );
  const [balconies, setBalconies] = useState(
    initialData?.balconies ? String(initialData.balconies) : ""
  );
  const [builtUpAreaSqFt, setBuiltUpAreaSqFt] = useState(
    initialData?.builtUpAreaSqFt ? String(initialData.builtUpAreaSqFt) : ""
  );
  const [carpetAreaSqFt, setCarpetAreaSqFt] = useState(
    initialData?.carpetAreaSqFt ? String(initialData.carpetAreaSqFt) : ""
  );
  const [plotAreaSqYards, setPlotAreaSqYards] = useState(
    initialData?.plotAreaSqYards ? String(initialData.plotAreaSqYards) : ""
  );
  const [plotAreaCents, setPlotAreaCents] = useState(
    initialData?.plotAreaCents ? String(initialData.plotAreaCents) : ""
  );
  const [facing, setFacing] = useState<FacingDirection | "">(initialData?.facing || "");
  const [furnishing, setFurnishing] = useState<FurnishingStatus | "">(
    initialData?.furnishing || FurnishingStatus.UNFURNISHED
  );
  const [floorNumber, setFloorNumber] = useState(
    initialData?.floorNumber !== null && initialData?.floorNumber !== undefined
      ? String(initialData.floorNumber)
      : ""
  );
  const [totalFloors, setTotalFloors] = useState(
    initialData?.totalFloors ? String(initialData.totalFloors) : ""
  );
  const [ageOfProperty, setAgeOfProperty] = useState(
    initialData?.ageOfProperty !== null && initialData?.ageOfProperty !== undefined
      ? String(initialData.ageOfProperty)
      : ""
  );
  const [reraApproved, setReraApproved] = useState(initialData?.reraApproved || false);
  const [reraNumber, setReraNumber] = useState(initialData?.reraNumber || "");

  // Badges & Assignment
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);
  const [isVerified, setIsVerified] = useState(initialData?.isVerified || false);
  const [assignedToId, setAssignedToId] = useState(initialData?.assignedToId || "");

  // Amenities
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    Array.isArray(initialData?.amenities) ? initialData.amenities : []
  );

  // Images list
  const [images, setImages] = useState<{ url: string; altText?: string; caption?: string; isFeatured: boolean }[]>(
    initialData?.images && initialData.images.length > 0
      ? initialData.images.map((img: { url: string; altText?: string | null; caption?: string | null; isFeatured?: boolean }) => ({
          url: img.url,
          altText: img.altText || "",
          caption: img.caption || "",
          isFeatured: img.isFeatured || false,
        }))
      : [
          {
            url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
            altText: "Primary Photo",
            isFeatured: true,
          },
        ]
  );
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to upload image.");
        }

        setImages((prev) => [
          ...prev,
          {
            url: data.url,
            altText: title || file.name.replace(/\.[^/.]+$/, ""),
            isFeatured: prev.length === 0,
          },
        ]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload image file.";
      setUploadError(msg);
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = "";
    }
  };

  const addImage = () => {
    if (!newImageUrl.trim()) return;
    setImages((prev) => [
      ...prev,
      { url: newImageUrl.trim(), altText: title || "Property image", isFeatured: prev.length === 0 },
    ]);
    setNewImageUrl("");
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      // Ensure at least one image remains featured if any images remain
      if (updated.length > 0 && !updated.some((img) => img.isFeatured)) {
        updated[0].isFeatured = true;
      }
      return updated;
    });
  };

  const setPrimaryImage = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({ ...img, isFeatured: i === index }))
    );
  };

  const handleSubmit = (workflowIntent: "SAVE_DRAFT" | "SUBMIT_APPROVAL" | "PUBLISH") => {
    setErrorMsg(null);
    setFieldErrors({});

    // MANDATORY Image Check
    if (images.length === 0) {
      setErrorMsg("Uploading at least 1 property photograph is MANDATORY. Please upload photos from your device or provide image URLs.");
      setFieldErrors({ images: ["At least one property image is required."] });
      return;
    }

    const payload = {
      title,
      tagline: tagline || null,
      description,
      propertyType,
      listingCategory,
      price: price ? parseFloat(price) : 0,
      pricePerSqFt: pricePerSqFt ? parseFloat(pricePerSqFt) : null,
      priceOnRequest,
      isNegotiable,
      city,
      locality,
      subLocality: subLocality || null,
      landmark: landmark || null,
      address,
      pincode,
      state,
      country: "India",
      bedrooms: bedrooms ? parseInt(bedrooms, 10) : null,
      bathrooms: bathrooms ? parseInt(bathrooms, 10) : null,
      balconies: balconies ? parseInt(balconies, 10) : null,
      builtUpAreaSqFt: builtUpAreaSqFt ? parseFloat(builtUpAreaSqFt) : null,
      carpetAreaSqFt: carpetAreaSqFt ? parseFloat(carpetAreaSqFt) : null,
      plotAreaSqYards: plotAreaSqYards ? parseFloat(plotAreaSqYards) : null,
      plotAreaCents: plotAreaCents ? parseFloat(plotAreaCents) : null,
      facing: facing || null,
      furnishing: furnishing || null,
      floorNumber: floorNumber ? parseInt(floorNumber, 10) : null,
      totalFloors: totalFloors ? parseInt(totalFloors, 10) : null,
      ageOfProperty: ageOfProperty ? parseInt(ageOfProperty, 10) : null,
      reraApproved,
      reraNumber: reraNumber || null,
      amenities: selectedAmenities,
      isFeatured,
      isVerified,
      assignedToId: assignedToId || null,
      images: images.map((img, idx) => ({
        url: img.url,
        altText: img.altText || title,
        caption: img.caption || null,
        isFeatured: img.isFeatured,
        orderIndex: idx,
      })),
    };

    startTransition(async () => {
      let result;
      if (initialData?.id) {
        result = await updatePropertyAction(
          initialData.id,
          payload,
          workflowIntent === "PUBLISH"
            ? "PUBLISH"
            : workflowIntent === "SUBMIT_APPROVAL"
            ? "SUBMIT_APPROVAL"
            : "SAVE"
        );
      } else {
        result = await createPropertyAction(payload, workflowIntent);
      }

      if (result.success) {
        router.push("/admin/properties");
        router.refresh();
      } else {
        setErrorMsg(result.message || "Operation failed.");
        if (result.errors) {
          setFieldErrors(result.errors);
        }
      }
    });
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {errorMsg && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs font-semibold text-rose-800">
          {errorMsg}
        </div>
      )}

      {/* Section 1: Basic Information */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="h-4 w-4 text-emerald-800" />
          1. Basic Property Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Property Title *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 3 BHK Luxury Gated Community Flat in Lakshmipuram"
              required
            />
            {fieldErrors.title && (
              <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.title[0]}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Marketing Tagline
            </label>
            <Input
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. 100% Vastu · Prime Location · Ready for Immediate Possession"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Property Type *
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value as PropertyType)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800"
            >
              {Object.values(PropertyType).map((type) => (
                <option key={type} value={type}>
                  {type.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Listing Category *
            </label>
            <select
              value={listingCategory}
              onChange={(e) => setListingCategory(e.target.value as ListingCategory)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800"
            >
              <option value="BUY_PROPERTY">For Sale (Buy Property)</option>
              <option value="RENT_LEASE">For Rent / Lease</option>
              <option value="SELL_PROPERTY">Owner Submission</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Detailed Property Description *
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Provide complete details including specifications, road width, accessibility, and documentation clarity."
              required
            />
            {fieldErrors.description && (
              <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.description[0]}</p>
            )}
          </div>
        </div>
      </div>

      {/* Section 2: Pricing */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <IndianRupee className="h-4 w-4 text-emerald-800" />
          2. Pricing & Negotiation
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Total Price (INR ₹) *
            </label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 7500000 (75 Lakhs)"
              disabled={priceOnRequest}
            />
            {fieldErrors.price && (
              <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.price[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Price per Sq.Ft (Optional ₹)
            </label>
            <Input
              type="number"
              value={pricePerSqFt}
              onChange={(e) => setPricePerSqFt(e.target.value)}
              placeholder="e.g. 4500"
            />
          </div>

          <div className="flex flex-col justify-end space-y-2 pb-1">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={priceOnRequest}
                onChange={(e) => setPriceOnRequest(e.target.checked)}
                className="rounded border-slate-300 text-emerald-800 focus:ring-emerald-800 h-4 w-4"
              />
              Display as &quot;Price on Request&quot;
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isNegotiable}
                onChange={(e) => setIsNegotiable(e.target.checked)}
                className="rounded border-slate-300 text-emerald-800 focus:ring-emerald-800 h-4 w-4"
              />
              Price is Negotiable
            </label>
          </div>
        </div>
      </div>

      {/* Section 3: Location */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-emerald-800" />
          3. Location & Address Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800"
            >
              {ANDHRA_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Locality / Area *
            </label>
            <Input
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              placeholder="e.g. Lakshmipuram, Brodipet, Benz Circle"
              required
            />
            {fieldErrors.locality && (
              <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.locality[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Sub-locality / Colony
            </label>
            <Input
              value={subLocality}
              onChange={(e) => setSubLocality(e.target.value)}
              placeholder="e.g. 4th Lane Main Road"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Landmark
            </label>
            <Input
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="e.g. Opposite Municipal Water Tank"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Physical Address *
            </label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Plot No 42, Near Municipal Park, Lakshmipuram"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Pincode *</label>
            <Input
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="e.g. 522002"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
            <Input
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="Andhra Pradesh"
            />
          </div>
        </div>
      </div>

      {/* Section 4: Specifications */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Layers className="h-4 w-4 text-emerald-800" />
          4. Property Specifications
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Bedrooms (BHK)</label>
            <Input
              type="number"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              placeholder="e.g. 3"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Bathrooms</label>
            <Input
              type="number"
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              placeholder="e.g. 3"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Balconies</label>
            <Input
              type="number"
              value={balconies}
              onChange={(e) => setBalconies(e.target.value)}
              placeholder="e.g. 2"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Built-Up Area (Sq.Ft)</label>
            <Input
              type="number"
              value={builtUpAreaSqFt}
              onChange={(e) => setBuiltUpAreaSqFt(e.target.value)}
              placeholder="e.g. 1850"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Carpet Area (Sq.Ft)</label>
            <Input
              type="number"
              value={carpetAreaSqFt}
              onChange={(e) => setCarpetAreaSqFt(e.target.value)}
              placeholder="e.g. 1500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Plot Area (Sq.Yards)</label>
            <Input
              type="number"
              value={plotAreaSqYards}
              onChange={(e) => setPlotAreaSqYards(e.target.value)}
              placeholder="e.g. 250"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Plot Area (Cents)</label>
            <Input
              type="number"
              value={plotAreaCents}
              onChange={(e) => setPlotAreaCents(e.target.value)}
              placeholder="e.g. 5.16"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Floor Number</label>
            <Input
              type="number"
              value={floorNumber}
              onChange={(e) => setFloorNumber(e.target.value)}
              placeholder="e.g. 3"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Total Floors</label>
            <Input
              type="number"
              value={totalFloors}
              onChange={(e) => setTotalFloors(e.target.value)}
              placeholder="e.g. 5"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Facing Direction</label>
            <select
              value={facing}
              onChange={(e) => setFacing(e.target.value as FacingDirection)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800"
            >
              <option value="">Select Direction</option>
              {Object.values(FacingDirection).map((f) => (
                <option key={f} value={f}>
                  {f.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Furnishing</label>
            <select
              value={furnishing}
              onChange={(e) => setFurnishing(e.target.value as FurnishingStatus)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800"
            >
              {Object.values(FurnishingStatus).map((fn) => (
                <option key={fn} value={fn}>
                  {fn.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Property Age (Years)</label>
            <Input
              type="number"
              value={ageOfProperty}
              onChange={(e) => setAgeOfProperty(e.target.value)}
              placeholder="0 for New"
            />
          </div>

          <div className="md:col-span-2 flex items-center gap-4 pt-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={reraApproved}
                onChange={(e) => setReraApproved(e.target.checked)}
                className="rounded border-slate-300 text-emerald-800 focus:ring-emerald-800 h-4 w-4"
              />
              AP RERA Approved
            </label>
            {reraApproved && (
              <Input
                value={reraNumber}
                onChange={(e) => setReraNumber(e.target.value)}
                placeholder="RERA Registration Number"
                className="text-xs max-w-xs"
              />
            )}
          </div>
        </div>
      </div>

      {/* Section 5: Amenities Checklist */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-800" />
          5. Amenities & Highlights
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {COMMON_AMENITIES.map((amenity) => {
            const isSelected = selectedAmenities.includes(amenity);
            return (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className={`flex items-center gap-2 rounded-xl p-2.5 text-xs font-medium text-left border transition-all ${
                  isSelected
                    ? "border-emerald-700 bg-emerald-50 text-emerald-900 font-bold"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <CheckCircle2
                  className={`h-3.5 w-3.5 shrink-0 ${
                    isSelected ? "text-emerald-700" : "text-slate-300"
                  }`}
                />
                <span className="truncate">{amenity}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 6: Photos & Media (MANDATORY) */}
      <div className={`bg-white rounded-2xl border p-6 shadow-xs space-y-4 ${
        images.length === 0 ? "border-amber-300 ring-2 ring-amber-400/20" : "border-slate-200"
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-emerald-800" />
            6. Property Photographs & Media
            <span className="text-rose-600 font-bold">*</span>
          </h2>
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
            images.length > 0 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
          }`}>
            {images.length > 0 ? `✓ ${images.length} Photo${images.length > 1 ? "s" : ""} Added` : "MANDATORY: Minimum 1 Image Required"}
          </span>
        </div>

        {uploadError && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs">
            {uploadError}
          </div>
        )}

        {/* Upload Controls: Direct File Upload & URL Input */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. Direct File Upload from Device */}
          <div className="rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 p-4 text-center hover:bg-emerald-50 transition-colors">
            <label className="cursor-pointer flex flex-col items-center justify-center gap-2">
              <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
                {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-900">
                  {isUploading ? "Uploading photographs..." : "Upload Photos from Device / Camera"}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Click or drag JPEG, PNG, WebP files (up to 5MB)
                </p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>

          {/* 2. Add via Image URL */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-col justify-center">
            <p className="text-xs font-bold text-slate-700 mb-2">Or Paste High-Resolution Image URL</p>
            <div className="flex gap-2">
              <Input
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="text-xs bg-white"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addImage}
                disabled={!newImageUrl.trim() || isUploading}
                className="shrink-0 text-xs"
              >
                Add URL
              </Button>
            </div>
          </div>
        </div>

        {/* Uploaded / Added Images Grid */}
        {images.length === 0 ? (
          <div className="py-6 text-center rounded-xl bg-amber-50/60 border border-dashed border-amber-300 p-4">
            <ImageIcon className="h-8 w-8 text-amber-500 mx-auto mb-1.5 opacity-80" />
            <p className="text-xs font-bold text-amber-900">No photographs uploaded yet.</p>
            <p className="text-[11px] text-amber-700 mt-0.5">
              At least one photograph is mandatory before saving as draft or publishing.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
            {images.map((img, idx) => (
              <div
                key={idx}
                className={`relative rounded-xl border overflow-hidden p-2 group bg-slate-50 transition-all ${
                  img.isFeatured ? "border-amber-400 ring-2 ring-amber-400/30" : "border-slate-200"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.altText || "Photo"}
                  className="h-24 w-full object-cover rounded-lg mb-2"
                />
                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setPrimaryImage(idx)}
                    className={`flex items-center gap-1 text-[10px] font-bold ${
                      img.isFeatured ? "text-amber-600" : "text-slate-400 hover:text-amber-600"
                    }`}
                  >
                    <Star className={`h-3 w-3 ${img.isFeatured ? "fill-current" : ""}`} />
                    {img.isFeatured ? "Primary" : "Set Primary"}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="Remove Image"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 7: Assignment & Badges */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">7. Internal Controls & Staff Assignment</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Assign to Staff Member
            </label>
            <select
              value={assignedToId}
              onChange={(e) => setAssignedToId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800"
            >
              <option value="">Unassigned</option>
              {teamMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.role.replace(/_/g, " ")})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4 pt-4 md:col-span-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded border-slate-300 text-emerald-800 focus:ring-emerald-800 h-4 w-4"
              />
              Show on Homepage Featured Section
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isVerified}
                onChange={(e) => setIsVerified(e.target.checked)}
                className="rounded border-slate-300 text-emerald-800 focus:ring-emerald-800 h-4 w-4"
              />
              Mark as Verified Listing
            </label>
          </div>
        </div>
      </div>

      {/* Form Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
          className="text-xs"
        >
          Cancel
        </Button>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSubmit("SAVE_DRAFT")}
            disabled={isPending}
            className="text-xs gap-1.5"
          >
            {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Save as Draft
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={() => handleSubmit("PUBLISH")}
            disabled={isPending}
            className="text-xs gap-1.5 font-bold shadow-sm"
          >
            {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Globe className="h-3.5 w-3.5" />}
            Publish Now (Live)
          </Button>
        </div>
      </div>
    </div>
  );
}
