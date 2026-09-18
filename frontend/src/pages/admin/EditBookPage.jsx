import { API_BASE_URL } from "../../config/api";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function EditBookPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [cover, setCover] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [pages, setPages] = useState("");
  const [stock, setStock] = useState("");

  // --------------------------------------------------
  // LOAD BOOK
  // --------------------------------------------------
  useEffect(() => {
    fetch(`${API_BASE_URL}/books/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load book");
        }

        return response.json();
      })
      .then((data) => {
        setTitle(data.title || "");
        setAuthor(data.author || "");
        setGenre(data.genre || "");
        setDescription(data.description || "");
        setPrice(data.price ?? "");
        setCover(data.cover || "");

        // Important: keep publication year as a number/string
        setPublicationDate(
          data.publication_date ?? ""
        );

        setPages(data.pages ?? "");
        setStock(data.stock ?? "");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to load book details");
      });
  }, [id]);

  // --------------------------------------------------
  // UPDATE BOOK
  // --------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedBook = {
      title: title.trim(),
      author: author.trim(),
      genre: genre.trim(),
      description: description.trim(),
      price: Number(price),
      cover: cover.trim(),
      publication_date: Number(publicationDate),
      pages: Number(pages),
      stock: Number(stock),
    };

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${API_BASE_URL}/books/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedBook),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(
          data.detail || "Failed to update book"
        );
        return;
      }

      toast.success(
        data.message || "Book updated successfully!"
      );

      setTimeout(() => {
        navigate("/admin/managebooks");
      }, 1200);

    } catch (error) {
      console.error(error);
      toast.error("Server error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">

      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8">

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Edit Book
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* TITLE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Book Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3
                         focus:ring-2 focus:ring-blue-500
                         focus:border-blue-500 outline-none"
              required
            />
          </div>

          {/* AUTHOR */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>

            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3
                         focus:ring-2 focus:ring-blue-500
                         focus:border-blue-500 outline-none"
              required
            />
          </div>

          {/* GENRE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Genre
            </label>

            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3
                         focus:ring-2 focus:ring-blue-500
                         focus:border-blue-500 outline-none"
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Book Description
            </label>

            <textarea
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3
                         focus:ring-2 focus:ring-blue-500
                         focus:border-blue-500 outline-none resize-y"
              required
            />
          </div>

          {/* PRICE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (Rs.)
            </label>

            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              step="0.01"
              className="w-full border border-gray-300 rounded-lg p-3
                         focus:ring-2 focus:ring-blue-500
                         focus:border-blue-500 outline-none"
              required
            />
          </div>

          {/* PUBLICATION YEAR */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Publication Year
            </label>

            <input
              type="number"
              value={publicationDate}
              onChange={(e) =>
                setPublicationDate(e.target.value)
              }
              min="1000"
              max="9999"
              className="w-full border border-gray-300 rounded-lg p-3
                         focus:ring-2 focus:ring-blue-500
                         focus:border-blue-500 outline-none"
              required
            />
          </div>

          {/* PAGES */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Pages
            </label>

            <input
              type="number"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              min="1"
              className="w-full border border-gray-300 rounded-lg p-3
                         focus:ring-2 focus:ring-blue-500
                         focus:border-blue-500 outline-none"
              required
            />
          </div>

          {/* STOCK */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Quantity
            </label>

            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              min="0"
              className="w-full border border-gray-300 rounded-lg p-3
                         focus:ring-2 focus:ring-blue-500
                         focus:border-blue-500 outline-none"
              required
            />
          </div>

          {/* COVER */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cover Image URL
              <span className="text-gray-400 font-normal">
                {" "}(Optional)
              </span>
            </label>

            <input
              type="text"
              value={cover}
              onChange={(e) => setCover(e.target.value)}
              placeholder="https://example.com/book-cover.jpg"
              className="w-full border border-gray-300 rounded-lg p-3
                         focus:ring-2 focus:ring-blue-500
                         focus:border-blue-500 outline-none"
            />
          </div>

          {/* UPDATE BUTTON */}
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600
                       text-white font-semibold py-3 rounded-lg
                       transition duration-200 mt-3"
          >
            Update Book
          </button>

        </form>
      </div>
    </div>
  );
}

export default EditBookPage;
