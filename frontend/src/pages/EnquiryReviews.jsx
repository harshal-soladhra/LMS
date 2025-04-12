import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../supabaseClient";

// Dummy data for enquiry reviews
const dummyReviews = [
  {
    id: 1,
    first_name: "John",
    last_name: "Doe",
    phone_number: "+1-555-123-4567",
    email_id: "john.doe@example.com",
    message: "Interested in advanced programming courses. Can you provide more details?",
    is_read: false,
    created_at: "2025-04-10T10:30:00Z",
  },
  {
    id: 2,
    first_name: "Emma",
    last_name: "Smith",
    phone_number: "+1-555-987-6543",
    email_id: "emma.smith@example.com",
    message: "The platform is great! Any plans to add video tutorials?",
    is_read: false,
    created_at: "2025-04-09T14:45:00Z",
  },
  {
    id: 3,
    first_name: "Michael",
    last_name: "Brown",
    phone_number: "+1-555-456-7890",
    email_id: "michael.brown@example.com",
    message: "Having trouble accessing my account. Need help with password reset.",
    is_read: false,
    created_at: "2025-04-08T09:15:00Z",
  },
  {
    id: 4,
    first_name: "Sophie",
    last_name: "Wilson",
    phone_number: "+1-555-321-6547",
    email_id: "sophie.wilson@example.com",
    message: "Quick response from support team! My issue was resolved promptly.",
    is_read: true,
    created_at: "2025-04-07T16:20:00Z",
  },
];

const EnquiryReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulate fetching reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        // Simulate Supabase query
        // const { data, error } = await supabase.from("enquiries").select("*").order("created_at", { ascending: false });
        // if (error) throw error;
        setReviews(dummyReviews);
      } catch (err) {
        setError("Failed to load reviews");
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Handle marking a review as read
  const handleMarkAsRead = async (id) => {
    try {
      // Simulate Supabase update
      // const { error } = await supabase.from("enquiries").update({ is_read: true }).eq("id", id);
      // if (error) throw error;

      setReviews(
        reviews.map((review) =>
          review.id === id ? { ...review, is_read: true } : review
        )
      );
    } catch (err) {
      console.error("Error marking as read:", err);
      setError("Failed to mark as read");
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading reviews...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-6 py-10 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Enquiry Reviews</h1>
      {reviews.length === 0 ? (
        <p className="text-center text-gray-600">No reviews available.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                className={`p-6 bg-gray-100 shadow-md rounded-lg relative transition-colors duration-300 ${
                  review.is_read ? "bg-gray-200 opacity-75" : "bg-gray-100"
                }`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0,0,0,0.2)" }}
              >
                {review.is_read && (
                  <span className="absolute top-4 right-4 text-green-500">✓</span>
                )}
                <h3 className="font-semibold text-lg">
                  {review.first_name} {review.last_name}
                </h3>
                <p className="text-sm text-gray-600">
                  <strong>Phone:</strong> {review.phone_number}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> {review.email_id}
                </p>
                <p className="mt-2 p-2 bg-blue-100 text-blue-800 font-medium rounded">
                  {review.message}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Submitted on: {new Date(review.created_at).toLocaleDateString()}
                </p>
                {!review.is_read && (
                  <button
                    onClick={() => handleMarkAsRead(review.id)}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  >
                    Mark as Read
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default EnquiryReviews;