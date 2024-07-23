import {
  json,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import "./tailwind.css";
import { Authenticated, ConvexReactClient, Unauthenticated } from "convex/react";
import { useState } from "react";
import { ClerkProvider, SignInButton, useAuth, UserButton } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

export async function loader() {
  const {PUBLIC_CONVEX_URL, PUBLIC_CLERK_PUBLISHABLE_KEY } = process.env;
  return json({ 
    ENV: { PUBLIC_CONVEX_URL, PUBLIC_CLERK_PUBLISHABLE_KEY }
  });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { ENV } = useLoaderData<typeof loader>();
  const [convex] = useState(() => new ConvexReactClient(ENV.PUBLIC_CONVEX_URL as string));

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ClerkProvider publishableKey={ENV.PUBLIC_CLERK_PUBLISHABLE_KEY as string}>
          <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            {children}
          </ConvexProviderWithClerk>
        </ClerkProvider>
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(
              ENV
            )}`,
          }}
        />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return(
    <main>
      <header className="flex p-5 bg-gray-100 justify-between items-center">
        <nav className="flex gap-3">
          <div className="text-2xl font-bold">iMonsterist</div>
          <Link to="/">Explore</Link>
          <Link to="/monsters/my">Your Observations</Link>
          <Link to="/monsters/new">Add Monster</Link>
        </nav>
        <Unauthenticated>
          <SignInButton />
        </Unauthenticated>
        <Authenticated>
          <UserButton />
        </Authenticated>
      </header>
      <Authenticated>
        <div className="container max-w-6xl mx-auto py-8">
          <Outlet />
        </div>
      </Authenticated>
    </main>
  )
}
