const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login', { title: 'Login - StaffIQ' });
});

app.get('/dashboard', (req, res) => {
  res.render('dashboard', { title: 'Dashboard - StaffIQ' });
});

app.get('/employees', (req, res) => {
  res.render('employees', { title: 'Employees - StaffIQ' });
});

app.get('/attendance', (req, res) => {
  res.render('attendance', { title: 'Attendance - StaffIQ' });
});

app.get('/payroll', (req, res) => {
  res.render('payroll', { title: 'Payroll - StaffIQ' });
});

app.get('/clients', (req, res) => {
  res.render('clients', { title: 'Clients - StaffIQ' });
});

app.get('/sales', (req, res) => {
  res.render('sales', { title: 'Sales - StaffIQ' });
});

app.get('/finance', (req, res) => {
  res.render('finance', { title: 'Finance - StaffIQ' });
});

app.get('/inventory', (req, res) => {
  res.render('inventory', { title: 'Inventory - StaffIQ' });
});

app.get('/analytics', (req, res) => {
  res.render('analytics', { title: 'Analytics - StaffIQ' });
});

// API Routes
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  // TODO: Implement real authentication
  res.json({ success: true, token: 'demo_token' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).render('404', { title: '404 - Page Not Found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    title: 'Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ StaffIQ Frontend running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
});
