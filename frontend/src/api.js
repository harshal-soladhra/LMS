import { supabase } from "./supabaseClient";

// ✅ Register User in Supabase
export const registerUser = async (userData) => {
  const { name, email, password, role = "member" } = userData;

  try {
    // ✅ Hash password before storing (do this in backend)
    const { data, error } = await supabase
      .from("users")
      .insert([{ name, email, password, role }]);
    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error registering user:", error.message);
    return null;
  }
};

// ✅ Login User (Fetch user from Supabase)
export const loginUser = async (credentials) => {
  const { email, password } = credentials;

  try {
    // ✅ Fetch user by email
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .maybeSingle();  // ✅ Won't throw error if no user is found

    if (error || !user) {
      console.error("Login failed: User not found");
      return null;
    }

    // ✅ Verify password (you should hash passwords in backend)
    if (password !== user.password) {
      console.error("Login failed: Incorrect password");
      return null;
    }

    return user; // ✅ Return user data
  } catch (error) {
    console.error("Error logging in:", error.message);
    return null;
  }
};

// ✅ Fetch All Books from Supabase
export const fetchBooks = async () => {
  try {
    const { data, error } = await supabase.from("books").select("*");

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error fetching books:", error.message);
    return [];
  }
};

// ✅ Add a New Book to Supabase
export const addBook = async (isbn) => {
  try {
      // Fetch book details from Google Books API
      const googleResponse = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
      const googleData = await googleResponse.json();
      
      if (!googleData.items || googleData.items.length === 0) {
          throw new Error("Book not found in Google Books API");
      }

      const bookInfo = googleData.items[0].volumeInfo;
      const book = {
          title: bookInfo.title || "Unknown",
          author: bookInfo.authors ? bookInfo.authors.join(", ") : "Unknown",
          isbn: isbn,
          genre: bookInfo.categories ? bookInfo.categories[0] : "Unknown",
          language: bookInfo.language || "Unknown",
          edition: bookInfo.publishedDate || "Unknown",
          cover_url: bookInfo.imageLinks ? bookInfo.imageLinks.thumbnail : "",
          copies: 1 // Default to 1 copy
      };

      // Insert into Supabase
      const { data, error } = await supabase.from("books").insert([book]);
      if (error) throw error;

      return { success: true, message: "Book added successfully!" };
  } catch (error) {
      return { success: false, message: error.message };
  }
};
