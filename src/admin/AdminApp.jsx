import React from 'react';
import { Routes, Route } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import AdminLayout from './AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import CategoryForm from './pages/CategoryForm';
import Products from './pages/Products';
import ProductForm from './pages/ProductForm';
import Blogs from './pages/Blogs';
import BlogForm from './pages/BlogForm';
import ContactSubmissions from './pages/ContactSubmissions';

export default function AdminApp() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="categories" element={<Categories />} />
        <Route path="categories/new" element={<CategoryForm />} />
        <Route path="categories/:id" element={<CategoryForm />} />
        <Route path="products" element={<Products />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id" element={<ProductForm />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="blogs/new" element={<BlogForm />} />
        <Route path="blogs/:id" element={<BlogForm />} />
        <Route path="contact" element={<ContactSubmissions />} />
      </Route>
    </Routes>
  );
}
