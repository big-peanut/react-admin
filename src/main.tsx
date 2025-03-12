//?? Importing StrictMode from React
//? StrictMode is a special wrapper component provided by React.
//? It helps detect potential problems in an application during development.
//? It does not render any UI but activates additional checks and warnings.
//? This is particularly useful for catching issues with deprecated lifecycle methods and side effects.
//? It has no effect in production mode.
import { StrictMode } from 'react'
//?? Importing ReactDOM for rendering the app into the browser's DOM
//? ReactDOM is used to create and control the root of the React application.
//? The 'client' version of ReactDOM is imported because React 18 introduced concurrent rendering features.
//? This allows for improved rendering performance and responsiveness.
import ReactDOM from 'react-dom/client'
//?? Importing AxiosError for handling API errors in a structured way
//? AxiosError is a special error type provided by Axios, a popular HTTP client for making API requests.
//? This helps in identifying API-related errors separately from other types of errors.
//? By catching errors as AxiosError, we can inspect properties like response status and error messages.
import { AxiosError } from 'axios'
//?? Importing QueryCache, QueryClient, and QueryClientProvider from React Query
//? QueryClient manages all queries and mutations across the app, acting as a cache manager.
//? QueryCache handles how errors and cache updates are managed globally.
//? QueryClientProvider is the component that makes QueryClient available to the entire app.
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
//?? Importing TanStack Router utilities for managing client-side routing
//? RouterProvider is responsible for rendering the correct route components based on the current URL.
//? createRouter is a function that creates a router instance, defining how routes are structured and managed.
import { RouterProvider, createRouter } from '@tanstack/react-router'
//?? Importing authentication store from a custom store using Zustand
//? This is a state management solution that keeps track of user authentication details.
//? The useAuthStore function allows us to get and update authentication state anywhere in the app.
//? This is useful for checking if a user is logged in and managing authentication-related actions like login/logout.
import { useAuthStore } from '@/stores/authStore'
//?? Importing a utility function to handle API errors
//? The handleServerError function is likely a custom utility that logs errors and provides user-friendly messages.
//? This ensures a consistent approach to handling and displaying server errors throughout the app.
import { handleServerError } from '@/utils/handle-server-error'
//?? Importing a custom hook for displaying toast notifications
//? Toast notifications are small messages that pop up to inform users about events (like errors or success messages).
//? This hook provides an easy way to trigger these notifications throughout the app.
import { toast } from '@/hooks/use-toast'
//?? Importing FontProvider to manage font settings across the app
//? FontProvider is a React context provider that likely manages different font styles and preferences.
//? This allows users to dynamically switch between different font types or sizes for accessibility.
import { FontProvider } from './context/font-context'
//?? Importing ThemeProvider to manage themes (light/dark mode)
//? This provider wraps the entire application, allowing components to access the theme state.
//? It likely provides functions to switch between dark and light themes based on user preferences.
import { ThemeProvider } from './context/theme-context'
//?? Importing the global stylesheet for the application
//? This CSS file contains styles that apply to the entire app, including resets, themes, and layouts.
import './index.css'
//?? Importing the generated route tree for the application
//? This file is auto-generated based on the application's defined routes.
//? It contains all available routes and their configurations, ensuring consistency in navigation.
import { routeTree } from './routeTree.gen'

/*
 * Creating an instance of QueryClient to manage API calls and caching.
 * QueryClient centralizes data fetching logic, caching, and background updates.
 * It is highly efficient because it prevents unnecessary API calls by caching responses.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /*
       * Defining how API queries should behave
       * The retry function determines whether a failed request should be retried.
       * - In development mode, errors are logged for debugging.
       * - In production, a failed request is retried up to 3 times before giving up.
       * - Requests with 401 (Unauthorized) or 403 (Forbidden) errors are never retried.
       */
      retry: (failureCount, error) => {
        //?? Log error details only in development mode for debugging purposes
        if (import.meta.env.DEV) console.log({ failureCount, error })

        //?? In development mode, disable retries after any failure
        if (failureCount >= 0 && import.meta.env.DEV) return false

        //?? In production, allow up to 3 retries before giving up
        if (failureCount > 3 && import.meta.env.PROD) return false

        //?? Do not retry API requests if the error is related to authentication (401 or 403)
        return !(
          error instanceof AxiosError &&
          [401, 403].includes(error.response?.status ?? 0)
        )
      },

      //?? Automatically refetch data when the window gains focus, but only in production
      refetchOnWindowFocus: import.meta.env.PROD,

      //?? Data becomes "stale" after 10 seconds, meaning it will be refetched if needed
      staleTime: 10 * 1000, //? 10 seconds
    },

    mutations: {
      /*
       ? Handling errors for mutations (POST, PUT, DELETE requests)
       ? If an error occurs while modifying data, display an appropriate message.
       */
      onError: (error) => {
        //?? Call the global error handler to log and process the error
        handleServerError(error)

        //?? If the error is a 304 (Not Modified), show a toast notification
        if (error instanceof AxiosError) {
          if (error.response?.status === 304) {
            toast({
              variant: 'destructive',
              title: 'Content not modified!',
            })
          }
        }
      },
    },
  },

  /*
   ? Creating a QueryCache to manage error handling and caching of queries
   ? The query cache is responsible for handling data synchronization across components.
   */
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof AxiosError) {
        //?? If the user session has expired, log them out and redirect to login page
        if (error.response?.status === 401) {
          toast({ variant: 'destructive', title: 'Session expired!' })
          useAuthStore.getState().auth.reset()
          router.navigate({ to: '/sign-in' })
        }

        //?? If the server encounters an internal error, show an error page
        if (error.response?.status === 500) {
          toast({ variant: 'destructive', title: 'Internal Server Error!' })
          router.navigate({ to: '/500' })
        }
      }
    },
  }),
})

/*
 ? Creating a new instance of the router with all available routes.
 ? The router is responsible for navigating between pages based on the URL.
 ? It integrates with React Query to provide seamless data fetching.
 */
const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})

//?? Registering the router instance for TypeScript support
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

//?? Getting the root element from the HTML file where the app will be mounted
const rootElement = document.getElementById('root')!

//?? Checking if the root element is empty before rendering the React app
if (!rootElement.innerHTML) {
  //?? Creating a React root and rendering the application inside it
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
          <FontProvider>
            <RouterProvider router={router} />
          </FontProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  )
}
