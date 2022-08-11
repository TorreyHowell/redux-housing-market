function FormLabel(props) {
  return (
    <label
      style={{
        display: 'block',
        fontWeight: '600',
        marginTop: '1rem',
      }}
    >
      {props.children}
    </label>
  )
}
export default FormLabel
