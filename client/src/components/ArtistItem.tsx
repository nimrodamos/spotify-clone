// Refactored ArtistItem.tsx
interface ArtistItemProps {
  name: string;
  desc: string;
  image: string;
}

const ArtistItem: React.FC<ArtistItemProps> = ({ name, desc, image }) => {
  return (
    <div className="artist-item flex flex-col items-center p-4">
      <img
        src={image}
        alt={name}
        className="w-32 h-32 rounded-full object-cover mb-2"
      />
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  );
};

export default ArtistItem;
