"use client";

import { useState, useTransition } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  userId: string;
  user: {
    name: string | null;
    imageUrl: string | null;
  };
}

interface ReviewsProps {
  courseId: string;
  reviews: Review[];
}

export const Reviews = ({ courseId, reviews }: ReviewsProps) => {
  const { user } = useUser();
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const existingReview = reviews.find((r) => r.userId === user?.id);

  const handleSubmit = async () => {
    if (!comment.trim()) return toast.error("Please enter a comment");

    try {
      setLoading(true);

      if (editingReviewId) {
        // Edit review
        await axios.patch(`/api/review/${editingReviewId}`, {
          rating,
          comment,
        });
        toast.success("Review updated!");
        setEditingReviewId(null);
      } else {
        // Submit new review
        await axios.post("/api/review", { courseId, rating, comment });
        toast.success("Review submitted!");
      }

      setComment("");
      startTransition(() => router.refresh());
    } catch (error) {
      toast.error("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (review: Review) => {
    setRating(review.rating);
    setComment(review.comment ?? "");
    setEditingReviewId(review.id);
  };

  const handleDelete = async (reviewId: string) => {
    try {
      setLoading(true);
      await axios.delete(`/api/review/${reviewId}`);
      toast.success("Review deleted!");
      setComment("");
      setEditingReviewId(null);
      startTransition(() => router.refresh());
    } catch (error) {
      toast.error("Failed to delete review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Existing Reviews */}
      <div>
        <h2 className="text-xl font-semibold">Student Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-sm text-gray-500">No reviews yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {reviews.map((review) => (
              <li key={review.id} className="py-4">
                <div className="flex items-center gap-2 mb-1">
                  {review.user.imageUrl && (
                    <img
                      src={review.user.imageUrl}
                      alt="user"
                      className="h-8 w-8 rounded-full"
                    />
                  )}
                  <span className="font-medium">{review.user.name}</span>
                  <span className="text-yellow-500 ml-2">
                    {"★".repeat(review.rating)}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{review.comment}</p>
                <span className="text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  })}
                </span>

                {user?.id === review.userId && (
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => handleEdit(review)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Submit or Edit Review Form */}
      {user && !existingReview && !editingReviewId && (
        <div>
          <h3 className="text-lg font-semibold">Leave a Review</h3>
          <div className="flex items-center gap-2 mb-2">
            <label htmlFor="rating">Rating:</label>
            <select
              id="rating"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border px-2 py-1 rounded"
            >
              {[5, 4, 3, 2, 1].map((star) => (
                <option key={star} value={star}>
                  {star} ★
                </option>
              ))}
            </select>
          </div>
          <textarea
            placeholder="Write your feedback..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full border rounded p-2"
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      )}

      {/* Edit Mode */}
      {user && editingReviewId && (
        <div>
          <h3 className="text-lg font-semibold">Edit Your Review</h3>
          <div className="flex items-center gap-2 mb-2">
            <label htmlFor="rating">Rating:</label>
            <select
              id="rating"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border px-2 py-1 rounded"
            >
              {[5, 4, 3, 2, 1].map((star) => (
                <option key={star} value={star}>
                  {star} ★
                </option>
              ))}
            </select>
          </div>
          <textarea
            placeholder="Edit your feedback..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full border rounded p-2"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {loading ? "Updating..." : "Update Review"}
            </button>
            <button
              onClick={() => {
                setEditingReviewId(null);
                setComment("");
              }}
              className="mt-2 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
