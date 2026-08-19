import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { routers } from "@/routes/routes";
import { Toaster } from "@/components/ui/sonner";
import "./utils/i18n";
import { QueryContext } from "./contexts/QueryContext";
import ThemeContext from "./contexts/ThemeContext";

function App() {
  return (
    <ThemeContext>
      <QueryContext>
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
      </QueryContext>
    </ThemeContext>
  );
}

export default App;
