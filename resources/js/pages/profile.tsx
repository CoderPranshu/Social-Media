import { type SharedData } from '@/types';
import {  usePage } from '@inertiajs/react';
import {Navbar} from '../components/navbar';

import { ProfileLayout } from '@/components/ProfileLayout';
import SocialProfile from '@/components/SocialProfile';
// import { HomeLayout } from '@/components/homelayout';


export default function Network() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
          <Navbar />
          {/* <NetworkLayout/> */}
          {/* <ProfileLayout/> */}
          <SocialProfile/>
        </>
    );
}
