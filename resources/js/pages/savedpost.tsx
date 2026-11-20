import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {Navbar} from '../components/navbar';

import SavedPostsPage from '@/components/savedpost';
// import { HomeLayout } from '@/components/homelayout';


export default function Network() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
          <Navbar />
          {/* <NetworkLayout/> */}
         <SavedPostsPage/>
        
      
        </>
    );
}
