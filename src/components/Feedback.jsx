import { useState, useEffect } from 'react'

const STORAGE_KEY = 'portfolio_feedback'

export default function Feedback() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [review, setReview] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    setReviews(stored)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || rating === 0) return
    const entry = { name: name.trim(), rating, review: review.trim(), date: new Date().toISOString() }
    const updated = [entry, ...reviews]
    setReviews(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setSubmitted(true)
    setName('')
    setRating(0)
    setReview('')
    setTimeout(() => setSubmitted(false), 2000)
  }

  return (
    <>
      <button className="feedback-toggle" onClick={() => setOpen(!open)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        Feedback
      </button>

      <div className={`feedback-panel ${open ? 'visible' : ''}`}>
        <div className="feedback-header">
          <h3>Rate Om</h3>
          <button className="feedback-close" onClick={() => setOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="feedback-field">
            <label>Your Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" required />
          </div>

          <div className="feedback-field">
            <label>Rating</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star ${(hover || rating) >= star ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill={((hover || rating) >= star) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <div className="feedback-field">
            <label>Review</label>
            <textarea value={review} onChange={(e) => setReview(e.target.value)} placeholder="Share your thoughts..." rows={3} />
          </div>

          <button type="submit" className="btn primary" disabled={!name.trim() || rating === 0}>
            {submitted ? 'Submitted!' : 'Submit Feedback'}
          </button>
        </form>

        {reviews.length > 0 && (
          <div className="feedback-reviews">
            <h4>Recent Reviews</h4>
            {reviews.slice(0, 5).map((r, i) => (
              <div key={i} className="feedback-review-item">
                <div className="feedback-review-head">
                  <strong>{r.name}</strong>
                  <span className="feedback-review-stars">
                    {Array.from({ length: r.rating }, (_, j) => (
                      <svg key={j} width="14" height="14" viewBox="0 0 24 24" fill="var(--accent)" stroke="var(--accent)" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </span>
                </div>
                {r.review && <p>{r.review}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
