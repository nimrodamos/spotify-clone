import React from 'react';
import { FaSpotify } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
    return (
        <div className="block absolute left-1/2 top-1/2 p-8 transform -translate-x-1/2 -translate-y-1/2 align-middle w-full text-center mt-1 overflow-clip-margin overflow-clip" color='green-500'>
            <FaSpotify className='z-10 m-auto text-essentialPositive' size={"4rem"} />
            <h1 className="text-[48px] font-bold tracking-[-0.04em] leading-none mt-[40px] mb-[16px] text-white">Page not found</h1>
            <p className='text-[#a7a7a7] inline-block font-medium mb-[40px] max-w-[507px]'>We can't seem to find the page you are looking for.</p>
            <div className="">
            <a>
            <Link to="/" className="mx-2 bg-white border hover:scale-[1.04] font-bold border-[#878787] rounded-[48px] text-black inline-block leading-[24px] mb-[36px] px-[32px] py-[12px] text-center whitespace-nowrap">
            Home
            </Link>
            </a>
            <a>
            <Link to="/help" className="text-white block text-[1em] font-bold no-underline hover:underline">
            Help
            </Link>
            </a>
            </div>
        </div>
    );
};

export default NotFoundPage;
