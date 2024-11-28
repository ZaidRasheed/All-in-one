import { Form, Button, Alert, Modal, Dropdown, DropdownButton } from 'react-bootstrap'
import { useState } from 'react'
import { AppData, Bin } from '../../context/appContext'

type binProps = {
    bin: Bin;
    editModal: boolean;
    setEditModal: Function;
}
export default function EditBinModal(props: binProps) {
    const [error, setError] = useState<string>('')
    const [success, setSuccess] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)



    const [id, setId] = useState<string>(props.bin.id)
    const [level, setLevel] = useState<string>(props.bin.level)
    const { editBin, refreshData } = AppData()

    const closeModal = () => {
        props.setEditModal(false)
    }

    const handleUpdateBin = (e: any) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)
        if (props.bin.id.toLowerCase() === id.toLowerCase() && props.bin.level.toLowerCase() === level.toLowerCase()) {
            setLoading(false)
            return setError('Please provide a new ID or set a new level.')
        }
        if (!['full', 'half', 'empty'].includes(level)) {
            setLoading(false)
            return setError('Please select a valid level.')
        }

        props.bin.level = level
        editBin(props.bin, id, level).then((res: any) => res.json()).then((response: any) => {
            if (response.status === 'success') {
                setSuccess(response.message)
                refreshData()
            }
            else {
                setLoading(false)
                setError(response.message)
            }
        }).catch(() => {
            setLoading(false)
            setError("Can't edit Bin error 505")
        })
    }

    return (
        <Modal centered show={props.editModal} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Bin</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant='danger' onClose={() => setError('')} dismissible>{error}</Alert>}
                {success && <Alert variant='success' onClose={() => setSuccess('')}>{success}</Alert>}
                <h4>Bin: <i>{props.bin.id}</i></h4>
                <Form onSubmit={handleUpdateBin}>
                    <Form.Group className='mb-3'>
                        <Form.Label>ID</Form.Label>
                        <Form.Control
                            type='string'
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            placeholder='ID'
                            disabled={true}
                            required />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Level</Form.Label>
                        <DropdownButton
                            title={level.charAt(0).toUpperCase() + String(level).slice(1)}
                            variant={level === 'full' ? 'danger' : level === 'half' ? 'warning' : 'success'}
                            className='mb-3'
                        >
                            <Dropdown.Item onClick={(e) => setLevel("full")}>Full</Dropdown.Item>
                            <Dropdown.Item onClick={(e) => setLevel("half")}>Half</Dropdown.Item>
                            <Dropdown.Item onClick={(e) => setLevel("empty")}>Empty</Dropdown.Item>
                        </DropdownButton>
                    </Form.Group>
                    <Button disabled={loading} className='text-center w-100' variant='primary' type='submit'>Update</Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>

            </Modal.Footer>
        </Modal>
    )
}
