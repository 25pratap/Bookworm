import { useEffect, useState, useContext,useRef } from "react";
import { useSearchParams } from "react-router-dom";
import BookCard from "../components/BookCard";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";


function BooksPage() {
  const [books, setBooks] = useState([]);
  const { token } = useContext(AuthContext);
  const email = localStorage.getItem("email");
  const [recommendedBooks, setRecommendedBooks] = useState([]);

  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const genre = searchParams.get("genre") || "";

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 8;
  const recommendRef = useRef(null);

const scrollRecommended = (direction) => {
  if (recommendRef.current) {
    recommendRef.current.scrollBy({
      left: direction === "left" ? -400 : 400,
      behavior: "smooth",
    });
  }
};

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
    //Load all books
    fetch("http://localhost:8000/books", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    })
      .then((response) => response.json())
      .then((data) =>  setBooks(data))
      .catch((error) => 
        console.error("Error fetching books:", error)
      );
  
      //load recommended books
      if (email) {
        fetch(`http://localhost:8000/recommend/${encodeURIComponent(email)}`)
          .then(async (response) => {
            const data = await response.json();
            if (!response.ok) {
              throw new Error(data.detail || "Failed to fetch recommended books");
            } 
            return data;
          })
          .then((data) => {
            setRecommendedBooks(data.recommendations || []);
          })
          .catch((error) => {
            console.error("Recommended books:", error);
            setRecommendedBooks([]);
          });
      }
  }, [token, email]); 

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
    <div className="max-w-7xl mx-auto px-6 py-8">
    {recommendedBooks.length > 0 && (
  <>
    <h1 className="text-4xl font-bold text-gray-800 mb-5">
      Recommended For You
    </h1>

    <p className="text-sm text-gray-500 mb-5">
      Based on your favourite genres
    </p>
      <div className="relative px-6">

      {/* Left Arrow */}
      <button
        onClick={() => scrollRecommended("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 
                  bg-white text-blue-600 shadow-xl border border-gray-200 rounded-full w-12 h-12 flex items-center justify-center text-4xl hover:bg-blue-600 hover:text-white transition"
      >
        ❮
      </button>
    {/*Books Row*/}
    <div 
      ref={recommendRef}
      className="flex gap-5 overflow-x-auto scroll-smooth px-12 hide-scrollbar"
      >
      {recommendedBooks.map((book) => (
        <div 
          key={book.id}
          className="w-72 shrink-0"
          >
          <BookCard
            compact={true}
            id={book.id}
            title={book.title}
            author={book.author}
            cover={book.cover}
            genre={book.genre}
            price={book.price}
            rating={book.rating}
            onAddToCart={() => handleAddToCart(book.id)}
          />
        </div>    
         ))}
      </div>

      {/* Right Arrow */}
        <button
          onClick={() => scrollRecommended("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 
                    bg-white text-blue-600 shadow-xl border border-gray-200 rounded-full w-12 h-12 flex items-center justify-center text-4xl hover:bg-blue-600 hover:text-white transition"
        >
          ❯
        </button>
    </div>

    <hr className="my-12 border-gray-300"/>
  </>
)}
      <h1 className="text-4xl font-bold mb-8">
        Books Collection
        </h1>

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
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentBooks.map((book) => (
              <div
                  key={book.id}
                  className="bg-white rounded-xl shadow hover:shadow-xl transition duration-300 h-full"
              >
              <BookCard
                id={book.id}
                title={book.title}
                author={book.author}
                cover={book.cover}
                price={book.price}
                rating={book.rating}
                genre={book.genre}
                onAddToCart={() => handleAddToCart(book.id)}
              />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bhg-gray-300"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-4 py-2 rounded-lg transition ${
                    currentPage === index + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
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