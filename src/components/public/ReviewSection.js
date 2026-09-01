'use client';

import { useState } from 'react';
import Link from 'next/link';

// Simple Star Rating Component for displaying stars
const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-4 w-4 ${star <= rating ? 'text-amber-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

export default function ReviewSection({ productId, initialReviews, user }) {
  const [reviews, setReviews] = useState(initialReviews || []);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const hasReviewed = user ? reviews.some((r) => r.user === user.userId) : false;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) {
      setError('Mohon isi rating dan komentar.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Gagal menambahkan ulasan');
      }

      // Add the new review to the list immediately
      setReviews([data.review, ...reviews]);
      setComment('');
      setRating(5);
      alert('Ulasan berhasil ditambahkan!');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12 md:mt-16 bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Ulasan Pembeli</h2>

      {/* Review Form */}
      {user ? (
        hasReviewed ? (
          <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-600 mb-8 border border-gray-100 text-center">
            Anda sudah memberikan ulasan untuk produk ini. Terima kasih!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mb-10 bg-gray-50 p-5 rounded-xl border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Tulis Ulasan Anda</h3>
            
            {error && <div className="text-red-500 text-xs mb-3 font-medium">{error}</div>}
            
            <div className="mb-4">
              <label className="block text-xs text-gray-500 mb-1.5">Rating Bintang</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <svg
                      className={`h-7 w-7 transition-colors ${star <= rating ? 'text-amber-400 hover:text-amber-500' : 'text-gray-300 hover:text-amber-200'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="comment" className="block text-xs text-gray-500 mb-1.5">Komentar</label>
              <textarea
                id="comment"
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full rounded-lg border-gray-200 shadow-sm focus:border-[#C62828] focus:ring focus:ring-[#C62828] focus:ring-opacity-20 p-3 text-sm"
                placeholder="Ceritakan pengalaman Anda dengan produk ini..."
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#C62828] hover:bg-[#8E0000] text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
            </button>
          </form>
        )
      ) : (
        <div className="bg-gray-50 p-6 rounded-xl mb-10 border border-gray-100 flex flex-col items-center text-center">
          <p className="text-sm text-gray-600 mb-3">Silakan login terlebih dahulu untuk memberikan ulasan.</p>
          <Link href="/login" className="bg-[#C62828] hover:bg-[#8E0000] text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors">
            Login Sekarang
          </Link>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-sm italic text-center py-4">Belum ada ulasan untuk produk ini. Jadilah yang pertama!</p>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500 text-xs uppercase">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">{review.name}</h4>
                    <span className="text-[10px] text-gray-400">
                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                    </span>
                  </div>
                </div>
                <StarRating rating={review.rating} />
              </div>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed whitespace-pre-wrap">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}