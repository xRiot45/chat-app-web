'use client';

import {
    Chrome,
    Eye, EyeOff,
    Github,
    Globe, HelpCircle,
    Loader2,
    Lock,
    Mail,
    Moon,
    Shield,
    Sun,
    User,
    Zap
} from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

// --- MOCK COMPONENTS (Sama agar konsisten) ---
const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

const Button = ({ className, variant = 'primary', size = 'default', isLoading, icon: Icon, children, ...props }: any) => {
  const variants: any = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 border-transparent",
    outline: "border border-slate-200 dark:border-slate-700 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200",
    secondary: "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:opacity-90"
  };
  return (
    <button 
      className={cn("inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all focus-visible:outline-none disabled:opacity-50 active:scale-95", variants[variant], size === 'default' ? "h-11 px-4" : "h-9 px-3", className)}
      disabled={isLoading} {...props}
    >
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : Icon && <Icon className="mr-2 h-4 w-4" />}
      {children}
    </button>
  );
};

const Input = ({ className, icon: Icon, label, id, ...props }: any) => (
  <div className="space-y-2">
    {label && <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>}
    <div className="relative group">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />}
      <input 
        id={id}
        className={cn("flex h-11 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all pl-10", className)} 
        {...props} 
      />
    </div>
  </div>
);

const FeatureItem = ({ icon: Icon, title, desc }: any) => (
    <div className="flex gap-4 items-start p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm">
        <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300">
            <Icon className="w-5 h-5" />
        </div>
        <div>
            <h4 className="font-bold text-white text-sm">{title}</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{desc}</p>
        </div>
    </div>
);

// --- REGISTER PAGE ---

export default function RegisterPage() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  // Logic Password Strength sederhana
  const strength = Math.min(password.length * 12, 100);
  const strengthColor = strength < 40 ? 'bg-rose-500' : strength < 80 ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <div className={`min-h-screen w-full flex transition-colors duration-500 ${isDarkMode ? 'dark bg-[#0a0a0c] text-slate-100' : 'bg-white text-slate-900'}`}>
      
      {/* LEFT SIDE - VISUAL CONTENT (Same Layout, Different Content) */}
      <div className="hidden lg:flex w-[55%] relative overflow-hidden bg-[#0f1115] flex-col justify-between p-16">
         {/* Background FX - slightly different color theme */}
         <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-violet-600/20 rounded-full blur-[150px] animate-pulse" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[150px]" />
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

         {/* Brand */}
         <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
               <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                  <Shield className="w-6 h-6 text-white" />
               </div>
               <span className="font-bold text-2xl tracking-tight text-white">NexusChat</span>
            </div>
         </div>

         {/* Feature Grid Content */}
         <div className="relative z-10 max-w-lg space-y-6">
            <h2 className="text-3xl font-bold leading-tight text-white mb-6">
               Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Secure Network</span>
            </h2>
            
            <div className="grid gap-4">
                <FeatureItem 
                    icon={Shield} 
                    title="End-to-End Encryption" 
                    desc="Your messages are encrypted before they leave your device. Only you and the recipient can read them." 
                />
                <FeatureItem 
                    icon={Zap} 
                    title="Lightning Fast" 
                    desc="Powered by Edge Computing to deliver messages in milliseconds, no matter where you are." 
                />
                <FeatureItem 
                    icon={Globe} 
                    title="Global Decentralization" 
                    desc="No central server failure points. Your data is distributed and redundant." 
                />
            </div>
         </div>

         {/* Community Footer */}
         <div className="relative z-10 pt-8 border-t border-white/10 flex items-center justify-between">
            <div className="flex -space-x-4">
               {[1,2,3,4].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/150?u=${i+10}`} className="w-10 h-10 rounded-full border-2 border-[#0f1115]" alt="" />
               ))}
               <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-[#0f1115] flex items-center justify-center text-xs font-bold text-white">
                  +2k
               </div>
            </div>
            <div className="text-right">
                <p className="text-white font-bold text-sm">Join 10,000+ Developers</p>
                <p className="text-slate-400 text-xs">Building the future together</p>
            </div>
         </div>
      </div>

      {/* RIGHT SIDE - REGISTER FORM */}
      <div className="flex-1 flex flex-col relative bg-white dark:bg-[#0a0a0c]">
         
         {/* Top Bar */}
         <div className="absolute top-0 right-0 p-6 flex items-center gap-4">
            <span className="text-sm text-slate-500">Already a member?</span>
            <Link href="/auth/login">
               <Button variant="ghost" className="text-indigo-600 dark:text-indigo-400">Sign In</Button>
            </Link>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2.5 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
               {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
         </div>

         <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
            <div className="w-full max-w-[420px] space-y-6 pt-10">
               
               <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Create Account</h1>
                  <p className="text-slate-500 dark:text-slate-400">Start your 30-day free trial. No credit card required.</p>
               </div>

               <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input id="full_name" type="text" label="Full Name" placeholder="name@company.com" icon={User} required />

                  <Input id="username" type="text" label="Username" placeholder="name@company.com" icon={User} required />
                  </div>

                  <Input id="email" type="email" label="Email Address" placeholder="name@company.com" icon={Mail} required />
                  
                  <div className="space-y-2">
                     <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                     <div className="relative">
                        <Input 
                           id="password" 
                           type={showPassword ? "text" : "password"} 
                           placeholder="Create a password" 
                           icon={Lock} 
                           value={password}
                           onChange={(e: any) => setPassword(e.target.value)}
                           className="pr-10"
                           required 
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-slate-400 hover:text-indigo-500">
                           {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                     </div>
                     {/* Strength Bar */}
                     {password.length > 0 && (
                        <div className="space-y-1">
                            <div className="h-1 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                                <div className={`h-full transition-all duration-500 ${strengthColor}`} style={{ width: `${strength}%` }}></div>
                            </div>
                            <p className="text-[10px] text-slate-500 text-right">
                                {strength < 40 ? 'Weak' : strength < 80 ? 'Good' : 'Strong'}
                            </p>
                        </div>
                     )}
                  </div>

                  {/* Terms Checkbox */}
                  <div className="flex items-start gap-2 pt-2">
                     <div className="mt-1">
                        <input type="checkbox" id="terms" className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 bg-transparent" />
                     </div>
                     <label htmlFor="terms" className="text-xs text-slate-600 dark:text-slate-400 leading-tight">
                        I agree to the <Link href="#" className="text-indigo-500 hover:underline">Terms of Service</Link> and <Link href="#" className="text-indigo-500 hover:underline">Privacy Policy</Link>.
                     </label>
                  </div>

                  <Button type="submit" className="w-full h-12 text-base shadow-indigo-500/20" isLoading={isLoading}>Create Account</Button>
               </form>

               <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200 dark:border-white/10" /></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-[#0a0a0c] px-2 text-slate-500">Or sign up with</span></div>
               </div>

               <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" icon={Github}>Github</Button>
                  <Button variant="outline" icon={Chrome}>Google</Button>
               </div>
            </div>
         </div>

         {/* Footer Links (Sama Persis dengan Login) */}
         <div className="p-6 text-center">
            <div className="flex justify-center gap-6 text-xs text-slate-500">
               <Link href="#" className="hover:text-indigo-500">Privacy Policy</Link>
               <Link href="#" className="hover:text-indigo-500">Terms of Service</Link>
               <Link href="#" className="hover:text-indigo-500 flex items-center gap-1"><HelpCircle className="w-3 h-3" /> Help Center</Link>
            </div>
         </div>

      </div>
    </div>
  );
}