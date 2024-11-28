import { Col, Row, Container, Form, Button, Card, Dropdown, DropdownButton } from 'react-bootstrap'
import UseAddBen from '../hooks/useAddBin';
const AddBen = () => {
    const {
        idRef,
        level,
        setLevel,
        enabled,
        enable,
        disable,
        loading,
        ErrorAlert,
        SuccessAlert,
        handleAddBen
    } = UseAddBen()
    return (
        <Container
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "100vh" }}
        >
            <div className="w-100" style={{ maxWidth: "800px" }}>
                <Card className='p-2'>
                    <Card.Body>
                        <h2 className='text-center mb-4'>Create a new Bin</h2>
                        {SuccessAlert}
                        {ErrorAlert}
                        <Form onSubmit={handleAddBen}>
                            <Row>
                                <Col lg={6} md={6} s={6} xs={12}>
                                    <Form.Group className='mb-3'>
                                        <Form.Label>Ben ID</Form.Label>
                                        <Form.Control type='id' ref={idRef} autoComplete='id' required />
                                    </Form.Group>
                                </Col>
                                <Col lg={6} md={6} s={6} xs={12}>
                                    <Form.Group className='mb-3'>
                                        <Form.Label>Level</Form.Label>
                                        <DropdownButton
                                            title={level.charAt(0).toUpperCase() + String(level).slice(1)}
                                            variant={level === 'full' ? 'danger' : level === 'half' ? 'warning' : level === 'empty' ? 'success' : 'secondary'}
                                            className='mb-3'
                                        >
                                            <Dropdown.Item onClick={(e) => setLevel("full")}>Full</Dropdown.Item>
                                            <Dropdown.Item onClick={(e) => setLevel("half")}>Half</Dropdown.Item>
                                            <Dropdown.Item onClick={(e) => setLevel("empty")}>Empty</Dropdown.Item>
                                        </DropdownButton>                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Label className='mt-2'>Enabled/Disabled</Form.Label>
                            <DropdownButton
                                title={enabled === "Choose" ? "Choose" : enabled ? "Enabled" : "Disabled"}
                                variant={enabled === 'Choose' ? 'secondary' : enabled ? 'success' : 'danger'}
                                className='mb-3'
                            >
                                <Dropdown.Item onClick={enable}>Enabled</Dropdown.Item>
                                <Dropdown.Item onClick={disable}>Disabled</Dropdown.Item>
                            </DropdownButton>
                            <div className='text-center'>
                                <Button disabled={loading} className='w-50 mt-3 mb-3' type='submit'>Create Ben</Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>

            </div>
        </Container>
    );
}

export default AddBen;
