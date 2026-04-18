import { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth";
import LocationPicker from "../../component/ComplaintMap";
import toast from "react-hot-toast";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../api"; 

function CreateComplaint() {
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [position, setPosition] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);

  const { fetchComplaints, dispatch } = useUser();
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = user?.token;

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      return toast.error("Geolocation not supported");
    }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);
        setPosition({ lat, lng });
        toast.success("Location detected");
        setLocLoading(false);
      },
      () => {
        toast.error("Failed to get location");
        setLocLoading(false);
      }
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setDescription("");
    setLatitude("");
    setLongitude("");
    setPosition(null);
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return toast.error("Please enter a description");
    if (!latitude || !longitude) return toast.error("Please select a location");
    if (!image) return toast.error("Please upload an image");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("description", description);
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);
      formData.append("image", image);

      const res = await fetch(`${API_BASE_URL}/api/citizen/submit_complaints`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error();
      toast.success("Complaint submitted successfully");
      resetForm();
      dispatch({ type: "SET_PAGE", payload: 0 });
      fetchComplaints();
    } catch {
      toast.error("Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">File a Complaint</h1>
          <p className="text-gray-500 mt-1">
            Provide details and location to help us address your issue quickly.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 space-y-8"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📝 Description
            </label>
            <textarea
              placeholder="Describe the issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
              rows={5}
              disabled={loading}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                📍 Location
              </label>
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={locLoading || loading}
                className="text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1"
              >
                {locLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Detecting...
                  </>
                ) : (
                  <>
                    <span>📍</span> Use My Location
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-3">
              Or click anywhere on the map to select manually
            </p>
            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              <LocationPicker
                setLatitude={setLatitude}
                setLongitude={setLongitude}
                position={position}
                setPosition={setPosition}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <input
                type="number"
                placeholder="Latitude"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                disabled={loading}
              />
              <input
                type="number"
                placeholder="Longitude"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📷 Evidence Image
            </label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:bg-gray-50 transition">
              <span className="text-sm text-gray-500">
                Click to upload (Max 5MB)
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={loading}
              />
            </label>
            {preview && (
              <div className="mt-4">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-48 h-32 object-cover rounded-xl border border-gray-200"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Submitting...
              </>
            ) : (
              "Submit Complaint"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateComplaint;