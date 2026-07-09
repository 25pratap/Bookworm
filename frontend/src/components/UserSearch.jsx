function UserSearch({ search, setSearch }) {
  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="🔍 Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-96 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export default UserSearch;