import { useState } from 'react'
import { Button, Alert, Modal } from 'react-bootstrap'
import { AppData, Bin } from '../../context/appContext'

type binProps = {
    bin: Bin;
    enableDisableModal: boolean;
    setEnableDisableModal: Function;
}

export default function EnableDisableBinModal(props: binProps) {
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)
    const { enableBin, refreshData } = AppData()
    const closeModal = () => {
        props.setEnableDisableModal(false)
    }

    const handleEnableBin = () => {
        setError('')
        setSuccess('')
        setLoading(true)

        props.bin.enabled = !props.bin.enabled

        enableBin(props.bin).then((res: any) => res.json()).then((response: any) => {
            if (response.status === 'success') {
                setSuccess(response.message)
                refreshData()
            }
            else {
                setError(response.message)
            }
        }).catch(() => {
            setError("Can't disable/enable bin")
        }).finally(() => setTimeout(() => setLoading(false), 2000))
    }

    return (
        <Modal centered show={props.enableDisableModal} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>{props.bin.enabled ? 'Disable' : 'Enable'} Bin</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant='danger' onClose={() => setError('')} dismissible>{error}</Alert>}
                {success && <Alert variant='success' onClose={() => setSuccess('')}>{success}</Alert>}
                <h3>{props.bin.enabled ? 'Disable' : 'Enable'} Bin <i>{props.bin?.id}</i> ?</h3>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    disabled={loading} variant='warning' style={{ marginRight: '10px' }}
                    onClick={handleEnableBin}>
                    {props.bin.enabled ? 'Disable' : 'Enable'}
                </Button>
                <Button disabled={loading} variant='secondary' className='w-25' onClick={closeModal}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    )
}
