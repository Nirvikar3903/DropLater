import dayjs from 'dayjs';

/**
 * noteParser — transforms raw database objects into UI-optimized models.
 * It calculates next retry times, formats dates, and creates short IDs for display.
 */
export function noteParser(note) {
  if (!note) return null;

  const now = dayjs();
  const attempts = note.attempts || [];
  const lastAttempt = attempts.length > 0 ? attempts[attempts.length - 1] : null;

  // Calculate next retry time based on exponential backoff logic (1s, 5s, 25s...)
  let nextRetryAt = null;
  if (lastAttempt && !lastAttempt.ok && note.status !== 'dead') {
    const backoffSeconds = Math.pow(5, attempts.length - 1);
    nextRetryAt = dayjs(lastAttempt.at).add(backoffSeconds, 'second').toISOString();
  }

  return {
    ...note,
    // Display-friendly derived keys
    attemptCount: attempts.length,
    lastAttempt,
    isOverdue: note.status === 'pending' && dayjs(note.releaseAt).isBefore(now),
    nextRetryAt: nextRetryAt ? dayjs(nextRetryAt).format('h:mm:ss A') : null,
    displayId: note._id?.slice(-8),
    formattedReleaseAt: dayjs(note.releaseAt).format('MMM D, YYYY h:mm A'),
    formattedCreatedAt: dayjs(note.createdAt).format('MMM D, YYYY h:mm A'),
  };
}
