import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Camera } from "lucide-react";
import FormField from "./FormField";
import { profile_pic_upload } from "../../../lib/upload-helpers/uploadToCloudinary";
import RegFormNav from "./RegFormNav";

// helper: crop image into a Blob
const getCroppedImg = async (imageSrc, crop, zoom, aspect) => {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => (image.onload = resolve));

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const naturalWidth = image.naturalWidth;
  const naturalHeight = image.naturalHeight;

  const { x, y, width, height } = crop;
  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(
    image,
    x * (naturalWidth / image.width),
    y * (naturalHeight / image.height),
    width * (naturalWidth / image.width),
    height * (naturalHeight / image.height),
    0,
    0,
    width,
    height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, "image/jpeg");
  });
};

const StepFour = ({ 
  values, 
  errors, 
  touched, 
  setFieldValue, 
  isSubmitting, 
  onPrevious 
}) => {
  const [uploading, setUploading] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropConfirm = async () => {
    try {
      setUploading(true);
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels, zoom, 1);
      const croppedFile = new File([croppedBlob], "profile.jpg", { type: "image/jpeg" });
      const url = await profile_pic_upload(croppedFile);
      setFieldValue("profile_picture", url);
    } catch (err) {
      console.error("Crop/Upload error:", err);
    } finally {
      setUploading(false);
      setCropModalOpen(false);
    }
  };

const isValid = true;


  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="flex justify-center p-1">
        <span className="px-5 py-1 text-lg font-extralight not-italic text-gray-100 bg-primary/40 rounded-xl">Upload profile picture</span>
      </div>
      <FormField
        error={errors.profile_picture}
        touched={touched.profile_picture}
      >
        <div className="flex flex-col items-center space-y-6">
          {values.profile_picture ? (
            <div className="relative">
              <img
                src={values.profile_picture}
                alt="Profile preview"
                className="size-40 object-cover rounded-full border-4 border-gray-200 shadow-lg"
              />
              <button
                type="button"
                onClick={() => setFieldValue("profile_picture", "")}
                className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
          ) : (
            <div className="size-40 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center bg-gray-200">
              <Camera className="size-20 text-gray-400" />
            </div>
          )}
          
          <label className="cursor-pointer">
            <span className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-lg rounded-lg transition-colors font-medium">
              {uploading ? "Uploading..." : (
                <>
                  <Camera className="size-6 mr-2" />
                  Choose Photo
                </>
              )}
            </span>
            <input
              id="profile_picture"
              name="profile_picture"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="sr-only"
            />
          </label>
          
          <p className="text-lg text-gray-400 text-center">
            Optional: Add a photo to personalize your profile
          </p>
        </div>
      </FormField>

      {/* Crop Modal */}
      {cropModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-300 p-6 flex flex-col items-center w-[340px]">
            <div className="mb-2 text-lg font-semibold text-gray-700 text-center rounded-full bg-gray-100 px-4 py-2 shadow">
              Crop your profile photo
            </div>
            <div className="relative w-[280px] h-[280px] bg-black rounded-xl overflow-hidden border border-gray-200">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                cropShape="round"
                showGrid={false}
              />
            </div>
            <div className="w-full flex flex-col items-center mt-4">
              <label className="text-xs text-gray-500 mb-1">Zoom</label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={e => setZoom(Number(e.target.value))}
                className="w-3/4 accent-blue-500"
              />
            </div>
            <div className="flex gap-4 mt-6">
              <Button onClick={() => setCropModalOpen(false)} variant="outline">
                Cancel
              </Button>
              <Button onClick={handleCropConfirm} disabled={uploading}>
                {uploading ? "Saving..." : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      )}

       <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          className="flex-1 h-13 text-lg border-2 border-gray-200 hover:border-gray-300 rounded-xl font-semibold"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 h-13 text-lg bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:hover:scale-100"
        >
          {isSubmitting && isValid ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Creating Account...
            </>
          ) : (
            <>
              <Check className="mr-2 h-5 w-5" />
              Create Account
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default StepFour;
