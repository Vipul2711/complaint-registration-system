import { useEffect, useMemo, useState } from "react";
import { useAdmin } from "../../context/useAdmin";
import { useNavigate } from "react-router-dom";

function ViewDepartments() {
  const { departments, fetchDepartments } = useAdmin();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const safeDepartments = Array.isArray(departments) ? departments : [];

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return safeDepartments.filter((d) =>
      (d?.name || "").toLowerCase().includes(query)
    );
  }, [safeDepartments, search]);

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Departments
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and view all government departments.
          </p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search departments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
          <span className="text-sm text-gray-500">
            {filtered.length} {filtered.length === 1 ? "result" : "results"}
          </span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">
                  ID
                </th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">
                  Department Name
                </th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filtered.length > 0 ? (
                filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-700 font-mono">
                      {d.id}
                    </td>
                    <td
                      className="px-6 py-4 text-blue-600 font-medium cursor-pointer hover:underline"
                      onClick={() =>
                        navigate(`/admin/departments/${d.id}`, {
                          state: { name: d.name },
                        })
                      }
                    >
                      {d.name}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          navigate(`/admin/departments/${d.id}`, {
                            state: { name: d.name },
                          })
                        }
                        className="text-sm text-gray-600 hover:text-blue-600 font-medium transition"
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    <div className="text-4xl mb-3">📭</div>
                    <p className="font-medium">No departments found</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Try adjusting your search.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default ViewDepartments;