import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { BookPage, BookPageAction, BookPageLoader, ErrorPage, HomePage } from "./Pages";

const homeRouter = {
  index: true,
  element: <HomePage />,
};

const bookRouter = {
  path: "/books",
  element: <BookPage />,
  loader: BookPageLoader,
  action: BookPageAction,
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [homeRouter, bookRouter],
  },
]);
