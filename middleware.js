// /middleware.js
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: '/login', // Redirect to login if not authenticated
  },
});

export const config = {
  matcher: ['/', '/cart'], // Protect routes like cart, dashboard, etc.
};
