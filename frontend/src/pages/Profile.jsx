import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient"; // ✅ Import Supabase client

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userPhoto, setUserPhoto] = useState(""); // ✅ Store profile picture
  const [books, setBooks] = useState([]); // ✅ Store real books
  const [activePage, setActivePage] = useState("issuedBooks");
  const [currentPage, setCurrentPage] = useState(1);

  // 📂 Handle Profile Picture Upload
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) {
      console.log("❌ No file selected or user not found!");
      return;
    }

    // ✅ Store images in a user-specific folder
    const filePath = `user_${user.id}/profile_pictures/${file.name}_${Date.now()}`;
    console.log("Uploading to:", filePath);
    console.log("user id: ",  user.id);

    // ✅ First, delete any existing profile picture
    if (user.profile_picture) {
      const oldFilePath = user.profile_picture.split("/").slice(-2).join("/"); // Extract storage path
      await supabase.storage.from("profile-pictures").remove([oldFilePath]);
      console.log("Old profile picture deleted.");
    }

    // ✅ Upload file to Supabase Storage
    const { data, error } = await supabase.storage.from("profile-pictures").upload(filePath, file, { cacheControl: "3600", upsert: true });
    if (data) {
      console.log("File uploaded successfully:", data);
    }
    if (error) {
      console.error("Upload Error:", error.message);
      return;
    }

    // ✅ Fetch Public URL
    const { data: publicUrlData, error: publicUrlError } = supabase.storage.from("profile-pictures").getPublicUrl(filePath);
    if (publicUrlError) {
      console.error("Public URL Error:", publicUrlError.message);
      return;
    }
    const imageUrl = publicUrlData.publicUrl;

    console.log("Uploaded Image URL:", imageUrl);
    setUserPhoto(imageUrl);

    // ✅ Update `profile_picture` column in `users` table
    const { error: updateError } = await supabase
      .from("users")
      .update({ profile_picture: imageUrl })
      .eq("id", user.id);
    if (updateError) {
      console.error("Database Update Error:", updateError.message);
    } else {
      console.log("✅ Profile picture updated in database.");
    }
  };


  useEffect(() => {
    const fetchProfileAndBooks = async () => {
      try {
        // ✅ Fetch user session from Supabase
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !sessionData.session) {
          console.error("❌ No active session! Redirecting to Sign In...");
          navigate("/signin", { replace: true });
          return;
        }

        // ✅ Fetch user details from Supabase database
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("id, name, email, profile_picture, role")
          .eq("id", sessionData.session.user.id)
          .single();
        if (userError) throw userError;
        setUser(userData);
        setUserPhoto(userData.profile_picture || "https://lxfijlxgemdhiccvwdcq.supabase.co/storage/v1/object/public/profile-pictures//Python%20lover,%20streak%20on%20GeeksforGeeks%20platform,%20BTech%20student%20in%20Computer%20Science.png");

        // ✅ Fetch books issued to user
        const { data: booksData, error: booksError } = await supabase
          .from("books")
          .select("id, title, issued_date, due_date, returned_date")
          .eq("issued_to", userData.id);

        if (booksError) throw booksError;
        setBooks(booksData);
      } catch (err) {
        console.error("Profile/Books Fetch Error:", err);
        navigate("/signin", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndBooks();
  }, [navigate]);
  console.log("User: ", user)

  const booksPerPage = 5;
  const getCurrentBooks = () => {
    let filteredBooks = books;
    if (activePage === "returnedBooks") {
      filteredBooks = books.filter((book) => book.returned_date);
    } else if (activePage === "dueDate") {
      filteredBooks = books.filter((book) => !book.returned_date);
    }
    return filteredBooks.slice((currentPage - 1) * booksPerPage, currentPage * booksPerPage);
  };

  const totalPages = Math.ceil(
    (activePage === "returnedBooks"
      ? books.filter((book) => book.returned_date).length
      : activePage === "dueDate"
        ? books.filter((book) => !book.returned_date).length
        : books.length) / booksPerPage
  );

  const handlePageChange = (page) => setCurrentPage(page);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen w-full bg-gray-100 p-4 flex justify-center items-center my-20">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-4xl">
        {/* Profile Header */}
        <div className="flex items-center gap-6">
          <div className="relative w-32 h-32">
            <img
              src={userPhoto || "https://lxfijlxgemdhiccvwdcq.supabase.co/storage/v1/object/public/profile-pictures//Python%20lover,%20streak%20on%20GeeksforGeeks%20platform,%20BTech%20student%20in%20Computer%20Science.png"}
              alt="User Photo"
              className="w-full h-full object-cover rounded-full"
            />
            <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" id="photoInput" />
            <label htmlFor="photoInput" className="absolute bottom-2 right-2 bg-blue-500 text-white p-1 rounded-full text-sm cursor-pointer">
              📷
            </label>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{user?.name}</h2>
            <p className="text-gray-600">{user?.role}</p>
          </div>
        </div>

        {/* Book List */}
        <div className="mt-6 w-full min-h-[calc(100vh-300px)] flex flex-col bg-gray-50 rounded-lg p-4">
          {getCurrentBooks().map((book) => (
            <div key={book.id} className="p-4 mb-4 border rounded-lg shadow-sm bg-white flex justify-between">
              <p><strong>Title:</strong> {book.title}</p>
              <p>
                <strong>Issued Date:</strong> {new Date(book.issued_date).toLocaleString("en-IN", {
                  year: "numeric", month: "long", day: "numeric",
                  hour: "2-digit", minute: "2-digit", second: "2-digit",
                  hour12: true
                })}
                |
                <strong> Due Date:</strong> {new Date(book.due_date).toLocaleString("en-IN", {
                  year: "numeric", month: "long", day: "numeric",
                  hour: "2-digit", minute: "2-digit", second: "2-digit",
                  hour12: true
                })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
