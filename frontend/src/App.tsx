import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { routers } from "@/routes/routes";
import { Toaster } from "@/components/ui/sonner";
import "./utils/i18n";
import { QueryProvider } from "./contexts/QueryContext";
import ThemeProvider from "./contexts/ThemeContext";
import MainContext from "./contexts/MainContext";

function App() {
  return (
    <ThemeProvider>
      <QueryProvider>
        <MainContext>
          <BrowserRouter>
            <Routes>
              <Route>
                {routers.map((route) => (
                  <Route
                    key={route.id}
                    path={route.href}
                    element={route.element}
                  />
                ))}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
          <Toaster position="top-right" />
        </MainContext>
      </QueryProvider>
    </ThemeProvider>
  );
}

export default App;
