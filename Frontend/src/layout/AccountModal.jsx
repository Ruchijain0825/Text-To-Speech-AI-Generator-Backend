const AccountModal = ({ user, onLogout, onClose }) => {
  const userName = user?.name || user?.username || user?.fullName || "User";
  const userEmail = user?.email || "No email";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/30" onClick={onClose}>
      <div className="mr-4 mt-14 h-fit w-72 rounded-xl bg-white p-2.5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold text-white">{userInitial}</div>
            <div>
              <h1 className="text-sm font-semibold text-gray-800">{userName}</h1>
              <p className="text-[10px] text-gray-400">Text-to-speech converter</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-base leading-none text-gray-400 hover:text-gray-700">×</button>
        </div>

        <div className="mt-1">
          <button type="button" className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-gray-50">
            <span className="text-sm">👤</span>
            <div>
              <p className="text-xs text-gray-700">{userEmail}</p>
              <p className="text-[9px] text-gray-400">Signed in</p>
            </div>
          </button>

          <button type="button" className="mt-0.5 flex w-full items-center gap-2 rounded-lg bg-gray-50 px-2 py-1.5 text-left">
            <span className="text-sm">⚙️</span>
            <span className="text-xs text-gray-700">Account</span>
          </button>

          <button type="button" onClick={onLogout} className="mt-0.5 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-red-50">
            <span className="text-sm">🚪</span>
            <span className="text-xs text-red-500">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountModal;