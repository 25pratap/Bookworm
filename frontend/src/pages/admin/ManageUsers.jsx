import { useEffect, useState } from "react";
import UserSearch from "../../components/UserSearch";
import UserTable from "../../components/UserTable";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import { toast } from "react-toastify";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const currentEmail = localStorage.getItem("email");

  // modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // ---------------- Load Users ----------------
  const loadUsers = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:8000/users");
      if (!res.ok) throw new Error("Failed to load users");

      const data = await res.json();
      setUsers(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // reset page on search
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // ---------------- Filter ----------------
  const filteredUsers = users.filter((user) => {
    const keyword = search.toLowerCase();
    return (
      user.name.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword)
    );
  });

  // ---------------- Pagination ----------------
  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / usersPerPage)
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const currentUsers = filteredUsers.slice(
    indexOfFirstUser,
    indexOfLastUser
  );

  // fix: avoid empty page after delete/search
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [users, search, currentPage, totalPages]);

  
  // ---------------- Delete ----------------
  const openDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const closeDelete = () => {
    setSelectedUser(null);
    setShowDeleteModal(false);
  };

  
  const confirmDelete = async () => {
    const token=localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:8000/users/${selectedUser.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Delete failed");

      toast.success(data.message || "User deleted successfully");

      closeDelete();
      loadUsers();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Manage Users</h1>

        <span className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          Total Users: {users.length}
        </span>
      </div>

      {/* Search */}
      <UserSearch search={search} setSearch={setSearch} />

      {/* Table */}
      {loading ? (
        <div className="text-center py-10 text-lg">
          Loading users...
        </div>
      ) : (
        <UserTable
          users={currentUsers}
          currentEmail={currentEmail}
          deleteUser={openDelete}
        />
      )}

      {/* Modals */}

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={closeDelete}
        onConfirm={confirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete "${selectedUser?.name}"? This action cannot be undone.`}
      />

      {/* Pagination */}
      {!loading && filteredUsers.length > 0 && (
        <div className="flex justify-center mt-6 gap-2">

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>

        </div>
      )}

    </div>
  );
}

export default ManageUsers;