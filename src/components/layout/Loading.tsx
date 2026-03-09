import './Loading.css'

interface LoadingProps {
  fadeOut: boolean
}

export default function Loading({ fadeOut }: LoadingProps) {
  return (
    <div className={`loading-overlay ${fadeOut ? 'fade-out' : ''}`}>
      <div className="loading-spinner" />
      <div className="loading-text">Loading Campus Map...</div>
    </div>
  )
}
