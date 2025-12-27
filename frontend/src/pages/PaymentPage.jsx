function PaymentPage({ onBack, onLogin }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-green-50">
      <div className="bg-white p-10 rounded-2xl shadow-lg max-w-md text-center border border-gray-100">
        <h1 className="text-2xl font-extrabold text-gray-800 mb-4">
          Subscription Required
        </h1>

        <p className="text-gray-500 mb-6">
          Upgrade to unlock full access to Manas+ features.
        </p>

        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 text-sm text-gray-600 mb-6">
          🚧 Payment system coming soon
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={onBack}
            className="text-sm text-green-600 hover:underline"
          >
            ← Back to Chat
          </button>

          <button
            onClick={onLogin}
            className="text-sm text-blue-600 hover:underline"
          >
            Already have an account? Log in
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
