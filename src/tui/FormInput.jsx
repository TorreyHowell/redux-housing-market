function FormInput({
  type,
  value,
  onChange,
  id,
  placeholder,
  required,
  name,
  width,
}) {
  const inputStyle = {
    width: width || '100%',
    height: '3rem',
    padding: '0 1rem',
    fontSize: '1.25rem',
    borderRadius: '3rem',
    outline: 'rgb(98, 180, 207)',
    marginTop: '.5rem',
    color: '#ffff',
    backgroundColor: '#1d1d1d',
  }

  return (
    <input
      style={inputStyle}
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      name={name}
    />
  )
}
export default FormInput
