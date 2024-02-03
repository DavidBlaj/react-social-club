import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import {bottombarLinks} from "@/constants";

const Bottombar = () => {
    const {pathname} = useLocation();
    return (
        <section className="bottom-bar">
            {bottombarLinks.map((link) => {
                const isActive = pathname === link.route;
                return (
                    /* the 'group' in className is used to specify that the style is applied to all the items
                       in the group, in this case to all the li items */
                    <Link
                        to={link.route}
                        key={link.label}
                        className={`${isActive && 'bg-primary-500 rounded-[10px]'} flex-center flex-col gap-1 p-2 transition`}
                    >
                        <img
                            src={link.imgURL}
                            alt={link.label}
                            width={18}
                            height={18}
                            className={`${isActive && 'invert-white'}`}
                        />
                        <p className="tiny-medium text-light-2">{link.label}</p>
                    </Link>
                )
            })}
        </section>
    )
}

export default Bottombar;