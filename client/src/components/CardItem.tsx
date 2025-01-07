// Updated CardItem.tsx to support dynamic navigation
import { useNavigate } from "react-router-dom";

interface CardItemProps {
  image: string;
  name: string;
  desc: string;
  id: string;
  type: "album" | "artist" | "playlist";
}

const CardItem: React.FC<CardItemProps> = ({ image, name, desc, id, type }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (type === "album") navigate(`/album/${id}`);
    else if (type === "artist") navigate(`/artist/${id}`);
    else if (type === "playlist") navigate(`/playlist/${id}`);
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

export default CardItem;
