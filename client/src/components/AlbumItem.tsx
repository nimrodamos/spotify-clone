import { useNavigate } from "react-router-dom";

interface AlbumItemProps {
  image: string;
  name: string;
  desc: string;
  id: string | number; // ניתן להתאים את הטיפוס לפי הצורך
}

const AlbumItem: React.FC<AlbumItemProps> = ({ image, name, desc, id }) => {
  const Navigate = useNavigate();

  const handleClick = () => {
    console.log("Navigating to album:", id); // Log the navigation action
    Navigate(`/album/${id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]"
    >
      <img className="rounded" src={image} alt={name} />
      <p className="font-bold mt-2 mb-1">{name}</p>
      <p className="text-slate-200 text-sm">{desc}</p>
    </div>
  );
};

export default AlbumItem;
