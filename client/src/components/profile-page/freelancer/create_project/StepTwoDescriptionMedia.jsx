import { useState } from "react";
import { Loader2, ImageUp, AlertCircle } from "lucide-react";
import { project_upload } from "../../../../lib/upload-helpers/uploadToCloudinary";
import toast from "react-hot-toast";

const StepTwoDescriptionMedia = ({ formData, handleChange, setFormData }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadError(null);

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError("File size must be less than 50MB");
      return;
    }

    setIsUploading(true);
    try {
      const uploadedUrl = await project_upload(file);

      // ✅ use setFormData from parent, fallback if not provided
      if (setFormData) {
        setFormData((prev) => ({ ...prev, media_url: uploadedUrl }));
      } else {
        handleChange({
          target: { name: "media_url", value: uploadedUrl },
        });
      }

      toast.success("Media uploaded successfully!");
    } catch (err) {
      setUploadError(err.message || "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Description */}
      <div className="form-control">
        <label className="label flex items-center justify-between mb-2">
          <span className="text-lg font-medium">
            Description <span className="text-error">*</span>
          </span>
          <span className="label-text-alt text-sm text-base-content/60">
            {formData.description.length}/500
          </span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the project details..."
          className="textarea textarea-bordered w-full h-40 resize-none text-lg"
          required
          maxLength={500}
        />
      </div>

      {/* Upload Media */}
      <div className="form-control">
        <label className="label flex justify-between">
          <span className="label-text text-lg font-medium">Upload Media</span>
          <span className="label-text-alt text-base-content/60">
            Optional (Max 50MB)
          </span>
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <label
          htmlFor="file-upload"
          className={`cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-3 text-lg font-medium rounded-lg border border-base-300 
            ${
              isUploading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-base-200 hover:bg-primary hover:text-white"
            }
          `}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <ImageUp className="w-5 h-5" />
              Upload project media
            </>
          )}
        </label>

        {/* Error */}
        {uploadError && (
          <div className="mt-2 p-3 bg-error/10 border border-error/20 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-error" />
            <p className="text-sm text-error">{uploadError}</p>
          </div>
        )}

        {/* Success */}
        {formData.media_url && !isUploading && !uploadError && (
          <div className="mt-2 p-3 bg-success/10 border border-success/20 rounded-lg">
            <p className="text-sm text-success truncate">
              ✅ Uploaded successfully: {formData.media_url}
            </p>
          </div>
        )}
      </div>

      {/* Manual URL */}
      <div className="form-control">
        <label className="label">
          <span className="label-text text-lg font-medium">
            Or paste Media URL
          </span>
        </label>
        <input
          type="url"
          name="media_url"
          className="input input-bordered h-13 p-3 w-full text-lg"
          placeholder="https://example.com/project-image.jpg"
          value={formData.media_url}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default StepTwoDescriptionMedia;
