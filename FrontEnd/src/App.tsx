import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import LoadingSpinner from './components/UI/LoadingSpinner'
const Home = lazy(() => import('./pages/Home'))


function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path='/manage-bins/*' element={<Home />} />
      </Routes>
    </Suspense>
  )
}

export default App
