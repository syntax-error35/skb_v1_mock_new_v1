# Shotokan Karate Bangladesh Website

A modern, responsive website for Shotokan Karate Bangladesh built with Next.js, TypeScript, and Tailwind CSS.

## 🚨 IMPORTANT: MOCK DATA MODE

**This application is currently running in MOCK DATA MODE for demonstration purposes.**

### What's Been Modified:

1. **Backend Connections Commented Out**: All API calls to the backend server have been temporarily commented out
2. **Mock Data Implementation**: A comprehensive mock data service (`lib/mockData.ts`) has been implemented
3. **Authentication Bypass**: Admin authentication now uses mock credentials (any username/password works)
4. **Full Functionality Maintained**: All features work exactly as they would with a real backend

### Files Modified for Mock Data:

- `lib/mockData.ts` - **NEW**: Complete mock data service
- `lib/auth.ts` - Modified to use mock authentication
- `app/admin/login/page.tsx` - Uses mock login API
- `app/admin/dashboard/page.tsx` - Uses mock dashboard stats
- `app/admin/members/page.tsx` - Uses mock member data
- `app/admin/notices/page.tsx` - Uses mock notice data
- `app/admin/gallery/page.tsx` - Uses mock gallery data
- `app/members/page.tsx` - Uses mock member data
- `app/notices/page.tsx` - Uses mock notice data
- `app/register/page.tsx` - Mock form submission
- `components/NoticeSection.tsx` - Uses mock notice data
- `components/GalleryGrid.tsx` - Uses mock gallery images
- `components/notices/TournamentRegistrationForm.tsx` - Mock registration

### How to Test:

1. **Admin Panel**: 
   - Go to `/admin/login`
   - Use ANY username and password (e.g., "admin" / "password")
   - All admin features are fully functional with mock data

2. **Frontend**: 
   - All pages load with realistic mock data
   - Forms accept input and show success messages
   - Navigation and interactions work normally

### Restoring Backend Connection:

When ready to reconnect to the backend:

1. Search for `// COMMENTED OUT` comments in the codebase
2. Uncomment the original backend code
3. Comment out or remove the mock data implementations
4. Delete `lib/mockData.ts`
5. Restore the original `makeAuthenticatedRequest` function in `lib/auth.ts`

---

## Features

- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Admin Panel**: Complete admin dashboard for managing content
- **Member Management**: Registration and member directory
- **Notice System**: Announcements, events, and tournaments
- **Gallery**: Photo gallery with categories
- **Tournament Registration**: Dedicated tournament signup system
- **Authentication**: Secure admin authentication
- **Responsive Design**: Works on all devices

## Tech Stack

- **Frontend**: Next.js 13, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Backend**: Node.js, Express.js, MongoDB (currently mocked)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd shotokan-karate-bangladesh
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Admin Access

- Navigate to `/admin/login`
- Use any credentials (currently in mock mode)
- Access the full admin dashboard

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel pages
│   ├── gallery/           # Gallery page
│   ├── members/           # Members page
│   ├── notices/           # Notices page
│   ├── register/          # Registration page
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── admin/            # Admin-specific components
│   ├── gallery/          # Gallery components
│   ├── notices/          # Notice components
│   └── ui/               # UI components (shadcn/ui)
├── lib/                  # Utility functions
│   ├── auth.ts           # Authentication utilities
│   ├── mockData.ts       # Mock data service (TEMPORARY)
│   └── utils.ts          # General utilities
├── types/                # TypeScript type definitions
└── backend/              # Backend API (Node.js/Express)
```

## Key Features

### Frontend
- **Home Page**: Hero slider, features, latest notices
- **Notices**: Categorized announcements, events, tournaments
- **Gallery**: Photo gallery with lightbox
- **Members**: Member directory
- **Registration**: New member signup form

### Admin Panel
- **Dashboard**: Statistics and quick actions
- **Member Management**: CRUD operations for members
- **Notice Management**: Create and manage notices/events/tournaments
- **Gallery Management**: Upload and organize photos
- **Authentication**: Secure login system

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

Create a `.env.local` file:

```env
# When connecting to real backend
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Backend Integration

The backend API is built with:
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- File upload support
- Comprehensive error handling

### API Endpoints

- `POST /api/auth/login` - Admin login
- `GET /api/members` - Get members
- `POST /api/members` - Create member
- `GET /api/notices` - Get notices
- `POST /api/notices` - Create notice
- `GET /api/gallery` - Get gallery images
- `POST /api/gallery` - Upload image

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables
3. Deploy automatically on push

### Backend (Railway/Heroku)
1. Set up MongoDB Atlas
2. Configure environment variables
3. Deploy backend API

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email info@shotokanbd.com or create an issue in the repository.