const AvatarSelector = ({ user, onSave }) => {
  const [selectedStyle, setSelectedStyle] = useState('lorelei');
  const [seed, setSeed] = useState(user.username || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatar || '');

  // Generate avatar URL
  const generateAvatar = () => {
    const url = `https://api.dicebear.com/8.x/${selectedStyle}/svg?seed=${seed}`;
    setAvatarUrl(url);
  };

  // Save avatar to backend
  const handleSave = async () => {
    try {
      const response = await axios.put(
        `/users/profile/${user._id}`,
        { avatar: avatarUrl },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      onSave(response.data.avatar); // Update parent state
    } catch (error) {
      console.error('Error saving avatar:', error);
    }
  };

  return (
    <div className="avatar-selector">
      <div className="preview">
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt="Avatar Preview"
            className="w-32 h-32 rounded-full"
          />
        )}
      </div>

      <div className="controls">
        <select
          value={selectedStyle}
          onChange={(e) => setSelectedStyle(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="lorelei">Lorelei</option>
          <option value="pixel-art">Pixel Art</option>
          <option value="identicon">Identicon</option>
        </select>

        <input
          type="text"
          value={seed}
          onChange={(e) => setSeed(e.target.value)}
          placeholder="Enter seed (e.g., username)"
          className="p-2 border rounded"
        />

        <Button onClick={generateAvatar} variant="secondary">
          Generate Avatar
        </Button>

        <Button onClick={handleSave} variant="primary">
          Save Avatar
        </Button>
      </div>
    </div>
  );
};

export default AvatarSelector;