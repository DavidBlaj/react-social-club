import React, {useState, useEffect} from 'react';
import {Models} from "appwrite";
import {
    useDeleteSavedPost,
    useGetCurrentUser,
    useLikePost,
    useSavedPost
} from "@/lib/react-querry/querriesAndMutations";
import {checkIsLiked} from "@/lib/utils";
import Loader from "@/components/shared/Loader";

type PostStatsProps = {
    post: Models.Document,
    userId: string
}
const PostStats = ({post, userId}: PostStatsProps) => {
    // find current likes on a specific post
    const likesList = post.likes.map((user: Models.Document) => user.$id);

    const [likes, setLikes] = useState(likesList);
    const [isSaved, setIsSaved] = useState(false);

    const {mutate: likePost} = useLikePost();
    const {mutate: savePost, isPending: isSavingPost} = useSavedPost();
    const {mutate: deleteSavedPost, isPending: isDeletingSavedPost} = useDeleteSavedPost();

    // find the current logged-in user
    const {data: currentUser} = useGetCurrentUser();

    // here, the 'save' comes from the saves array of each user. You can find this as a db field.
    const savedPostRecord = currentUser?.save.find((record: Models.Document) => record.post.$id === post.$id);

    useEffect(() => {
        // this: !! is automatic boolean assignment
        setIsSaved(!!savedPostRecord)
    }, [currentUser]);


    const handleLikedPost = (e: React.MouseEvent) => {
        // My container is clickable so what this method does is preventing me from opening the post. It just completes
        // the 'like' action, and it stops.
        e.stopPropagation();

        let newLikes = [...likes];

        const hasLiked = newLikes.includes(userId)

        if (hasLiked) {
            newLikes = newLikes.filter((id) => id !== userId)
        } else {
            newLikes.push(userId);
        }

        setLikes(newLikes);
        likePost({postId: post.$id, likesArray: newLikes})
    }

    const handleSavedPost = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (savedPostRecord) {
            setIsSaved(false);
            deleteSavedPost(savedPostRecord.$id);
        } else {
            savePost({postId: post.$id, userId});
            setIsSaved(true);
        }
    }

    return (
        <div className="flex justify-between items-center z-20">
            <div className="flex gap-2 mr-5">
                <img
                    src={`${checkIsLiked(likes, userId)
                        ? "/assets/icons/liked.svg"
                        : "/assets/icons/like.svg"}
                    `}
                    alt="like"
                    width={20}
                    height={20}
                    onClick={handleLikedPost}
                    className="cursor-pointer"
                />

                <p className="small-medium lg:base-medium">{likes.length}</p>
            </div>
            <div className="flex gap-2">
                {isSavingPost || isDeletingSavedPost ? <Loader/> :
                    <img
                        src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
                        alt="like"
                        width={20}
                        height={20}
                        onClick={handleSavedPost}
                        className="cursor-pointer"
                    />
                }
            </div>
        </div>
    )
}

export default PostStats;