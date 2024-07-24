import {
    useInfiniteQuery,
    useMutation, useQuery,
    useQueryClient,

} from '@tanstack/react-query';
import {INewPost, INewUser, IUpdatePost} from "@/types";
import {
    createPost,
    createUserAccount, deletePost, deleteSavedPost, getCurrentUser, getInfinitePosts, getPostById,
    getRecentPosts,
    likePost, savePost, searchPosts,
    signInAccount,
    signOutAccount, updatePost
} from "@/lib/appwrite/api";
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
}

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

export const useLikePost = () => {
    const queryClient = useQueryClient();

    // here we do an update every time we open different pages
    return useMutation({
        mutationFn: ({postId, likesArray}: { postId: string, likesArray: string[] }) => likePost(postId, likesArray),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS, data?.$id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS, data?.$id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER, data?.$id]
            })
        }
    })
}

export const useSavedPost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({postId, userId}: { postId: string, userId: string }) => savePost(postId, userId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS, data?.$id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS, data?.$id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER, data?.$id]
            })
        }
    })
}

export const useDeleteSavedPost = () => {
    const queryClient = useQueryClient();
    // here we do an update every time we open different pages
    return useMutation({
        mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}

export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: getCurrentUser
    })
}

export const useGetPostById = (postId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
        queryFn: () => getPostById(postId),
        // what I do here with the 'enabled' property is that I only fetch the post data when the postId changes.
        // For instance, if I only reload the page, it's not going to fetch it again because it will cache it before.
        enabled: !!postId
    })
}

export const useUpdatePost = () => {
    const queryClient = useQueryClient();

    // here, 'useMutation' is used instead of 'useQuery' because we are mutating data, not fetching it.
    return useMutation({
        mutationFn: (post: IUpdatePost) => updatePost(post),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],

            })
        }
    })
}

export const useDeletePost = () => {
    const queryClient = useQueryClient();

    // here, 'useMutation' is used instead of 'useQuery' because we are mutating data, not fetching it.
    return useMutation({
        mutationFn: ({postId, imageId}: {postId:string, imageId: string}) => deletePost(postId, imageId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    })
}

export const useGetInfinitePosts = () => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
        queryFn: getInfinitePosts as any,
        getNextPageParam: (lastPage: any) => {
            // If there's no data, there are no more pages.
            if (lastPage && lastPage.documents.length === 0) {
                return null;
            }

            // Use the $id of the last document as the cursor.
            const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
            return lastId;
        },
    });
};

export const useSearchPosts = (searchTerm: string) => {
    return useQuery({
        // here I validate the query again once the searchTerm changes by adding a second prop to the queryKey
        queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
        queryFn: () => searchPosts(searchTerm),
        // Automatically re-fetch when the search term changes
        enabled: !!searchTerm
    })
}