import { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth";
import LocationPicker from "../../component/ComplaintMap";
import toast from "react-hot-toast";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

function CreateComplaint() {
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [position, setPosition] = useState(null);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);

const { fetchComplaints, dispatch } = useUser();
const navigate = useNavigate();

  const { user } = useAuth();
  const token = user?.token;

  // ✅ cleanup preview
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Max 5MB allowed ❗");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description.trim()) return toast.error("Enter description ❗");
    if (!latitude || !longitude) return toast.error("Select location ❗");
    if (!image) return toast.error("Upload image ❗");

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("description", description);
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);
      formData.append("image", image);

      const res = await fetch(
        "http://localhost:8080/api/citizen/submit_complaints",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) throw new Error();

      toast.success("Complaint submitted successfully ✅");
       dispatch({ type: "SET_PAGE", payload: 0 });  // reset to first page
    await fetchComplaints();
      // reset
      setDescription("");
      setLatitude("");
      setLongitude("");
      setPosition(null);
      setImage(null);
      setPreview(null);

    } catch {
      toast.error("Failed to submit complaint ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Complaint</h2>

      <form onSubmit={handleSubmit}>
        {/* DESCRIPTION */}
        <textarea
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* LOCATION */}
        <LocationPicker
          setLatitude={setLatitude}
          setLongitude={setLongitude}
          position={position}
          setPosition={setPosition}
        />

        <input
          type="number"
          placeholder="Latitude"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
        />

        <input
          type="number"
          placeholder="Longitude"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
        />

        {/* IMAGE UPLOAD */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        {/* PREVIEW */}
        {preview && (
          <div style={{ marginTop: "10px" }}>
            <img
              src={preview}
              alt="preview"
              style={{
                width: "220px",
                borderRadius: "10px",
                border: "1px solid #ddd",
              }}
            />
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default CreateComplaint;