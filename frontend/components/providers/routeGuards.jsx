"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

export function withAuth(Component) {
    return function AuthenticatedComponent(props) {
        const { user, loading } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!loading && !user) {
                router.replace("/login");
            }
        }, [user, loading, router]);

        if (loading) {
            return (
                <div className="flex min-h-[50vh] items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
                </div>
            );
        }

        if (!user) {
            return null;
        }

        return <Component {...props} />;
    };
}

export function withGuest(Component) {
    return function GuestComponent(props) {
        const { user, loading } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!loading && user) {
                router.replace("/recipes");
            }
        }, [user, loading, router]);

        if (loading) {
            return (
                <div className="flex min-h-[50vh] items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
                </div>
            );
        }

        if (user) {
            return null;
        }

        return <Component {...props} />;
    };
}
