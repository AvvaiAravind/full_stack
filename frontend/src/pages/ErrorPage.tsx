import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="flex min-h-screen flex-grow flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Error 404</h1>
      <p className="text-sm text-gray-500">Page not found</p>
      <Link to="/">Go to home</Link>
    </div>
  );
};

export default ErrorPage;
