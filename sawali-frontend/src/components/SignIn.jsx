import React from 'react';

const SignIn = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-sans">
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-slate-700">
        
        {/* Header / Logo Area */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 tracking-wide text-white">Sawali Traders</h1>
          <p className="text-slate-400 text-sm">Welcome back! Please sign in to your account.</p>
        </div>

        {/* Sign In Form */}
        <form className="space-y-6">
          
          {/* Username / Email Input */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-slate-500 transition-colors"
              placeholder="Enter your username"
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
              placeholder="••••••••"
              required
            />
          </div>

          {/* Additional Options */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-slate-400 hover:text-white cursor-pointer transition-colors">
              <input 
                type="checkbox" 
                className="mr-2 rounded border-slate-600 bg-slate-900 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-800" 
              />
              Remember me
            </label>
            <a href="#" className="text-blue-500 hover:text-blue-400 transition-colors">
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 mt-4"
          >
            Sign In
          </button>
          
        </form>
      </div>
    </div>
  );
};

export default SignIn;