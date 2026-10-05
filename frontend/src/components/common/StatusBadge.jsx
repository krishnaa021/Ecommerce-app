const styles = {
  Processing: 'bg-blue-50 text-blue-700',
  Shipped: 'bg-indigo-50 text-indigo-700',
  Delivered: 'bg-green-50 text-green-700',
  Cancelled: 'bg-red-50 text-red-700',
}

export default function StatusBadge({ status }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] ?? 'bg-gray-100 text-gray-700'
      }`}
    >
      {status}
    </span>
  )
}