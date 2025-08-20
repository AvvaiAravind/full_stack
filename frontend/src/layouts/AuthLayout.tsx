import { Button } from "@src/components/ui/button";
import { Outlet, useNavigate } from "react-router-dom";

const AuthLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen flex-grow flex-col items-center">
      <header className="flex w-full flex-col items-center justify-between gap-4 bg-blue-500 p-4 text-white sm:flex-row">
        <h1 className="text-center text-xl font-bold">
          User Authentication Project
        </h1>

        <Button
          className="cursor-pointer text-black hover:bg-gray-100"
          type="button"
          variant="outline"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </header>
      <main className="w-full max-w-screen-lg flex-grow p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
