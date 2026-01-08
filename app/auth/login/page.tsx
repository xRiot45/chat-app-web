'use client';

import {
    Chrome,
    Eye, EyeOff,
    Github,
    Globe, HelpCircle,
    Loader2,
    Lock,
    Mail,
    Moon, Sun,
    Wallet
} from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

// --- MOCK COMPONENTS ---
const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

const Button = ({ className, variant = 'primary', size = 'default', isLoading, icon: Icon, children, ...props }: any) => {
  const variants: any = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 border-transparent",
    outline: "border border-slate-200 dark:border-slate-700 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200",
    ghost: "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400",
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

const Checkbox = ({ id, label }: any) => (
  <div className="flex items-center space-x-2">
    <input type="checkbox" id={id} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 bg-transparent" />
    <label htmlFor={id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600 dark:text-slate-400 cursor-pointer select-none">
      {label}
    </label>
  </div>
);

// --- LOGIN PAGE ---

export default function LoginPage() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className={`min-h-screen w-full flex transition-colors duration-500 ${isDarkMode ? 'dark bg-[#0a0a0c] text-slate-100' : 'bg-white text-slate-900'}`}>
      
      {/* LEFT SIDE - VISUAL CONTENT */}
      <div className="hidden lg:flex w-[55%] relative overflow-hidden bg-[#0f1115] flex-col justify-between p-16">
         {/* Background FX */}
         <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-indigo-600/20 rounded-full blur-[150px] animate-pulse" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-fuchsia-600/20 rounded-full blur-[150px]" />
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

         {/* Brand */}
         <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
               <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <Globe className="w-6 h-6 text-white" />
               </div>
               <span className="font-bold text-2xl tracking-tight text-white">NexusChat</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-medium text-indigo-300">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
               </span>
               v2.4 System Operational
            </div>
         </div>

         {/* Content Middle */}
         <div className="relative z-10 max-w-lg space-y-6">
            <h2 className="text-4xl font-bold leading-tight text-white">
               Connect with the future of <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">Decentralized Messaging.</span>
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
               Experience ultra-low latency chats, quantum-resistant encryption, and a UI so soft you'll want to touch it.
            </p>
            
            {/* Stats */}
            <div className="flex gap-8 pt-4 border-t border-white/10">
               <div>
                  <p className="text-2xl font-bold text-white">2M+</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Active Users</p>
               </div>
               <div>
                  <p className="text-2xl font-bold text-white">99.9%</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Uptime</p>
               </div>
               <div>
                  <p className="text-2xl font-bold text-white">&lt;50ms</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Latency</p>
               </div>
            </div>
         </div>

         {/* Footer Quote */}
         <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
            <div className="flex gap-4">
               <img src="https://i.pravatar.cc/150?u=5" className="w-12 h-12 rounded-full border-2 border-indigo-500/50" alt="User" />
               <div>
                  <p className="text-slate-200 text-sm italic">"The best chat platform I've used for my remote team. The Web3 integration is seamless."</p>
                  <p className="text-indigo-400 text-xs font-bold mt-2">Alex Chen &bull; CTO at Polygon</p>
               </div>
            </div>
         </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="flex-1 flex flex-col relative bg-white dark:bg-[#0a0a0c]">
         
         {/* Top Bar */}
         <div className="absolute top-0 right-0 p-6 flex items-center gap-4">
            <span className="text-sm text-slate-500">Don't have an account?</span>
            <Link href="/auth/register">
               <Button variant="ghost" className="text-indigo-600 dark:text-indigo-400">Sign Up</Button>
            </Link>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2.5 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
               {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
         </div>

         <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-[420px] space-y-8">
               
               <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome Back</h1>
                  <p className="text-slate-500 dark:text-slate-400">Enter your credentials to access your workspace.</p>
               </div>

               {/* Social Login */}
               <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" icon={Github}>Github</Button>
                  <Button variant="outline" icon={Chrome}>Google</Button>
               </div>
               
               <div className="relative">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200 dark:border-white/10" /></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-[#0a0a0c] px-2 text-slate-500">Or continue with email</span></div>
               </div>

               <form onSubmit={handleSubmit} className="space-y-5">
                  <Input id="email" type="email" label="Email Address" placeholder="name@company.com" icon={Mail} required />
                  
                  <div className="space-y-2">
                     <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                        <Link href="#" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline">Forgot Password?</Link>
                     </div>
                     <div className="relative">
                        <Input 
                           id="password" 
                           type={showPassword ? "text" : "password"} 
                           placeholder="••••••••" 
                           icon={Lock} 
                           className="pr-10"
                           required 
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-slate-400 hover:text-indigo-500">
                           {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                     </div>
                  </div>

                  <Checkbox id="remember" label="Remember me for 30 days" />

                  <Button type="submit" className="w-full h-12 text-base shadow-indigo-500/20" isLoading={isLoading}>Sign In</Button>
                  
                  <Button type="button" variant="secondary" className="w-full h-12 text-base" icon={Wallet}>Connect Wallet (Web3)</Button>
               </form>
            </div>
         </div>

         {/* Footer Links */}
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