# Discord Clone - Full Stack Real-Time Chat Application

A feature-rich Discord clone with real-time messaging, audio/video calls, server management, and more. Built with modern web technologies.

![Discord Clone Preview](discord.png)

## Features

- **Real-time messaging** using Socket.io
- **Audio/Video calls** powered by LiveKit
- **Server creation and management**
- **Channel creation** (text, audio, and video channels)
- **Direct messaging** between users
- **User authentication** with Clerk
- **File and image uploads** via UploadThing
- **Message attachments**
- **Responsive design** for all devices
- **Light/Dark mode** support
- **Emoji picker** for messages
- **Member role management** (Admin, Moderator, Guest)
- **Invitation system** for servers

## Tech Stack

### Frontend
- **Next.js 13** with App Router
- **TypeScript**
- **TailwindCSS** for styling
- **Radix UI** for accessible components
- **Zustand** for state management
- **React Hook Form** for form handling
- **Zod** for validation
- **Emoji Mart** for emoji picker

### Backend
- **Next.js API Routes**
- **Prisma ORM**
- **MySQL** database
- **Socket.io** for real-time communication
- **LiveKit** for audio/video calls
- **Clerk** for authentication
- **UploadThing** for file uploads

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16.x or higher)
- npm or yarn
- MySQL database (local or hosted)

You'll also need accounts for the following services:
- [Clerk](https://clerk.dev/) for authentication
- [UploadThing](https://uploadthing.com/) for file uploads
- [LiveKit](https://livekit.io/) for audio/video calls

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/discord-clone.git
   cd discord-clone
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Copy the `.env.example` file to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Fill in the required environment variables in the `.env` file

## Database Setup

1. Make sure your MySQL database is running

2. Update the `DATABASE_URL` in your `.env` file:
   ```
   DATABASE_URL="mysql://username:password@localhost:3306/discord_clone"
   ```

3. Run Prisma migrations to set up your database schema:
   ```bash
   npx prisma migrate dev --name init
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Database
DATABASE_URL=your_mysql_database_url
DIRECT_URL=your_direct_database_url_if_needed

# UploadThing
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id

# LiveKit
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
NEXT_PUBLIC_LIVEKIT_URL=your_livekit_url

# Socket.io
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Running the Application

1. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Building for Production

1. Build the application:
   ```bash
   npm run build
   # or
   yarn build
   ```

2. Start the production server:
   ```bash
   npm start
   # or
   yarn start
   ```

## Deployment

The application can be deployed to various platforms:

### Vercel (Recommended)

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Set up the environment variables
4. Deploy

### Other Platforms

For other platforms like Railway, Render, or a traditional server, make sure to:
1. Set up the environment variables
2. Run the build command
3. Start the production server

## Project Structure

```
discord-clone/
├── app/                  # Next.js App Router
│   ├── api/              # API routes
│   ├── (auth)/           # Authentication pages
│   ├── (invite)/         # Server invitation
│   ├── (main)/           # Main application
│   └── (setup)/          # Initial setup
├── components/           # React components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── prisma/               # Prisma schema and migrations
│   └── schema.prisma     # Database schema
├── providers/            # React context providers
├── public/               # Static assets
└── ...
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [TailwindCSS](https://tailwindcss.com/)
- [Clerk](https://clerk.dev/)
- [LiveKit](https://livekit.io/)
- [Socket.io](https://socket.io/)
- [UploadThing](https://uploadthing.com/)
