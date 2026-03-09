import './TopBar.css'

export default function TopBar() {
  return (
    <div className="top-bar">
      <div /> {/* spacer — search bar is positioned absolutely */}
      <div className="project-title">
        <span className="project-title-accent">PolyU</span>
        <span className="project-title-divider" />
        <span className="project-title-sub">Carbon Capture Visualization</span>
      </div>
    </div>
  )
}
