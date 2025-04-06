import React from 'react'

const IssuedBooks = () => {
  const issueBook = async (bookId) => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("Please log in to issue books.");
      return;
    }

    const { error } = await supabase.from("issued_books").insert([
      {
        user_id: user.id,
        book_id: bookId,
      },
    ]);

    if (error) {
      console.error("Issue failed:", error.message);
      alert("Failed to issue book.");
    } else {
      alert("Book issued successfully!");
    }
  };
  const returnBook = async (bookId) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("issued_books")
      .update({
        return_date: new Date(),
        returned: true,
      })
      .eq("book_id", bookId)
      .eq("user_id", user.id)
      .eq("returned", false); // only mark active issues

    if (error) {
      console.error("Return failed:", error.message);
      alert("Failed to return book.");
    } else {
      alert("Book returned successfully!");
    }
  };
  const { data, error } = await supabase
    .from("issued_books")
    .select("*, books(*)") // assuming foreign key to `books` table
    .eq("user_id", user.id)
    .eq("returned", false);

  return (
    <div className='mt-50'> IssuedBooks</div>
  )
}

export default IssuedBooks