import {
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery,
} from '@tanstack/react-query';
import {INewUser} from "@/types";
import {createUserAccount, signInAccount, signOutAccount} from "@/lib/appwrite/api";

/**
 * Unlike queries, 'mutations' are typically used to create/update/delete data or perform server side-effects.
 * For this purpose, TanStack Query exports a `useMutation` hook.
 */

export const useCreateUserAccountMutation = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user),
    });
};

export const useSignInAccountMutation = () => {
    return useMutation({
        mutationFn: (user: { email: string; password: string }) =>
            signInAccount(user),
    });
};

export const useSignOutAccountMutation = () => {
    return useMutation({
        // I don't have to call it(like in useSignInAccountMutation for example) because it's self calling function
        // or rather just a function declaration.
        mutationFn: signOutAccount
    })
}