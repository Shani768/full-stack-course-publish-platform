import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CreateCourse from './pages/CreateCourse';
import Auth from './components/Auth/Auth';
import { Toaster } from 'react-hot-toast';
import VerifyEmail from './pages/VerifyEmail';
import CourseForm from './pages/CourseForm';
import ChapterPage from './pages/ChapterPage';
import CourseDetail from './pages/CourseDetail';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Courses from './pages/Courses';
import TransactionTable from './components/TransactionTable';
import TokenCheck from './utils/TokenCheck';

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="from-indigo-50 to-purple-100">
        <Router>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/tokencheck" element={ <ProtectedRoute> <TokenCheck /> </ProtectedRoute>} />
            
            <Route path="/transaction" element={<TransactionTable />} />
            <Route path="/course/:id" element={<ProtectedRoute><CourseForm /></ProtectedRoute>} />
            <Route path="/course/:id/chapter/:chapterId" element={<ProtectedRoute><ChapterPage /></ProtectedRoute>} />
            <Route path="/dashboard" element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
            <Route path="/verify-email" element={ <VerifyEmail /> } />
            <Route path="/dashboard/create" element={<ProtectedRoute><CreateCourse /></ProtectedRoute>} />
            <Route path="/dashboard/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
            <Route path="/dashboard/course/:id" element={<ProtectedRoute> <CourseDetail /> </ProtectedRoute>} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
