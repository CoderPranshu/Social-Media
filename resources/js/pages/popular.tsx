import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {Navbar} from '../components/navbar';
import { NetworkLayout } from '@/components/NetworkLayout';
import { PopularFeed } from '@/components/popular';
// import { HomeLayout } from '@/components/homelayout';


export default function Network() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
          <Navbar />
          {/* <NetworkLayout/> */}
          <PopularFeed/>
        
      
        </>
    );
}
