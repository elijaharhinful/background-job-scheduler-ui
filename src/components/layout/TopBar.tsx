import { LiveIndicator } from '../ui/LiveIndicator';

export function TopBar() {
  return (
    <header className="topbar">
      <div className="topbar-content">
        <LiveIndicator connected={true} />
        <span className="topbar-text">System Active</span>
      </div>
    </header>
  );
}
