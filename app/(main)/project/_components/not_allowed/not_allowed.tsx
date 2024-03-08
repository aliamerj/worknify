import { AppRouter } from "@/utils/router/app_router";
import Link from "next/link";
import { AiOutlineLock } from "react-icons/ai";

const NotAllowedPage = ({
  message,
  textBtn,
  linkBtn,
}: {
  message?: string;
  textBtn?: string;
  linkBtn?: string;
}) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 text-center shadow-xl">
        <AiOutlineLock className="mx-auto text-6xl text-red-500" />
        <h1 className="mb-2 mt-5 text-3xl font-semibold text-gray-800">
          Access Restricted
        </h1>
        <p className="mb-6 text-gray-600">
          {message ??
            "This project is private. If you have the necessary permissions, please log in to view it."}
        </p>
        <Link
          href={linkBtn ?? AppRouter.signup}
          className="inline-block w-full rounded-lg bg-primary px-6 py-3 text-lg text-white transition duration-300 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
        >
          {textBtn ?? "Login"}
        </Link>
        <Link
          href="/"
          className="mt-4 inline-block text-sm text-gray-500 transition duration-300 hover:text-gray-600"
        >
          Or return to homepage
        </Link>
      </div>
    </div>
  );
};

export default NotAllowedPage;
