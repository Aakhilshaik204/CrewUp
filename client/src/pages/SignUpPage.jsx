import { SignUp } from '@clerk/clerk-react';

const SignUpPage = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-gradient-to-b from-indigo-50 to-transparent" />
    </div>

    <div className="relative z-10 w-full max-w-md">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-indigo">
            <span className="text-white font-bold">C</span>
          </div>
          <span className="font-display font-bold text-2xl text-slate-900">Crew<span className="text-indigo-600">Up</span></span>
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
            formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700 rounded-xl',
            footerActionLink: 'text-indigo-600',
          },
        }}
      />
    </div>
  </div>
);

export default SignUpPage;
