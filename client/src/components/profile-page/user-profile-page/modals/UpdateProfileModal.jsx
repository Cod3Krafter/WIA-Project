import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CircleX, Loader2, ImageUp, AlertCircle } from "lucide-react";
import api from "../../../../lib/axios";
import toast from "react-hot-toast";
import { project_upload } from "../../../../lib/upload-helpers/uploadToCloudinary";

const UpdateProfileModal = ({ isOpen, onClose, user, onProfileUpdated }) => {
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    profile_picture: user?.profile_picture || "",
    whatsapp: user?.whatsapp || "",
    linkedin: user?.linkedin || "",
  });

  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadError(null);
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError("File size must be less than 10MB");
      return;
    }

    setIsUploading(true);
    try {
      const uploadedUrl = await project_upload(file);
      setFormData((prev) => ({ ...prev, profile_picture: uploadedUrl }));
      toast.success("Profile picture uploaded!");
    } catch (err) {
      setUploadError(err.message || "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      await api.put(`/users/${user.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Profile updated successfully");
      onProfileUpdated(formData);
      onClose();
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <dialog open className="modal modal-open">
          {/* Modal Box */}
          <motion.div
            className="modal-box relative px-10 py-12 max-w-2xl"
            initial={{ opacity: 0, scale: 0.9, y: -30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full p-1"
            >
              <CircleX className="size-9 text-gray-400 hover:text-red-400" />
            </button>

            <h2 className="text-2xl font-semibold mt-2">Update Profile</h2>

            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              {/* First + Last Name */}
              <div className="flex gap-4">
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="input h-13 input-bordered w-full text-lg"
                  required
                />
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="input h-13 input-bordered w-full text-lg"
                  required
                />
              </div>

              {/* Email */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg font-medium">
                    Email <span className="text-error">*</span>
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="input h-13 input-bordered w-full text-lg"
                  required
                />
              </div>

              {/* Bio */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg font-medium">Bio</span>
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  className="textarea textarea-bordered w-full text-lg h-30 resize-none"
                  maxLength={500}
                />
              </div>

              {/* Profile Picture Upload */}
              <div className="form-control">
                <label className="label flex justify-between">
                  <span className="label-text font-medium text-lg">
                    Profile Picture
                  </span>
                  <span className="label-text-alt text-sm text-base-content/60">
                    Max 10MB
                  </span>
                </label>

                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
                <label
                  htmlFor="profile-upload"
                  className={`cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-base-300 transition 
                  ${isUploading
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-base-200 hover:bg-primary hover:text-white"
                    }`}
                >
                  {isUploading ? (
                    <span>Uploading...</span>
                  ) : (
                    <>
                      <ImageUp className="w-5 h-5" />
                      Upload Profile Picture
                    </>
                  )}

                </label>

                {/* Upload Error */}
                {uploadError && (
                  <div className="mt-2 p-3 bg-error/10 border border-error/20 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-error" />
                    <p className="text-sm text-error">{uploadError}</p>
                  </div>
                )}

                {/* Preview */}
                {formData.profile_picture && !isUploading && !uploadError && (
                  <div className="mt-3 flex flex-col items-center gap-2">
                    <img
                      src={formData.profile_picture}
                      alt="Profile preview"
                      className="w-24 h-24 rounded-full object-cover border"
                    />
                    <p className="text-xs text-success">✅ Uploaded</p>
                  </div>
                )}

                {/* Manual URL */}
                <input
                  type="url"
                  name="profile_picture"
                  value={formData.profile_picture}
                  onChange={handleChange}
                  placeholder="Or paste image URL"
                  className="input h-13 input-bordered w-full mt-3"
                />
              </div>

              {/* WhatsApp & LinkedIn */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* WhatsApp */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-lg font-medium">WhatsApp</span>
                    </label>
                    <input
                      type="text"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="Enter WhatsApp number"
                      className="input h-13 input-bordered w-full text-lg"
                    />
                  </div>

                  {/* LinkedIn */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-lg font-medium">LinkedIn</span>
                    </label>
                    <input
                      type="text"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      placeholder="Enter LinkedIn profile URL"
                      className="input h-13 input-bordered w-full text-lg"
                    />
                  </div>
                </div>


              {/* Actions */}
              <div className="modal-action flex-col sm:flex-row justify-end gap-4 pt-4">
                <button
                  type="button"
                  className="px-8 py-4 text-white font-medium rounded-lg bg-primary hover:bg-black hover:transform-[scale(1.05)] hover:text-white transition-colors duration-200 focus:outline-none focus:transform-[scale(0.95)] focus:ring-offset-2"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-8 py-4 text-blue-600 font-medium rounded-lg bg-primary hover:bg-black hover:transform-[scale(1.05)] hover:text-white transition-colors duration-200 focus:outline-none focus:transform-[scale(0.95)] focus:ring-offset-2 ${loading ? "loading" : ""
                    }`}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Backdrop */}
          <motion.div
            className="modal-backdrop"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        </dialog>
      )}
    </AnimatePresence>
  );
};

export default UpdateProfileModal;
