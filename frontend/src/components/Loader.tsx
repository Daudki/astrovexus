export function Loader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div
        className="w-8 h-8 rounded-full border-2 border-royal/20 border-t-royal animate-spin"
        role="status"
        aria-label="Loading"
      />
    </div>
  )
}

export default Loader
