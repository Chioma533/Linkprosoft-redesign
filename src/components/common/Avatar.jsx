const MessageAvatar = ({ name, avatar }) => {
  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className="w-10 h-10 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center font-bold text-xs text-gray-700">
      {name?.substring(0, 2).toUpperCase()}
    </div>
  );
};

export default MessageAvatar;