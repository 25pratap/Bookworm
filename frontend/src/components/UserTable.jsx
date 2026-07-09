function UserTable({
  users,
  currentEmail,
  deleteUser,
}) {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-lg">

      <table className="min-w-full table-auto">

        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="px-6 py-4 text-left">Name</th>
            <th className="px-6 py-4 text-left">Email</th>
            <th className="px-6 py-4 text-left">Role</th>
            <th className="px-6 py-4 text-left">Favourite Genres</th>
            <th className="px-6 py-4 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td
                colSpan="5"
                className="px-6 py-8 text-center text-gray-500"
              >
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr
                key={user.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4">
                  {user.name}
                </td>

                <td className="px-6 py-4">
                  {user.email}
                </td>

                <td className="px-6 py-4 capitalize">
                  {user.role}
                </td>

                <td className="px-6 py-4">
                  {user.favorite_genres?.length
                    ? user.favorite_genres.join(", ")
                    : "Not set"}
                </td>

                <td className="px-6 py-4 text-center">

                  <div className="flex justify-center items-center gap-2">

                    {user.email !== currentEmail ? (
                      <button
                        onClick={() => deleteUser(user)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                      >
                        Delete
                      </button>
                    ) : (
                      <span className="text-gray-500 font-medium">
                        Current User
                      </span>
                    )}

                  </div>

                </td>
              </tr>
            ))
          )}
        </tbody>

      </table>

    </div>
  );
}

export default UserTable;