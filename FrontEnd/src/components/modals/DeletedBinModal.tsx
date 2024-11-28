import { useState } from 'react'
import { Button, Alert, Modal } from 'react-bootstrap'
import { AppData, Bin } from '../../context/appContext'

type binProps = {
    bin: Bin;
    deleteModal: boolean;
    setDeleteModal: Function;
}
export default function DeletedBinModal(props: binProps) {
    const [error, setError] = useState<string>('')
    const [success, setSuccess] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const { deleteBin, refreshData } = AppData()

    const closeModal = () => {
        props.setDeleteModal(false)
    }

    const handleDeleteTeacher = () => {
        setError('')
        setSuccess('')
        setLoading(true)
        deleteBin(props.bin.id).then((res: any) => res.json()).then((response: any) => {
            if (response.status === 'success') {
                setSuccess(response.message)
                refreshData()
            }
            else {
                setLoading(false)
                setError(response.message)
            }
        })
            .catch(() => {
                setError("Can't delete teacher from demo account")
            })
    }

    return (
        <Modal centered show={props.deleteModal} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Delete Teacher</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant='danger' onClose={() => setError('')} dismissible>{error}</Alert>}
                {success && <Alert variant='success' onClose={() => setSuccess('')}>{success}</Alert>}
                <h3>Delete <i>{props.bin.id}</i>?</h3>
                <p>*Note: This action is not reversible.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button disabled={loading} variant='danger' style={{ marginRight: '10px' }} onClick={handleDeleteTeacher}>Delete</Button>
                <Button disabled={loading} variant='secondary' className='w-25' onClick={closeModal}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    )
}
