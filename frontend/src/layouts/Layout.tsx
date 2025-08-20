import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex min-h-screen flex-grow flex-col items-center">
      <header className="w-full bg-blue-500 p-4 text-white">
        <h1 className="text-center text-2xl font-bold">User Authentication Project</h1>
      </header>
      <main className="w-full max-w-screen-lg flex-grow p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
