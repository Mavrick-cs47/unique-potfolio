export default function GalaxyBackdrop() {
  return (
    <div className="absolute inset-0 z-0">
      <div className="galaxy-bg" />
      <div className="galaxy-star-field">
        <div className="galaxy-layer" />
        <div className="galaxy-layer" />
        <div className="galaxy-layer" />
      </div>
    </div>
  );
}
