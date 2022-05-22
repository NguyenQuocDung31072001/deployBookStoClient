import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
function BreadcrumbsUser() {
    const breadcrumb_value=useSelector(state=>state.breadcrumb.breadcrumb)
    let {genre_name,genre_slug,name_book}={...breadcrumb_value}
    return (
        <div>
            {genre_name && !name_book &&  (
                <div className='flex'>
                    <Link to="/user/home">
                        Home
                    </Link>
                    <span>/</span>
                    <span>{genre_name}</span>
                </div>
            )}

            {genre_name && name_book && (
                <div className='flex'>
                    <Link to="/user/home">
                        Home
                    </Link>
                    <span>/</span>
                    <Link to={`/user/home/${genre_slug}`}>
                        {genre_name}
                    </Link>
                    <span>/</span>
                    <span>{name_book}</span>
                </div>
            )}
            {/* {!genre_name && (
                <div className='flex min-w-max'>
                    {typeBook.map((type,key)=>(
                        <div className='mx-[10px] cursor-pointer hover:text-blue-900' key={key} >
                            <Link to={`/user/home/${type}`}>
                            {type}
                            </Link>
                            
                        </div>
                    ))}
                </div>
            )} */}
        </div>
    );
}

export default BreadcrumbsUser;