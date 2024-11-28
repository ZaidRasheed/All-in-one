import 'bootstrap/dist/css/bootstrap.min.css'
import { ContextProvider } from '../context/appContext'
import MainLayout from "../components/layout/MainLayout"
import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import LoadingSpinner from "../components/UI/LoadingSpinner"
import Error from './Error404'

const Bens = lazy(() => import('./Bins'))
const AddBen = lazy(() => import('./AddBen'))
const Home = () => {
    return (
        <ContextProvider>
            <MainLayout>
                <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                        <Route
                            path="/"
                            element={<Bens />}
                        />
                        <Route
                            path="/add-bin"
                            element={<AddBen />}
                        />
                        <Route path='/*' element={<Error />} />

                    </Routes>
                </Suspense>
            </MainLayout>
        </ContextProvider>
    );
}

export default Home;
