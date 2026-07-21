import React from 'react';
import { Routes, Route } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import AdminLayout from './AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import CategoryForm from './pages/CategoryForm';
import Series from './pages/Series';
import SeriesForm from './pages/SeriesForm';
import Products from './pages/Products';
import ProductForm from './pages/ProductForm';
import Blogs from './pages/Blogs';
import BlogForm from './pages/BlogForm';
import Testimonials from './pages/Testimonials';
import TestimonialForm from './pages/TestimonialForm';
import ContactSubmissions from './pages/ContactSubmissions';
import Analytics from './pages/Analytics';

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
        <Route path="series" element={<Series />} />
        <Route path="series/new" element={<SeriesForm />} />
        <Route path="series/:id" element={<SeriesForm />} />
        <Route path="products" element={<Products />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id" element={<ProductForm />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="blogs/new" element={<BlogForm />} />
        <Route path="blogs/:id" element={<BlogForm />} />
        <Route path="testimonials" element={<Testimonials />} />
        <Route path="testimonials/new" element={<TestimonialForm />} />
        <Route path="testimonials/:id" element={<TestimonialForm />} />
        <Route path="contact" element={<ContactSubmissions />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>
    </Routes>
  );
}
