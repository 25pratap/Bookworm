import { useEffect, useState, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import BookCard from "../components/BookCard";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";


function BooksPage() {
  const [books, setBooks] = useState([]);
  const { token } = useContext(AuthContext);

  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const genre = searchParams.get("genre") || "";
 

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 6;


const handleAddToCart = async (bookId) => {
  console.log("Book ID:", bookId);
  console.log("Token:", token);

  try {
    const response = await fetch("http://localhost:8000/cart", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        book_id: bookId,
        quantity: 1,
      }),
    });

    const data = await response.json();

    console.log("Status:", response.status);
    console.log("Response:", data);

    if (!response.ok) {
      toast.error(data.detail || "Failed");
      return;
    }

    toast.success("Added to cart");
  } catch (err) {
    console.error(err);
  }
};

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8000/books", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setBooks(data);
      })
      .catch((error) => console.error("Error fetching books:", error));
  }, [token]);

  // Reset page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [search,genre]);

  const searchText = search.trim().toLowerCase();

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      (book.title || "").toLowerCase().includes(searchText);

    const matchesGenre =
      genre === "" ||
      (book.genre &&
       book.genre.toLowerCase() === genre.toLowerCase());

    return matchesSearch && matchesGenre;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;

  const currentBooks = filteredBooks.slice(
    indexOfFirstBook,
    indexOfLastBook
  );

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-6">Books Collection</h1>

  {genre && (
    <p className="mb-4 text-lg font-semibold text-blue-600">
      Category: {genre}
    </p>
  )}
      {search && (
        <p className="mb-6 text-gray-600">
          Search results for:{" "}
          <span className="font-semibold">"{search}"</span>
        </p>
      )}

      {filteredBooks.length === 0 ? (
        <div className="text-center text-gray-500 text-lg mt-10">
          No books found.
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentBooks.map((book) => (
              <BookCard
                key={book.id}
                id={book.id}
                title={book.title}
                author={book.author}
                cover={book.cover}
                price={book.price}
                rating={book.rating}
                genre={book.genre}
                onAddToCart={() => handleAddToCart(book.id)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-4 py-2 rounded ${
                    currentPage === index + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default BooksPage;