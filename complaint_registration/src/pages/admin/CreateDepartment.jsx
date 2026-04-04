import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import Toast from "../../component/Toast";

function CreateDepartment() {
  const [form, setForm] = useState({
    departmentName: "",
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const { user } = useAuth();
  const token = user?.token;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.departmentName || !form.username || !form.email || !form.password) {
      setToast("All fields required ❌");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:8080/api/admin/createdepartment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) throw new Error();

      setToast("Department Created ✅");

      setForm({
        departmentName: "",
        username: "",
        email: "",
        password: "",
      });
    } catch {
      setToast("Error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create Department</h2>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <form onSubmit={handleSubmit}>
        <input name="departmentName" placeholder="Department Name" value={form.departmentName} onChange={handleChange} />
        <input name="username" placeholder="Username" value={form.username} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />

        <button disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
}

export default CreateDepartment;