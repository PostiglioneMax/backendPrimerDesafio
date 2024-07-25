import jwt from 'jsonwebtoken';
import { config } from './config/config.js';  // Asegúrate de que el path es correcto

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjVlNzc2Y2U4NTJlNDg1YjRjNzgzYTIiLCJub21icmUiOiJNYXhpbWlsaWFubyBQb3N0aWdsaW9uZSIsImVtYWlsIjoicG9zdGlzYW1hMjJAZ21haWwuY29tIiwicm9sIjoidXNlciIsImNyZWF0ZWRBdCI6IjIwMjQtMDYtMDRUMDI6MDk6NDguOTE1WiIsInVwZGF0ZWRBdCI6IjIwMjQtMDYtMDRUMDI6MDk6NDguOTE1WiIsIl9fdiI6MCwiaWF0IjoxNzIxODExMzUyLCJleHAiOjE3MjE4MTQ5NTJ9.KP4U3kN5QgXmQB1dfskY7YOgBOXwDgWC1kKKPfPeHcA';

try {
    const decoded = jwt.verify(token, config.SECRET);
    console.log('Token válido:', decoded);
} catch (error) {
    console.error('Token inválido o expirado:', error);
}
