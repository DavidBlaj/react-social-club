import React, {useEffect} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {useSignOutAccountMutation} from "@/lib/react-querry/querriesAndMutations";
import {useUserContext} from "@/context/AuthContext";

const Topbar = () => {
    const {mutate: signOut, isSuccess} = useSignOutAccountMutation();
    const navigate = useNavigate();
    const {user} = useUserContext();
    useEffect(() => {
        // navigate(0) is going to take me to the sign-in or sign-out screen.
        if (isSuccess) navigate(0)
    }, [isSuccess]);

    return (
        <section className="topbar">
            {/* py-4 top and bottom padding
                px-5 5px left and right padding
                items-center because I need to center the image
            */}
            <div className="flex-between py-4 px-5">
                <Link to="/" className="flex gap-3 items-center">
                    <img
                        src="/assets/images/logo.svg"
                        alt="logo"
                        width={130}
                        height={325}
                    />
                </Link>
                <div className="flex gap-4">
                    {/* a reusable button component coming from shadcn*/}
                    <Button
                        variant="ghost"
                        className="shad-button_ghost"
                        onClick={() => signOut()}>
                        <img
                            src="/assets/icons/logout.svg"
                            alt="logout"
                        />
                    </Button>
                    <Link to={`/profile/${user.id}`} className="flex-center gap-3">
                        {/* rounded-full -  allows to round the image really easily*/}
                        <img
                            src={user.imageUrl || '/assets/icons/profile-placeholder.svg'}
                            alt="profile"

                            className="h-8 w-8 rounded-full"
                        />
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default Topbar;