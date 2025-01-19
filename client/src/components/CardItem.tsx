import { AiFillPlayCircle } from "react-icons/ai";
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
      className="relative min-w-[180px] max-h-[300px] overflow-hidden p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26] transition-all duration-300"
    >
      <img
        className="w-[180px] aspect-square object-cover rounded"
        src={image}
        alt={name}
      />
      <div className="absolute inset-0 flex items-center justify-end pr-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <AiFillPlayCircle size={70} color="#1ed760" />
      </div>
      <p className="font-bold mt-2 mb-1">{name}</p>
      <p className="text-sm text-textSubdued">{desc}</p>
    </div>
  );
};

export default CardItem;
