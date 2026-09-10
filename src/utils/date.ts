export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('ar-DZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleTimeString('ar-DZ', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
