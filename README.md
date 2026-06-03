# VELO CRM Dashboard

## Overview

VELO CRM Dashboard is an administrative platform developed to manage products, customers, and orders within the VELO Beauty ecosystem. The dashboard provides administrators with tools to monitor business performance, manage inventory, and oversee daily operations.

This application communicates directly with the Ecommerce Backend API and is intended for authorized administrators only.

---

## Features

### Authentication

- Admin Login
- Two-Factor Authentication (2FA)
- Password Recovery
- Password Reset
- Secure Session Management

### Dashboard

- Business Overview
- Revenue Statistics
- Sales Analytics
- Activity Monitoring
- Low Stock Alerts

### Product Management

- Create Products
- Edit Products
- Delete Products
- Manage Product Variants
- Inventory Monitoring

### Order Management

- View Orders
- Update Order Status
- Track Order Progress
- Manage Deliveries

### User Management

- View Users
- Update User Roles
- Delete Users
- Customer Administration

---

## Technologies Used

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS

### State Management

- Redux Toolkit
- React Redux

### API Communication

- Axios

### Data Visualization

- Recharts

### UI Libraries

- React Toastify
- Lucide React

---

## Project Structure

```text
src/
├── app/
│   ├── dashboard/
│   ├── products/
│   ├── orders/
│   ├── users/
│   ├── login/
│   └── verify-2fa/
├── features/
│   ├── auth/
│   ├── products/
│   ├── orders/
│   └── users/
├── shared/
├── store/
├── lib/
└── types/
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/SelenA274/crm.git
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Run Development Server

```bash
npm run dev
```

---

## Dashboard Modules

### Products
- Product Creation
- Product Updates
- Product Deletion
- Variant Management

### Orders
- Order Tracking
- Status Updates
- Customer Order Monitoring

### Users
- User Administration
- Role Management
- Account Monitoring

### Analytics
- Revenue Charts
- Business Metrics
- Inventory Insights

---

## System Architecture

```text
Admin
   ↓
CRM Dashboard
   ↓
Backend API
   ↓
MongoDB Atlas
```

---

## Future Enhancements

- Advanced Reporting
- Export to Excel/PDF
- Audit Logs
- Multi-Admin Permissions
- Advanced Analytics
- Customer Segmentation

---

## Related Repositories

- Storefront: https://github.com/SelenA274/storefront
- Backend API: https://github.com/SelenA274/ecommerce-backend

---

## Author

Selen Amasha
Software Engineer Student
