import Dashboard from "./components/Dashboard"
import FeedbackForm from "./components/FeedbackForm"
import { Routes, Route } from "react-router-dom"
import ViewCourse from "./components/ViewCourse"


function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/feedback" element={<FeedbackForm />} />
        <Route path="/:course" element={<ViewCourse />} />
      </Routes>
    </>
  )
}

export default App
