
import React, { useState, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import { MapPin, Edit2, X, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserProfile } from '@/types/profile';

interface ProfileHeaderProps {
    profile: UserProfile;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);

    // const [editForm, setEditForm] = useState({
    //     name: profile.name,
    //     username: profile.username ?? '',
    //     bio: profile.bio ?? '',
    //     location: profile.location ?? '',
    // });
    const {
    data,
    setData,
    post,
    processing,
    errors,
  } = useForm({
      name: profile.name,
      username: profile.username ?? '',
      bio: profile.bio ?? '',
      location: profile.location ?? '',
      avatar: null as File | null,
      cover: null as File | null,
  });

    const fileInputCoverRef = useRef<HTMLInputElement>(null);
    const fileInputAvatarRef = useRef<HTMLInputElement>(null);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Cover image preview
    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setData('cover', file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    // Avatar image preview
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setData('avatar', file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    // Open edit modal
    // const handleOpenEdit = () => {
    //     setEditForm({
    //         name: profile.name,
    //         username: profile.username ?? '',
    //         bio: profile.bio ?? '',
    //         location: profile.location ?? '',
    //     });

    //     setIsEditModalOpen(true);
    // };

    const handleOpenEdit = () => {
    setData('name', profile.name);
    setData('username', profile.username ?? '');
    setData('bio', profile.bio ?? '');
    setData('location', profile.location ?? '');

    setIsEditModalOpen(true);
    };

    // Save profile changes
    const handleSaveChanges = (e: React.FormEvent) => {
        e.preventDefault();

        // Laravel/Inertia integration will be added next.
        post(route('social-profile.update'), {
            forceFormData: true,
            preserveScroll: true,

            onSuccess: () => {
                setIsEditModalOpen(false);
                setAvatarPreview(null);
                setCoverPreview(null);
            },
        });
    };

    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.01)] relative text-left rounded-2xl">

            {/* Hidden File Inputs */}
            <input
                type="file"
                ref={fileInputCoverRef}
                onChange={handleCoverChange}
                accept="image/*"
                className="hidden"
            />

            <input
                type="file"
                ref={fileInputAvatarRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
            />

            {/* Cover Image */}
            <div
                className="h-44 bg-gradient-to-r from-zinc-900 via-zinc-800 to-stone-900 relative flex items-end justify-end bg-cover bg-center transition-all duration-300"
                style={{
                    backgroundImage: coverPreview
                        ? `url(${coverPreview})`
                        : profile.cover_path
                            ? `url(/storage/${profile.cover_path})`
                            : undefined,
                }}
            >
                {!coverPreview && !profile.cover_path && (
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
                )}

                <button
                    type="button"
                    onClick={() => fileInputCoverRef.current?.click()}
                    className="absolute top-4 right-4 bg-white/90 dark:bg-zinc-800/90 hover:bg-white backdrop-blur-xs px-4 py-1.5 rounded-xl shadow-sm text-zinc-800 dark:text-zinc-200 text-xs font-bold tracking-tight transition-transform flex items-center gap-1.5 active:scale-95 z-10"
                >
                    <Camera className="w-3.5 h-3.5 text-[#b46d23]" />
                    <span>Edit cover</span>
                </button>
            </div>

            {/* Profile Information */}
            <div className="px-6 pb-6 relative">

                {/* Avatar and Edit Button */}
                <div className="absolute -top-14 left-6 flex justify-between items-end w-[calc(100%-3rem)]">

                    <div className="w-28 h-28 rounded-full border-4 border-white dark:border-zinc-900 overflow-hidden relative shadow-md select-none group bg-gradient-to-br from-[#b46d23] to-[#804c15]">

                        {avatarPreview || profile.avatar_path ? (
                            <img
                                src={
                                    avatarPreview ??
                                    `/storage/${profile.avatar_path}`
                                }
                                alt={profile.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full text-white font-black text-2xl flex items-center justify-center tracking-tighter">
                                {profile.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')
                                    .toUpperCase()}
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={() => fileInputAvatarRef.current?.click()}
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1"
                        >
                            <Camera className="w-4 h-4" />
                            <span className="text-[9px] font-black uppercase tracking-wider">
                                Change
                            </span>
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={handleOpenEdit}
                        className="p-2 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200/60 dark:border-zinc-700/60 rounded-xl transition shadow-xs group active:scale-95 flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300 text-xs font-bold"
                    >
                        <Edit2 className="w-3.5 h-3.5 text-[#b46d23]" />
                        <span>Edit details</span>
                    </button>
                </div>

                {/* Name, Username, Bio and Location */}
                <div className="pt-16">

                    <h1 className="text-xl font-black text-zinc-950 dark:text-zinc-100 tracking-tight">
                        {profile.name}
                    </h1>

                    {profile.username && (
                        <p className="text-xs text-zinc-500 mt-1">
                            @{profile.username}
                        </p>
                    )}

                    <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-2 max-w-3xl">
                        {profile.bio || 'Add a bio to introduce yourself.'}
                    </p>

                    {profile.location && (
                        <div className="flex items-center gap-1 text-xs text-zinc-500 mt-3">
                            <MapPin className="w-3.5 h-3.5 text-[#b46d23]" />
                            {profile.location}
                        </div>
                    )}

                </div>
            </div>

            {/* Edit Profile Modal */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

                        {/* Background Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute inset-0 bg-zinc-950/40 backdrop-blur-xs"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: 15 }}
                            transition={{ type: 'spring', duration: 0.35 }}
                            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-lg rounded-2xl flex flex-col shadow-2xl relative overflow-hidden z-10"
                        >

                            {/* Modal Header */}
                            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                                <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-wider">
                                    Edit Intro Details
                                </h3>

                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Modal Form */}
                            <form
                                onSubmit={handleSaveChanges}
                                className="p-5 space-y-4 text-xs font-bold text-zinc-500 dark:text-zinc-400"
                            >

                                {/* Profile Photo */}
                                <div className="flex items-center space-x-4 bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">

                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-200 shrink-0 relative group">
                                        {avatarPreview || profile.avatar_path ? (
                                            <img
                                                src={
                                                    avatarPreview ??
                                                    `/storage/${profile.avatar_path}`
                                                }
                                                alt="Profile Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center font-bold text-zinc-400 bg-zinc-200 dark:bg-zinc-700">
                                                Pic
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <h4 className="text-zinc-800 dark:text-zinc-200 font-extrabold text-[11px] uppercase tracking-wide">
                                            Profile Photo
                                        </h4>

                                        <button
                                            type="button"
                                            onClick={() => fileInputAvatarRef.current?.click()}
                                            className="text-[#b46d23] hover:underline mt-0.5 block text-[10px]"
                                        >
                                            Update photo from local files
                                        </button>
                                    </div>
                                </div>

                                {/* Full Name */}
                                <div className="space-y-1">
                                    <label className="block tracking-wide uppercase text-[10px]">
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        required
                                          value={data.name}
                                          onChange={(e) => setData('name', e.target.value)}
                                          className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 rounded-xl outline-none text-zinc-900 dark:text-zinc-100 focus:border-[#b46d23] transition font-medium"
                                        />
                                    {errors.name && (
                                        <p className="text-red-500 text-[11px] mt-1">{errors.name}</p>
                                    )}
                                </div>

                                {/* Username */}
                                <div className="space-y-1">
                                    <label className="block tracking-wide uppercase text-[10px]">
                                        Username
                                    </label>

                                    <input
                                        type="text"
                                        value={data.username}
                                        onChange={(e) => setData('username',e.target.value)}
                                        className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 rounded-xl outline-none text-zinc-900 dark:text-zinc-100 focus:border-[#b46d23] transition font-medium"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-[11px] mt-1">{errors.name}</p>
                                    )}
                                </div>

                                {/* Bio */}
                                <div className="space-y-1">
                                    <label className="block tracking-wide uppercase text-[10px]">
                                        Bio
                                    </label>

                                    <textarea
                                        rows={3}
                                        value={data.bio}
                                        onChange={(e) =>
                                            setData('bio', e.target.value,)
                                        }
                                        className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 rounded-xl outline-none text-zinc-900 dark:text-zinc-100 focus:border-[#b46d23] transition font-medium resize-none"
                                    />
                                </div>

                                {/* Location */}
                                <div className="space-y-1">
                                    <label className="block tracking-wide uppercase text-[10px]">
                                        Location
                                    </label>

                                    <input
                                        type="text"
                                        value={data.location}
                                        onChange={(e) =>
                                            setData(
                                                'location', e.target.value,
                                            )
                                        }
                                        className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 rounded-xl outline-none text-zinc-900 dark:text-zinc-100 focus:border-[#b46d23] transition font-medium"
                                    />
                                </div>

                                {/* Modal Footer */}
                                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end space-x-2">

                                    <button
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="h-8 px-4 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-extrabold rounded-full transition active:scale-95"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="h-8 px-5 bg-[#b46d23] hover:bg-[#965a1b] disabled:opacity-50 text-white font-extrabold rounded-full transition shadow-sm active:scale-95"
                                      >
                                        {processing ? 'Saving...' : 'Save Changes'}
                                    </button>

                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
