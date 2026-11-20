
// import { usePage } from '@inertiajs/react';
// import { type SharedData } from '@/types';
// import { ProfileLayout } from '@/components/ProfileLayout';

// type ProfileData = {
//     id: number;
//     name: string;
//     username: string | null;
//     bio: string | null;
//     location: string | null;
//     avatar_path: string | null;
//     cover_path: string | null;
// };

// type SocialProfileProps = SharedData & {
//     profile: ProfileData;
// };
    
// export default function SocialProfile() {
//     const { profile } = usePage<SocialProfileProps>().props;

//     return <ProfileLayout profile={profile} />;
// }

import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import type { UserProfile } from '@/types/profile';
import { ProfileLayout } from '@/components/ProfileLayout';

type SocialProfileProps = SharedData & {
    profile: UserProfile;
};

export default function SocialProfile() {
    const { profile } = usePage<SocialProfileProps>().props;

    return <ProfileLayout profile={profile} />;
}
