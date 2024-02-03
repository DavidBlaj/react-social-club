import {
    useMutation, useQuery,
    useQueryClient,

} from '@tanstack/react-query';
import {INewPost, INewUser} from "@/types";
import {createPost, createUserAccount, getRecentPosts, signInAccount, signOutAccount} from "@/lib/appwrite/api";
import {QUERY_KEYS} from "@/lib/react-querry/queryKeys";

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


// =================================================
// POST QUERIES
// ================================================


export const useCreatePostMutation = () => {
    // Once I create a post I want to query all existing posts, so that I can show them on the Homepage
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (post: INewPost) => createPost(post),
        onSuccess: () => {
            // I invalidate the queries so that React query is going to try and get the data from the server
            // and not from cache
            // Creating a separate file or the query keys is a pro-tip. It avoids spelling errors.
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    });
}

// queryFn is a function that executes something when I try to fetch the posts.
export const useGetRecentPostsMutation = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts,

    })
}