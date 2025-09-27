# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Environment Variables

To run this project locally and deploy it, you will need to set up your environment variables.

1.  **Create a `.env.local` file:** Copy the contents of `.env.example` into a new file named `.env.local` at the root of your project.

    ```bash
    cp .env.example .env.local
    ```

2.  **Fill in your Firebase Credentials:** Open `.env.local` and replace the placeholder values with your actual Firebase project configuration. You can find these in your Firebase project settings.

    ```
    NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_SENDER_ID"
    NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID"
    ```

## Deployment

When deploying to a hosting provider like Vercel, you must add the same environment variables to your project's settings on the Vercel dashboard.

1.  Go to your project on Vercel.
2.  Navigate to the **Settings** tab.
3.  Go to the **Environment Variables** section.
4.  Add each variable from your `.env.local` file (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY`) and its corresponding value.

This will ensure that the build process and your deployed application can successfully connect to your Firebase project, fixing any `invalid-api-key` errors.
