function Center(props) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {props.children}
    </div>
  )
}
export default Center
