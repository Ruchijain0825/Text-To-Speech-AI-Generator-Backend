const AccountModal = ({ user, onLogout, onClose }) => {
  const userName =
    user?.name ||
    user?.username ||
    user?.fullName ||
    "User";

  const userEmail =
    user?.email ||
    "No email";

  const userInitial =
    userName.charAt(0).toUpperCase();

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end bg-black/30"
      onClick={onClose}
    >
      <div
        className="mt-16 mr-4 w-72 rounded-2xl bg-white p-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >

        {/* User information */}
        <div className="border-b border-gray-400 pb-4">
          <div className="flex items-center gap-3">

            {/* Initial */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500 text-lg font-semibold text-white">
              {userInitial}
            </div>

            <div>
              <h1 className="font-semibold text-gray-800">
                {userName}
              </h1>

              <p className="font-semibold text-gray-400">
                Text-to-speech convertor
              </p>
            </div>

          </div>
        </div>

        {/* Menu */}
        <div className="mt-3 space-y-1">

          {/* Email */}
          <button
            type="button"
            className="flex w-full items-center gap-4 rounded-lg px-2 py-3 text-left hover:bg-gray-50"
          >
            <span>👤</span>

            <div>
              <p className="text-sm text-gray-700">
                {userEmail}
              </p>

              <p className="text-xs text-gray-400">
                Signed in
              </p>
            </div>
          </button>

          {/* Account */}
          <button
            type="button"
            className="flex w-full items-center gap-4 rounded-lg px-2 py-3 text-left hover:bg-gray-50"
          >
            <span>⚙️</span>

            <span className="text-sm text-gray-700">
              Account
            </span>
          </button>

          {/* Logout */}
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-4 rounded-lg px-2 py-3 text-left hover:bg-red-50"
          >
            <span>🚪</span>

            <span className="text-sm text-red-500">
              Logout
            </span>
          </button>

        </div>

      </div>
    </div>
  );
};

export default AccountModal;