import { syncUser } from './../lib/api';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';

const useUserSync = () => {
    const { isSignedIn } = useAuth();
    const { user } = useUser();

    const {
        mutate: syncUserMutation,
        isPending,
        isSuccess,
    } = useMutation({ mutationFn: syncUser });

    useEffect(() => {
        if (isSignedIn && user && !isPending && !isSuccess) {
            const email = user.primaryEmailAddress?.emailAddress;
            const name = user.fullName || user.firstName;

            // Guard clause to ensure required fields exist
            if (!email || !name) {
                console.error('Missing required user data');
                return;
            }

            syncUserMutation({
                email,
                name,
                imageUrl: user.imageUrl,
            });
        }
    }, [isSignedIn, user, syncUserMutation, isPending, isSuccess]);
    return { isSynced: isSuccess };
};
export default useUserSync;
