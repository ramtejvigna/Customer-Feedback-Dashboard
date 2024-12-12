import Dashboard from "./components/Dashboard"
import FeedbackForm from "./components/FeedbackForm"
import { Routes, Route } from "react-router-dom"


function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/feedback" element={<FeedbackForm />} />
      </Routes>
    </>
  )
}

export default App
