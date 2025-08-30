// lib/uploadToCloudinary.js
export const profile_pic_upload = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "profile_pic_upload");
  data.append("cloud_name", "dxrkttyvv"); // your cloud name

  const res = await fetch(`https://api.cloudinary.com/v1_1/dxrkttyvv/image/upload`, {
    method: "POST",
    body: data,
  });

  if (!res.ok) {
    throw new Error("Cloudinary upload failed");
  }

  const json = await res.json();
  return json.secure_url; // ✅ URL you can save in DB
};


export const project_upload = async (file) => {
  try {
    console.log("Starting Cloudinary upload for:", {
      name: file.name,
      size: file.size,
      type: file.type
    });

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "project_upload");
    data.append("cloud_name", "dxrkttyvv");

    const isVideo = file.type.startsWith("video/");
    const folder = isVideo ? "project_media/videos" : "project_media/images";
    data.append("folder", folder);

    // Add resource type for videos
    if (isVideo) {
      data.append("resource_type", "video");
    }

    const endpoint = isVideo
      ? `https://api.cloudinary.com/v1_1/dxrkttyvv/video/upload`
      : `https://api.cloudinary.com/v1_1/dxrkttyvv/image/upload`;

    console.log("Uploading to endpoint:", endpoint);

    const res = await fetch(endpoint, {
      method: "POST",
      body: data,
    });

    console.log("Response status:", res.status);
    console.log("Response headers:", Object.fromEntries(res.headers.entries()));

    if (!res.ok) {
      let errorMessage = `HTTP ${res.status}: ${res.statusText}`;
      
      try {
        const errorData = await res.json();
        console.error("Cloudinary Error Response:", errorData);
        
        if (errorData.error && errorData.error.message) {
          errorMessage = errorData.error.message;
        }
      } catch (parseError) {
        // If we can't parse JSON, try to get text
        try {
          const errorText = await res.text();
          console.error("Cloudinary Error Text:", errorText);
          if (errorText) {
            errorMessage = errorText;
          }
        } catch (textError) {
          console.error("Could not parse error response:", textError);
        }
      }
      
      throw new Error(errorMessage);
    }

    const json = await res.json();
    console.log("Upload successful:", json);
    
    if (!json.secure_url) {
      throw new Error("No secure_url in response");
    }
    
    return json.secure_url;
    
  } catch (error) {
    console.error("Upload error details:", error);
    
    // Re-throw with more context
    if (error.message.includes("Failed to fetch")) {
      throw new Error("Network error: Could not connect to Cloudinary. Check your internet connection.");
    } else if (error.message.includes("413")) {
      throw new Error("File too large for upload");
    } else if (error.message.includes("400")) {
      throw new Error("Bad request - check upload preset configuration");
    } else if (error.message.includes("401")) {
      throw new Error("Unauthorized - check your upload preset settings");
    } else {
      throw error; // Re-throw original error
    }
  }
};

