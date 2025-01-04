import { albumsData, songsData } from "@/assets/assets";
import AlbumItem from "./AlbumItem";
import SongItem from "./SongItem";
import { useEffect } from "react";

function DisplayHome() {
  // The following code snippet is used to add a horizontal scroll to the carousel
  useEffect(() => {
    const carousels = document.querySelectorAll(".flex.overflow-auto");
    carousels.forEach((carousel) => {
      carousel.addEventListener("wheel", (event) => {
        const wheelEvent = event as WheelEvent;
        wheelEvent.preventDefault();
        carousel.scrollLeft += wheelEvent.deltaY;
      });
    });
  }, []);

  return (
    <>
      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Featured charts</h1>
        <div className="flex overflow-auto">
          {albumsData.map((item, index) => (
            <AlbumItem
              key={index}
              name={item.name}
              desc={item.desc}
              id={item.id}
              image={item.image}
            />
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Today's biggest hits</h1>
        <div className="flex overflow-auto ">
          {songsData.map((item, index) => (
            <SongItem
              key={index}
              name={item.name}
              desc={item.desc}
              id={item.id}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default DisplayHome;
