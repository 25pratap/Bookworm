function AdminFooter() {
  return (
      <footer className="w-full py-6 border-t bg-white text-center text-base text-gray-500">
      © {new Date().getFullYear()} BookWorm Admin Panel
    </footer>
  );
}

export default AdminFooter;