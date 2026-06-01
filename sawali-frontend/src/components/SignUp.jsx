import React from 'react';

const SignUp = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-sans py-10">
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-slate-700">
        
        {/* Header / Logo Area */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 tracking-wide text-white">Sawali Traders</h1>
          <p className="text-slate-400 text-sm">Create a new account to get started.</p>
        </div>

        {/* Sign Up Form */}
        <form className="space-y-5">
          
          {/* Full Name Input */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="fullName">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-slate-500 transition-colors"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Username / Email Input */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="email">
              Email or Username
            </label>
            <input
              type="text"
              id="email"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-slate-500 transition-colors"
              placeholder="Enter email or username"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-slate-500 transition-colors"
              placeholder="Create a password"
              required
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-slate-500 transition-colors"
              placeholder="Confirm your password"
              required
            />
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-center text-sm mt-2">
            <label className="flex items-center text-slate-400 cursor-pointer transition-colors">
              <input 
                type="checkbox" 
                className="mr-2 rounded border-slate-600 bg-slate-900 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-800" 
                required
              />
              I agree to the <a href="#" className="text-blue-500 hover:text-blue-400 ml-1">Terms & Conditions</a>
            </label>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 mt-6"
          >
            Create Account
          </button>
          
        </form>

        {/* Navigation to Sign In */}
        <div className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <a href="#" className="text-blue-500 hover:text-blue-400 font-medium transition-colors">
            Sign In
          </a>
        </div>

      </div>
    </div>
  );
};

export default SignUp;