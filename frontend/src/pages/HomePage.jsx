import { Link,useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";

function HomePage() {
  const [books, setBooks] = useState([]);

  const navigate=useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/books")
      .then((res) => res.json())
      .then((data) => setBooks(data.slice(0, 4)))
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
    <div>
      {/* Hero Section */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-xl">
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              Discover Your Next Favorite Book
            </h1>

            <p className="text-gray-600 text-lg mb-8">
              Explore hundreds of books, discover recommendations,
              and find your next great read with BookWorm.
            </p>

          </div>

          <img
            src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=700"
            alt="Books"
            className="w-full md:w-112.5 rounded-xl shadow-xl mt-10 md:mt-0"
          />
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

      
    </div>
  );
}

export default HomePage;