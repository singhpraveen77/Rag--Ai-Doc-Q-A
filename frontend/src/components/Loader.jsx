function Loader({ text = "Loading..." }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div className="loader"></div>
      <span>{text}</span>
    </div>
  );
}

export default Loader;