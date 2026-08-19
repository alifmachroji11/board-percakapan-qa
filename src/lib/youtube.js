export function getYoutubeEmbedUrl(url) {
  if (!url) return null
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/)
  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}` : null
}
