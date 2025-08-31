import PageLayout from "../components/PageLayout";
import { Link } from "react-router";

function NotFound() {
  return (
    <PageLayout>
      <div className="text-center p-10 rounded-2xl bg-amber-100 shadow-xl border border-amber-200 max-w-xl">
        <h1 className="text-8xl font-extrabold text-amber-900 mb-6">404</h1>
        <h2 className="text-3xl font-semibold text-amber-800 mb-4">
          Page Not Found
        </h2>
        <p className="text-amber-700 mb-8 italic text-lg">
          Oops... looks like this page was torn out of the book. 📖
        </p>
        <Link
          to="/"
          className="inline-block px-8 py-3 text-lg rounded-xl bg-amber-900 text-amber-50 hover:bg-amber-800 transition-colors shadow-md"
        >
          Go Back Home
        </Link>
      </div>
    </PageLayout>
  );
}

export default NotFound;
