import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import Footer from "../components/footer";

function HomePage() {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/books")
      .then((res) => res.json())
      .then((data) => setBooks(Array.isArray(data) ? data.slice(0, 8) : []))
      .catch((err) => console.error(err));
  }, []);

  const categories = [
    "Fiction",
    "Mystery",
    "Fantasy",
    "Science Fiction",
    "Romance",
    "Self Help",
    "Business",
    "Biography",
    "Programming",
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white py-20 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl">
              <span className="inline-block px-3 py-1 bg-yellow-400/20 text-yellow-300 font-semibold rounded-full text-xs mb-4 border border-yellow-400/30">
                ✨ AI-Powered Book Recommendation Platform
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
                Discover Your Next Favorite Book with <span className="text-yellow-400">BookWorm</span>
              </h1>

              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Explore curated books across multiple genres, get smart personalized recommendations tailored to your taste, and order seamlessly.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/books"
                  className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-8 py-3.5 rounded-xl shadow-lg transition duration-200"
                >
                  Browse Catalog →
                </Link>
                <Link
                  to="/register"
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl border border-white/20 transition"
                >
                  Create Account
                </Link>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=700"
                alt="Books"
                className="w-full md:w-[480px] rounded-2xl shadow-2xl border-4 border-white/10 object-cover"
              />
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">
                Browse by Category
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Explore our diverse selection of genres
              </p>
            </div>
            <Link to="/books" className="text-blue-600 font-bold text-sm hover:underline">
              View All Genres →
            </Link>
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() =>
                  navigate(`/books?genre=${encodeURIComponent(category)}`)
                }
                className="bg-white px-6 py-3 rounded-xl shadow-xs border border-gray-200 text-gray-700 font-semibold hover:bg-blue-600 hover:text-white hover:border-blue-600 transition cursor-pointer"
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Featured Books */}
        {books.length > 0 && (
          <section className="py-12 bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-900">
                    Featured & Popular Books
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Top-rated reads handpicked for you
                  </p>
                </div>
                <Link to="/books" className="text-blue-600 font-bold text-sm hover:underline">
                  View Full Library ({books.length}+) →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {books.map((book) => (
                  <div key={book.id} className="h-full">
                    <BookCard
                      id={book.id}
                      title={book.title}
                      author={book.author}
                      cover={book.cover}
                      price={book.price}
                      rating={book.rating}
                      genre={book.genre}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default HomePage;