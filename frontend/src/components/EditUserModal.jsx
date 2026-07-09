import { useEffect, useState } from "react";

function EditUserModal({ isOpen, onClose, user, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    role: "",
    favorite_genres: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        age: user.age || "",
        gender: user.gender || "",
        role: user.role || "user",
        favorite_genres: user.favorite_genres
          ? user.favorite_genres.join(", ")
          : "",
      });
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = () => {
    onSave({
      ...formData,
      favorite_genres: formData.favorite_genres
        .split(",")
        .map((g) => g.trim())
        .filter((g) => g),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <div className="bg-white rounded-xl p-6 w-full max-w-lg">

        <h2 className="text-2xl font-bold mb-5">
          Edit User
        </h2>

        <div className="space-y-4">

          <input
            className="w-full border rounded-lg p-3"
            placeholder="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
          />

          <input
            className="w-full border rounded-lg p-3"
            type="number"
            placeholder="Age"
            value={formData.age}
            onChange={(e) =>
              setFormData({
                ...formData,
                age: e.target.value,
              })
            }
          />

          <select
            className="w-full border rounded-lg p-3"
            value={formData.gender}
            onChange={(e) =>
              setFormData({
                ...formData,
                gender: e.target.value,
              })
            }
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <select
            className="w-full border rounded-lg p-3"
            value={formData.role}
            onChange={(e) =>
              setFormData({
                ...formData,
                role: e.target.value,
              })
            }
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <input
            className="w-full border rounded-lg p-3"
            placeholder="Genres (comma separated)"
            value={formData.favorite_genres}
            onChange={(e) =>
              setFormData({
                ...formData,
                favorite_genres: e.target.value,
              })
            }
          />

        </div>

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Save Changes
          </button>

        </div>

      </div>

    </div>
  );
}

export default EditUserModal;