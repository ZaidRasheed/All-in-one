import 'bootstrap/dist/css/bootstrap.min.css'

import { Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function Error() {
    return (
        <Container
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "100vh" }}
        >
            <div className="w-100" style={{ maxWidth: "450px" }}>
                <div className="w-100 text-center mt-2">
                    <h1 className='display-1'>404</h1>
                    <h1 className='display-5'>Error</h1>
                </div>
                <div className="w-100 text-center mt-2">
                    <Link to='/manage-bins'>Go Back?</Link>
                </div>
            </div>
        </Container>
    )
}