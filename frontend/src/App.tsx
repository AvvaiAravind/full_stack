/**
 * Main application component - sets up routing and global toast notifications
 */

import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import router from "./router/router";

function App() {
  return (
    <>
      {/* Main router for application navigation */}
      <RouterProvider router={router} />
      {/* Global toast notification system */}
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
