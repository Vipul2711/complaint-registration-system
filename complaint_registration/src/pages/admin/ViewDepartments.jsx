import { useEffect, useState } from "react";
import { useAdmin } from "../../context/useAdmin";
import { useNavigate } from "react-router-dom";

function ViewDepartments() {
  const { departments, fetchDepartments } = useAdmin();
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const filtered = departments.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Departments</h2>

      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table border="1">
        <tbody>
          {filtered.map((d) => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td
                style={{ cursor: "pointer", color: "blue" }}
                onClick={() =>
                  navigate(`/admin/departments/${d.id}`, {
                    state: { name: d.name },
                  })
                }
              >
                {d.name}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewDepartments;