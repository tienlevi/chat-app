export const defaultAvatar =
  'https://res.cloudinary.com/dbjkk9wg0/image/upload/v1785941690/chat-app/default-avatar_sij2wm.png';
export const baseApi =
  process.env.NODE_ENV === 'production'
    ? 'https://your-production-domain.com/api' // TODO: replace with real prod URL
    : 'http://localhost:3000/api';
