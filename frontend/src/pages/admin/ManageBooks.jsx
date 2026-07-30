import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

const booksPerPage = 5;

  const loadBooks = async () => {
    const res = await fetch("http://localhost:8000/books");
    const data = await res.json();
    setBooks(data);
  };

  useEffect(() => {
    loadBooks();
  }, []);

//deletebook
const deleteBook = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`http://localhost:8000/books/${id}`, {
      method: "DELETE",
       headers: {
        Authorization: `Bearer ${token}`,
  },
    });

    if (!response.ok) {
      const error = await response.json();
      toast.error(error.detail || "Failed to delete book.");
      return;
    }

    toast.success("Book deleted successfully!");

    await loadBooks(); // refresh list

    // Close the modal
    setShowDeleteModal(false);
    setSelectedBookId(null);

    // Go to previous page if current page becomes empty
    if (currentPage > 1 && currentBooks.length === 1) {
      setCurrentPage((prev) => prev - 1);
    }
  } catch (err) {
    console.error(err);
    toast.error("Server error.");
  }
};
  


// genre
  const genres = [
    "All",
    ...new Set(books.map((book) => book.genre).filter(Boolean)),
  ];

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase());

    const matchesGenre =
      genreFilter === "All" || book.genre === genreFilter;

    return matchesSearch && matchesGenre;
  });
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;

  const currentBooks = filteredBooks.slice(
    indexOfFirstBook,
    indexOfLastBook
    );

    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Manage Books
          </h1>
          


          <p className="text-gray-500 mt-1">
            Total Books: {filteredBooks.length}
          </p>
        </div>

        <Link
          to="/admin/addbook"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
        >
          + Add Book
        </Link>

      </div>

      {/* Search & Filter */}
     
    <div className="bg-white shadow rounded-xl p-5 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">

  <input
    type="text"
    placeholder="🔍 Search by title or author..."
    value={search}
    onChange={(e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
    }}
    className="w-full border rounded-lg px-4 py-3 text-lg"
  />

  <select
    value={genreFilter}
    onChange={(e) => {
    setGenreFilter(e.target.value);
    setCurrentPage(1);
    }}
    className="w-full border rounded-lg px-4 py-3 text-lg"
  >
    {genres.map((genre) => (
      <option key={genre} value={genre}>
        {genre}
      </option>
    ))}
  </select>

</div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-x-auto">

        <table className="min-w-full">

         <thead className="bg-gray-800 text-white">
            <tr>
                <th className="px-6 py-4 text-left">Title</th>
                <th className="px-6 py-4 text-left">Author</th>
                <th className="px-6 py-4 text-left">Genre</th>
                <th className="px-6 py-4 text-left">Price</th>
                <th className="px-6 py-4 text-left">Published</th>
                <th className="px-6 py-4 text-left">Pages</th>
                <th className="px-6 py-4 text-left">Stock</th>
                <th className="px-6 py-4 text-center">Actions</th>
            </tr>
        </thead>

          <tbody>

            {filteredBooks.length > 0 ? (
              currentBooks.map((book) => (
                <tr
                  key={book.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4">{book.title}</td>

                  <td className="px-6 py-4">{book.author}</td>

                  <td className="px-6 py-4">{book.genre}</td>

                  <td className="px-6 py-4 font-semibold text-green-700">
                    Rs. {book.price}
                    </td>

                    <td className="px-6 py-4">
                    {book.publication_date || "-"}
                    </td>

                    <td className="px-6 py-4">
                    {book.pages || "-"}
                    </td>

                    <td className="px-6 py-4">
                    {book.stock > 5 ? (
                        <span className="text-green-600 font-semibold">
                        {book.stock} In Stock
                        </span>
                    ) : book.stock > 0 ? (
                        <span className="text-yellow-600 font-semibold">
                        {book.stock} Low Stock
                        </span>
                    ) : (
                        <span className="text-red-600 font-semibold">
                        Out of Stock
                        </span>
                    )}
                    </td>

                    <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">

                      <Link
                        to={`/admin/editbook/${book.id}`}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition"
                      >
                        Edit
                      </Link>

                     <button
                        onClick={() => {
                            setSelectedBookId(book.id);
                            setShowDeleteModal(true);
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                        >
                        Delete
                        </button>

                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-10 text-gray-500"
                >
                  No books found.
                </td>
              </tr>
            )}

          </tbody>

        </table>
             {/* Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center px-6 py-5 border-t">

        <p className="text-gray-600 mb-3 md:mb-0">
            Showing {filteredBooks.length === 0 ? 0 : indexOfFirstBook + 1} -
            {Math.min(indexOfLastBook, filteredBooks.length)} of {filteredBooks.length} books
        </p>

        <div className="flex items-center gap-2">

            <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
            Previous
            </button>

            {[...Array(totalPages)].map((_, index) => (
            <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-10 h-10 rounded-lg font-medium transition ${
                currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
            >
                {index + 1}
            </button>
            ))}

            <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
            Next
            </button>

        </div>

        </div>

        </div>
        
        {showDeleteModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

                <div className="bg-white rounded-xl shadow-xl w-96 p-6">

                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    Delete Book
                </h2>

                <p className="text-gray-600 mb-6">
                    Are you sure you want to delete this book?
                    This action cannot be undone.
                </p>

                <div className="flex justify-end gap-3">

                    <button
                    onClick={() => {
                        setShowDeleteModal(false);
                        setSelectedBookId(null);
                    }}
                    className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                    >
                    Cancel
                    </button>

                    <button
                    onClick={() => deleteBook(selectedBookId)}
                    className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                    >
                    Delete
                    </button>

                </div>

                </div>

            </div>
            )}
      </div>
      
  );
}

export default ManageBooks;