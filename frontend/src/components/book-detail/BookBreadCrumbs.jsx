function BookCover({ image }) {
  return (
    <img
      src={image || "https://via.placeholder.com/250x350?text=Book+Cover"}
      alt="Book Cover"
      className="w-64 rounded-lg shadow-md"
    />
  );
}

export default BookCover;