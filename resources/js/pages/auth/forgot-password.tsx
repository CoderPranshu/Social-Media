import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, KeyRound } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import registerimage from '../../../../public/image/registerpageimage.png'

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <AuthLayout>
            <Head title="Forgot password" />

            <div className="w-full bg-white border border-zinc-100 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.015)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
                
                {/* Left Side Panel: Support & Security Context (Spans 5 columns) */}
                <div className="lg:col-span-5 bg-[#FAF6F0] p-8 md:p-12 flex flex-col justify-between relative overflow-hidden hidden lg:flex">
                    <div className="space-y-4 max-w-sm">
                        <span className="text-[14px] font-bold uppercase tracking-widest text-[#A26227] block">Account Recovery</span>
                        <h1 className="text-3xl font-black text-zinc-900 tracking-tight leading-[1.15]">
                            Reset your password
                        </h1>
                        <p className="text-sm text-zinc-500 leading-relaxed font-medium">
                            Don't worry, it happens. Provide your email address, and we'll help you regain secure access to your account.
                        </p>
                    </div>

                    {/* Central Security Vector Art Area */}
                 <div className="my-6 flex justify-center items-center relative">
                        <img 
                            src={registerimage} 
                            alt="Analytics Graph Vector" 
                            className="max-w-full object-contain mix-blend-multiply"
                        />
                    </div>

                    {/* Safety & Security Notice Points */}
                   
                </div>

                {/* Right Side Panel: Form Core Actions (Spans 7 columns) */}
                <div className="lg:col-span-7 p-8 sm:p-12 md:p-16 flex flex-col justify-center bg-white">
                    <div className="max-w-md w-full mx-auto space-y-6">
                        
                        <div>
                            <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Forgot password?</h2>
                            <p className="text-xs text-zinc-400 font-medium mt-1">Enter your email address below to receive a recovery link.</p>
                        </div>

                        {status && (
                            <div className="p-3.5 bg-emerald-50 rounded-xl text-xs font-semibold text-emerald-700 border border-emerald-100 leading-relaxed">
                                {status}
                            </div>
                        )}

                        <form className="space-y-5" onSubmit={submit}>
                            
                            {/* Email Address Input */}
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    autoComplete="off"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Enter your registered email"
                                    className="w-full h-11 px-4 rounded-xl border border-zinc-200 focus:border-[#A26227] focus:ring-[#A26227]/10 bg-white text-xs font-medium text-zinc-900"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Action Submission Button */}
                            <Button 
                                type="submit" 
                                className="w-full h-11 rounded-xl bg-[#A26227] hover:bg-[#8F531E] text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center space-x-2 pt-1 mt-2" 
                                disabled={processing}
                            >
                                {processing && <LoaderCircle className="h-3.5 w-3.5 animate-spin" />}
                                <span>Email password reset link</span>
                            </Button>
                        </form>

                        {/* Back To Core Login Router View */}
                        <div className="text-center text-xs font-semibold text-zinc-400 pt-4 border-t border-zinc-50 flex items-center justify-center space-x-1">
                            <span>Remember your password?</span>
                            <TextLink href={route('login')} className="text-[#A26227] hover:text-[#8F531E] transition-colors">
                                Log in
                            </TextLink>
                        </div>

                    </div>
                </div>

            </div>
        </AuthLayout>
    );
}