import polyuLogo from '../../assets/polyu.png'
import './TopBar.css'

export default function TopBar() {
  return (
    <div className="top-bar">
      <div className="top-bar-brand">
        <img src={polyuLogo} alt="PolyU" className="top-bar-logo" />
        <span className="top-bar-brand-name">PolyU</span>
        <span className="top-bar-sep" />
        <span className="top-bar-project">Carbon Capture Visualization</span>
      </div>
    </div>
  )
}
