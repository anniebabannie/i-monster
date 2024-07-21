import {
  json,
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
  const {CONVEX_URL, PUBLIC_CLERK_PUBLISHABLE_KEY } = process.env;
  return json({ ENV: { CONVEX_URL, PUBLIC_CLERK_PUBLISHABLE_KEY } });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { ENV } = useLoaderData<typeof loader>();
  const [convex] = useState(() => new ConvexReactClient(ENV.CONVEX_URL as string));

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
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return(
    <main>
      <Unauthenticated>
        <SignInButton />
      </Unauthenticated>
      <Authenticated>
        <UserButton />
        <Outlet/>
      </Authenticated>
    </main>
  )
}
