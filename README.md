# LMS Management System

A modern, responsive Learning Management System built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

### 🎯 Core Functionality
- **User Authentication**: Secure login/logout system with modal interface
- **Dashboard**: Comprehensive admin dashboard with key metrics
- **Course Management**: Tools for creating and managing educational courses
- **Student Management**: Student enrollment and progress tracking
- **Analytics**: Performance metrics and reporting tools
- **Responsive Design**: Mobile-first design that works on all devices

### 🎨 UI/UX Features
- **Modern Design**: Clean, professional interface with gradient backgrounds
- **Interactive Components**: Hover effects, animations, and smooth transitions
- **Component Library**: Built with shadcn/ui components
- **Dark Mode Ready**: CSS variables configured for theme switching
- **Accessibility**: Semantic HTML and ARIA-compliant components

### 🚀 Technical Features
- **Next.js 15**: Latest React framework with App Router
- **TypeScript**: Full type safety and better development experience
- **Tailwind CSS**: Utility-first CSS framework for rapid development
- **Responsive Grid**: CSS Grid and Flexbox for modern layouts
- **Performance**: Optimized images and efficient rendering

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd lms-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
lms-frontend/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── Dashboard.tsx   # Main dashboard interface
│   │   └── LoginModal.tsx  # Authentication modal
│   ├── globals.css         # Global styles and Tailwind config
│   ├── layout.tsx          # Root layout component
│   └── page.tsx            # Homepage component
├── lib/
│   └── utils.ts            # Utility functions
├── public/                 # Static assets
├── components.json         # shadcn/ui configuration
└── package.json            # Project dependencies
```

## Components

### Homepage (`app/page.tsx`)
- Hero section with call-to-action buttons
- Feature showcase with icons and descriptions
- Statistics display
- Pricing plans
- Customer testimonials
- Footer with navigation links

### Dashboard (`app/components/Dashboard.tsx`)
- Navigation tabs for different sections
- Statistics overview with key metrics
- Recent courses display
- Quick action buttons
- Responsive grid layouts

### Login Modal (`app/components/LoginModal.tsx`)
- Email and password authentication
- Form validation
- Loading states
- Responsive design
- Accessibility features

## Authentication Flow

1. **Unauthenticated State**: Users see the homepage with login button
2. **Login Modal**: Clicking login opens the authentication modal
3. **Authentication**: Form submission simulates API call
4. **Dashboard Access**: Successful login redirects to dashboard
5. **Logout**: Logout button returns user to homepage

## Styling

The project uses Tailwind CSS with custom CSS variables for theming:

- **Color Scheme**: Blue and indigo gradients with neutral accents
- **Typography**: Geist font family for modern readability
- **Spacing**: Consistent spacing scale using Tailwind's spacing system
- **Shadows**: Subtle shadows and hover effects for depth
- **Transitions**: Smooth animations for interactive elements

## Customization

### Colors
Update the CSS variables in `app/globals.css` to change the color scheme:

```css
:root {
  --primary: oklch(0.205 0 0);
  --accent: oklch(0.97 0 0);
  /* Add more custom colors */
}
```

### Components
Modify component files in `app/components/` to customize functionality and appearance.

### Layout
Update `app/layout.tsx` to modify the root layout and metadata.

## Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Environment Variables
Create a `.env.local` file for environment-specific configuration:

```env
NEXT_PUBLIC_API_URL=your-api-url
NEXT_PUBLIC_APP_NAME=LMS Pro
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository or contact the development team.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
