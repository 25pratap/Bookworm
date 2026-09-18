import { API_BASE_URL } from "../config/api";
import { Link,useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import Footer from "../components/Footer";


function HomePage() {
  const [books, setBooks] = useState([]);

  const navigate=useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}/books`)
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
    "Self-Help",
    "Business",
    "Biography",
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div>
      {/* Hero Section */}
      <section className="bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <span className="inline-block px-3 py-1 bg-yellow-400/20 text-yellow-300 font-semibold rounded-full text-xs mb-4 border border-yellow-400/30">
              Book Recommendation Platform
            </span>
            <h1 className="text-5xl font-bold text-white">
              Discover Your Next Favorite Book
            </h1>

            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Explore hundreds of books, discover recommendations,
              and find your next great read with BookWorm.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/books"
                className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-8 py-3.5 rounded-xl border border-white/20 transition"
              >
                Browse catalog →
              </Link>
        
            </div>
          </div>
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=700"
            alt="Books"
            className="w-full md:w-[450px]rounded-xl shadow-xl mt-10 md:mt-0"
          />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8">
            Browse by Category
          </h2>

          <div className="flex flex-wrap gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() =>
                  navigate(`/books?genre=${encodeURIComponent(category)}`)
                }
                className="bg-white px-6 py-3 rounded-lg shadow hover:bg-blue-600 hover:text-white transition"
              >
                {category}
              </button>
            ))}
        </div>
      </div>
      </section>
      
              {/* Featured Books */}
      {books.length > 0 && (
        <section className="py-12 bg-white border-t border-gray-200 ">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900">
                          Featured Books
               </h2>
                <p className="mt-1 text-sm text-gray-500">
                          Handpicked recommendations for you
                </p>
                </div>  
               <Link to ="/books" className="text-blue-600 font-bold text-sm hover:underline">
                        View library({books.length}+) →
                </Link>
                </div>
                     
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {books.map((book) => (
                    <div key ={book.id}className="h-full">
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
