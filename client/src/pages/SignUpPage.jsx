import { SignUp } from '@clerk/clerk-react';

const SignUpPage = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-gradient-to-b from-indigo-50 to-transparent" />
    </div>

    <div className="relative z-10 w-full max-w-md">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 mb-4">
          <img src="/logo.jpeg" alt="CrewUp" className="w-10 h-10 rounded-xl object-cover shadow-sm" />
          <span className="font-display font-bold text-2xl text-slate-900">Crew<span className="text-primary-600">Up</span></span>
        </div>
        <h1 className="font-display font-bold text-2xl text-slate-900 mb-1">Join CrewUp</h1>
        <p className="text-slate-500 text-sm">Create your account and find your squad</p>
      </div>

      <SignUp
        routing="path"
        path="/sign-up"
        fallbackRedirectUrl="/dashboard"
        forceRedirectUrl="/dashboard"
        appearance={{
          elements: {
            rootBox: 'w-full',
            card: 'shadow-card-xl border border-slate-200 rounded-2xl',
            headerTitle: 'hidden',
            headerSubtitle: 'hidden',
            socialButtonsBlockButton: 'border border-slate-200 rounded-xl font-medium',
            formFieldInput: 'rounded-xl border-slate-200 text-slate-800',
            formButtonPrimary: 'bg-primary-600 hover:bg-primary-700 rounded-xl',
            footerActionLink: 'text-primary-600',
          },
        }}
      />
    </div>
  </div>
);

export default SignUpPage;
