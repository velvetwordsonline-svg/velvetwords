import { AdminProvider } from "@/contexts/AdminContext";
import Admin from "@/pages/Admin";

export default function App() {
  return (
    <AdminProvider>
      <Admin />
    </AdminProvider>
  );
}

