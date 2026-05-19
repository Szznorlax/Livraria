import { Route, Routes } from "react-router-dom";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import { HomePage } from "@/pages/home";
import { RequireAuth } from "@/components/require-auth";
import { Layout } from "@/components/layout";
import { CategoryListPage } from "@/pages/category-list";
import { CategoryFormPage } from "@/pages/category-form";
import { BookListPage } from "@/pages/book-list";
import { BookFormPage } from "@/pages/book-form";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* protected routes */}
        <Route element={<RequireAuth />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/categories" element={<CategoryListPage />} />
          <Route path="/categories/new"  element={<CategoryFormPage  />}  />
		      <Route path="/categories/:id"  element={<CategoryFormPage  />}  />
          <Route path="/books" element={<BookListPage />} />
          <Route  path="/books/new"  element={<BookFormPage />}  />
		      <Route  path="/books/:id"  element={<BookFormPage />}  />
        </Route>
      </Route>
    </Routes>
  );
}       