import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import AuthLayout from '@/layouts/auth-layout';
import registerimage from '../../../../public/image/registerpageimage.png'

interface RegisterForm {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    // Real-time visual feedback checklist parameters
    const checkRules = {
        hasLength: data.password.length >= 8,
        hasNumber: /\d/.test(data.password),
        hasUpper: /[A-Z]/.test(data.password),
    };

    return (
        <AuthLayout>
            <Head title="Register" />

            <div className="w-full bg-white border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[780px]">
                
                {/* Left Side Panel: Features (Spans 5 columns) */}
                <div className="lg:col-span-5 bg-[#FAF6F0] p-8 md:p-12 flex flex-col justify-between relative overflow-hidden hidden lg:flex">
                    <div className="space-y-4 max-w-sm">
                        <span className="text-[18px] font-bold uppercase tracking-widest text-[#A26227] block">Join PredictionHub</span>
                        <h1 className="text-4xl font-black text-zinc-900 tracking-tight leading-[1.15]">
                            Create your account
                        </h1>
                        <p className="text-medium text-zinc-500 leading-relaxed font-medium">
                            Join a community of thinkers and doers. Share your predictions and shape the future together.
                        </p>
                    </div>

                    {/* Central Interactive Graph Vector Art Area */}
                      <div className="my-6 flex justify-center items-center relative">
                        <img 
                            src={registerimage} 
                            alt="Illustration" 
                            className="max-w-full object-contain mix-blend-multiply"
                        />
                    </div>
                    

                    {/* Value Points Row Items */}
                    <div className="space-y-4  mt-4 max-w-sm">
                        {[
                            { title: 'Share Your Predictions', desc: 'Post and track your predictions on future events.' },
                            {  title: 'Engage with Community', desc: 'Discuss ideas and gain insights from other thinkers.' },
                            { title: 'Build Your Reputation', desc: 'Earn credibility and become a trusted voice.' }
                        ].map((item, index) => (
                            <div key={index} className="flex items-start space-x-3.5">
                               
                                <div>
                                    <h4 className="text-medium font-bold text-zinc-800">{item.title}</h4>
                                    <p className="text-[14px] text-zinc-400 font-medium mt-0.5">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side Panel: Interactive Form Submission Core (Spans 7 columns) */}
                <div className="lg:col-span-7 p-8 sm:p-12 md:p-16 flex flex-col justify-center bg-white">
                    <div className="max-w-md w-full mx-auto space-y-6">
                        
                        <div>
                            <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Create your account</h2>
                            <p className="text-xs text-zinc-400 font-medium mt-1">Let's get started! Please fill in your details.</p>
                        </div>

                        <form className="space-y-4" onSubmit={submit}>
                            
                            {/* Full Name Input */}
                            <div className="space-y-1.5">
                                <Label htmlFor="name" className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Full name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    disabled={processing}
                                    placeholder="Enter your full name"
                                    className="w-full h-11 px-4 rounded-xl border border-zinc-200 focus:border-[#A26227] focus:ring-[#A26227]/10 bg-white text-xs font-medium text-zinc-900"
                                />
                                <InputError message={errors.name} />
                            </div>

                            {/* Email Address Input */}
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    disabled={processing}
                                    placeholder="Enter your email"
                                    className="w-full h-11 px-4 rounded-xl border border-zinc-200 focus:border-[#A26227] focus:ring-[#A26227]/10 bg-white text-xs font-medium text-zinc-900"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Password Setup Input Container */}
                            <div className="space-y-1.5">
                                <Label htmlFor="password" className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        tabIndex={3}
                                        autoComplete="new-password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        disabled={processing}
                                        placeholder="Create a password"
                                        className="w-full h-11 pl-4 pr-10 rounded-xl border border-zinc-200 focus:border-[#A26227] focus:ring-[#A26227]/10 bg-white text-xs font-medium text-zinc-900"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                                <InputError message={errors.password} />

                                {/* Password Constraints Checklist Display */}
                                <div className="pt-1.5 space-y-1">
                                    {[
                                        { met: checkRules.hasLength, text: 'At least 8 characters' },
                                        { met: checkRules.hasNumber, text: 'Include a number' },
                                        { met: checkRules.hasUpper, text: 'Include an uppercase letter' },
                                    ].map((rule, index) => (
                                        <div key={index} className="flex items-center space-x-2 text-[11px] font-medium">
                                            <CheckCircle2 className={`w-3.5 h-3.5 ${rule.met ? 'text-emerald-600 fill-emerald-50' : 'text-zinc-200'}`} />
                                            <span className={rule.met ? 'text-zinc-700' : 'text-zinc-400'}>{rule.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Password Confirmation Verification Input */}
                            <div className="space-y-1.5">
                                <Label htmlFor="password_confirmation" className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Confirm password</Label>
                                <div className="relative">
                                    <Input
                                        id="password_confirmation"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        required
                                        tabIndex={4}
                                        autoComplete="new-password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        disabled={processing}
                                        placeholder="Confirm your password"
                                        className="w-full h-11 pl-4 pr-10 rounded-xl border border-zinc-200 focus:border-[#A26227] focus:ring-[#A26227]/10 bg-white text-xs font-medium text-zinc-900"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                                <InputError message={errors.password_confirmation} />
                            </div>

                            {/* Terms and Agreements Policy Row */}
                            <div className="flex items-start space-x-2.5 pt-1">
                                <Checkbox 
                                    id="terms" 
                                    required 
                                    className="rounded mt-0.5 border-zinc-300 text-[#A26227] focus:ring-[#A26227]/20 data-[state=checked]:bg-[#A26227] data-[state=checked]:border-[#A26227]" 
                                />
                                <Label htmlFor="terms" className="text-xs font-medium text-zinc-500 leading-normal select-none cursor-pointer">
                                    I agree to the <a href="#terms" className="text-[#A26227] font-bold hover:underline">Terms of Service</a> and <a href="#privacy" className="text-[#A26227] font-bold hover:underline">Privacy Policy</a>
                                </Label>
                            </div>

                            {/* Action Submission Trigger Control */}
                            <Button 
                                type="submit" 
                                className="w-full h-11 rounded-xl bg-[#A26227] hover:bg-[#8F531E] text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center space-x-2 pt-1 mt-2" 
                                tabIndex={5} 
                                disabled={processing}
                            >
                                {processing && <LoaderCircle className="h-3.5 w-3.5 animate-spin" />}
                                <span>Sign up</span>
                            </Button>
                        </form>

                        {/* Traditional Divider Splitting Section */}
                        <div className="relative my-5 flex items-center justify-center">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-zinc-100"></div>
                            </div>
                            <span className="relative bg-white px-3 text-[10px] font-bold text-zinc-400 tracking-wider uppercase">or continue with</span>
                        </div>

                        {/* Third-Party Federated Identity Button Stack */}
                        <div className="space-y-2">
                            <button type="button" className="w-full h-10.5 border border-zinc-200 hover:bg-zinc-50/80 rounded-xl flex items-center justify-center space-x-2 text-xs font-bold text-zinc-600 transition-colors">
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24"><path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0112 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115z"/><path fill="#4285F4" d="M16.04 15.345c-1.077.736-2.423 1.164-4.04 1.164-2.955 0-5.464-1.991-6.355-4.673L1.62 14.95C3.655 19.009 7.82 21.818 12 21.818c3.145 0 6.018-1.055 8.236-2.873l-4.195-3.6z"/><path fill="#34A853" d="M12 16.51c2.955 0 5.464-1.99 6.355-4.673h-6.355v-4.11h10.664c.11.564.173 1.155.173 1.782 0 3.327-1.19 6.127-3.236 8.018l4.195 3.6C21.436 18.236 24 14.536 24 10.5c0-.627-.064-1.245-.173-1.855H12v7.864z"/><path fill="#FBBC05" d="M1.62 9.05a13.064 13.064 0 000 5.9l4.026-3.115A7.027 7.027 0 015.645 9.765L1.62 9.05z"/></svg>
                                <span>Continue with Google</span>
                            </button>
                           
                        </div>

                        {/* Sign In Redirection Context Link */}
                        <div className="text-center text-xs font-semibold text-zinc-400 pt-2">
                            Already have an account?{' '}
                            <TextLink href={route('login')} className="text-[#A26227] hover:text-[#8F531E] transition-colors" tabIndex={6}>
                                Log in
                            </TextLink>
                        </div>
                    </div>
                </div>

            </div>
        </AuthLayout>
    );
}