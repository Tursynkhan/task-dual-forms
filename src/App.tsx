import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ServiceForm from "./components/ServiceForm";
import VacancyForm from "./components/VacancyForm";
import Navbar from './components/Navbar';
import FormLayout from "./components/FormLayout";
import "./assets/styles/main.scss";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes >
        <Route element={<FormLayout />}>
          <Route path="/service" element={<ServiceForm />} />
          <Route path="/vacancy" element={<VacancyForm />} />
          <Route path="*" element={<Navigate to="/service" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}