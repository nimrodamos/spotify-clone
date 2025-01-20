import { AiFillPlayCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

interface CardItemProps {
  image: string;
  name: string;
  desc: string;
  id: string;
  type: "album" | "artist" | "playlist" | "track";
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
      className="relative min-w-[180px] max-h-[300px] p-2 px-3 rounded cursor-pointer group hover:bg-[#ffffff26] transition-all duration-300"
    >
      <div className="relative">
        <img
          className="w-[180px] aspect-square object-cover rounded"
          src={image}
          alt={name}
        />
        <div className="absolute bottom-1 right-2 opacity-0 translate-y-6 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-in-out">
          <div className="relative">
            <div className="absolute bg-black w-[50px] h-[50px] rounded-full opacity-80"></div>
            <AiFillPlayCircle size={50} color="#1ed760" className="relative" />
          </div>
        </div>
      </div>

      <p className="font-bold mt-2 mb-1 text-white">{name}</p>
      <p className="text-sm text-textSubdued">{desc}</p>
    </div>
  );
};

export default CardItem;
