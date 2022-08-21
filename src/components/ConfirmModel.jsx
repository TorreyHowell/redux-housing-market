import { useEffect } from 'react'
import { useState } from 'react'
import Modal from 'react-modal'
import { useDispatch, useSelector } from 'react-redux'
import {
  deleteListing,
  clearStageDelete,
} from '../features/listing/listingSlice'

const customStyles = {
  content: {
    top: '45%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#2d2d2d',
    borderRadius: '10px',
    padding: '35px',
    border: '2px solid rgba(255, 255, 255, 0.5)',
  },
  overlay: {
    backgroundColor: 'rgba(45, 45, 45, 0.75)',
  },
}

Modal.setAppElement('#root')

function ConfirmModel({ modalOpen, closeModalState }) {
  const [modalIsOpen, setModalOpen] = useState(false)

  const { toDeleteID } = useSelector((state) => state.listing)

  const dispatch = useDispatch()

  useEffect(() => {
    setModalOpen(modalOpen)
  }, [modalOpen])

  const closeModal = () => {
    dispatch(clearStageDelete())
    closeModalState()
  }

  const submitDelete = () => {
    dispatch(deleteListing(toDeleteID))
    closeModalState()
    dispatch(clearStageDelete())
  }
  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2
          style={{
            fontSize: '2rem',
          }}
          className="modalHeader"
        >
          Confirm Delete
        </h2>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            marginTop: '10px',
          }}
        >
          <button
            style={{
              padding: '8px 18px',
              fontSize: '15px',
              fontWeight: 700,
              backgroundColor: 'rgb(50, 98, 112)',
              color: '#f4f4f4',
              borderRadius: '2rem',
              border: 'none',
              cursor: 'pointer',
            }}
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            style={{
              padding: '8px 18px',
              fontSize: '15px',
              fontWeight: 700,
              backgroundColor: '#aa3a3a',
              color: '#f4f4f4',
              borderRadius: '2rem',
              border: 'none',
              cursor: 'pointer',
            }}
            onClick={submitDelete}
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  )
}
export default ConfirmModel
