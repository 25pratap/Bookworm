import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const genreOptions = [
  "Fiction",
  "Mystery",
  "Thriller",
  "Romance",
  "Fantasy",
  "Science Fiction",
  "Biography",
  "History",
  "Self-Help",
  "Business",
  "Children's",
  "Young Adult",
  "Programming"
];

function GenrePreferencePage() {
  const navigate = useNavigate();

  const [selected, setSelected] = useState([]);

  const email = localStorage.getItem("email");

  const toggleGenre = (genre) => {
    if (selected.includes(genre)) {
      setSelected(selected.filter((g) => g !== genre));
    } else {
      setSelected([...selected, genre]);
    }
  };

const savePreferences = async () => {
  if (selected.length === 0) {
    toast.error("Please select at least one genre");
    return;
  }

  try {
    const res = await fetch("http://localhost:8000/preferences", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        favorite_genres: selected,
      }),
    });

    const data = await res.json();

    console.log("Status:", res.status);
    console.log("Response:", data);

    if (res.ok) {
      toast.success(data.message || "Preferences saved successfully");
      navigate("/books");
    } else {
      toast.error(data.detail || JSON.stringify(data));
    }
  } catch (error) {
    console.error(error);
    toast.error("Server error");
  }
};

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">

        <h1 className="text-2xl font-bold mb-6">
          Choose Your Favorite Genres
        </h1>

        <div className="grid grid-cols-2 gap-3">

          {genreOptions.map((genre) => (

            <label
              key={genre}
              className="flex gap-2 items-center"
            >

              <input
                type="checkbox"
                checked={selected.includes(genre)}
                onChange={() => toggleGenre(genre)}
              />

              {genre}

            </label>

          ))}

        </div>

        <button
          onClick={savePreferences}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded"
        >
          Save Preferences
        </button>

      </div>

    </div>
  );
}

export default GenrePreferencePage;