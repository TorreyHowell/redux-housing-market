function Button(props) {
  const { mt, type, sx, width } = props

  const styles = {
    outline: 'none',
    border: 'none',
    cursor: 'pointer',
    background: 'rgb(50, 98, 112)',
    color: '#fff',
    padding: '0.85rem 2rem',
    fontWeight: '600',
    fontSize: '1.25rem',
    width: width ? `${width}%` : '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: `${mt}px`,
    borderRadius: '1rem',
  }
  return (
    <button
      className="hover"
      style={{
        ...styles,
        ...sx,
      }}
      type={type}
    >
      {props.children}
    </button>
  )
}
export default Button
