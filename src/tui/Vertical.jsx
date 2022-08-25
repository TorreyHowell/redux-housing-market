import useWindowDimensions from '../hooks/useWindowDimensions'

function Vertical(props) {
  const { height } = useWindowDimensions()
  return (
    <div
      style={{
        minHeight: height - 100,
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          msTransform: 'translateY(-50%, -50%)',
          transform: 'translate(-50%, -50%)',
          width: '100%',
        }}
      >
        {props.children}
      </div>
    </div>
  )
}
export default Vertical
