import React, { useState, useEffect } from "react";
import "./index.css";

function AlphaAesthetic() {
  const [view, setView] = useState("Home");
  const [wallpaper, setWallpaper] = useState([]);
  const [selectedWallpaper, setSelectedWallpaper] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  function handleWallpaperClick(wallpaper) {
    setSelectedWallpaper(wallpaper);
  }

  function closeModal() {
    setSelectedWallpaper(null);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      setSearchTerm(event.target.value);
    }
  }

  useEffect(() => {
    fetch("http://127.0.0.1:8000/wallpapers/")
      .then((response) => response.json())
      .then((data) => {
        setWallpaper(data);
      })
      .catch((error) => {
        console.error("Error fetching wallpapers:", error);
      });
  }, []);

  const filteredWallpapers = wallpaper.filter((wp) =>
    wp.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  function WallpaperCard({ wallpaper, onClick }) {
    return (
      <div
        className="max-w-sm rounded overflow-hidden shadow-2xl hover:brightness-125 transition-all duration-300 bg-[#212529] cursor-pointer"
        onClick={() => onClick(wallpaper)}
      >
        <img
          className="w-full"
          src={wallpaper.imageUrl}
          alt={wallpaper.description}
        />
        <div className="px-6 py-4">
          <p className="text-white text-base">{wallpaper.description}</p>
        </div>
        <div className="px-6 pt-4 pb-2">
          {wallpaper.tags &&
            wallpaper.tags.map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
              >
                #{tag}
              </span>
            ))}
        </div>
      </div>
    );
  }

  function WallpaperModal({ wallpaper, onClose }) {
    useEffect(() => {
      function handleKeyDown(event) {
        if (event.key === "Escape") {
          onClose();
        }
      }
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-4">
        <div className="bg-[#212529] p-8 rounded-lg shadow-lg max-w-3xl w-full">
          <img
            src={wallpaper.imageUrl}
            alt={wallpaper.description}
            className="mb-4 rounded-lg w-full h-auto max-h-96 object-cover"
          />
          <p className="text-white text-lg mb-4">{wallpaper.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {wallpaper.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
              >
                #{tag}
              </span>
            ))}
          </div>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-50"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const HomeView = ({ wallpapers }) => {
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
      if (wallpapers.length > 0) {
        const interval = setInterval(() => {
          setCurrentImage(
            (currentImage) => (currentImage + 1) % wallpapers.length
          );
        }, 5000);
        return () => clearInterval(interval);
      }
    }, [wallpapers]);

    const backgroundImageStyle = {
      backgroundImage: `url(${wallpapers[currentImage]?.imageUrl})`,
      backgroundSize: "cover",
      transition: "background-image 1s ease-in-out",
      height: `calc(100vh - 56px)`,
    };

    return (
      <div
        style={backgroundImageStyle}
        className="flex justify-center items-center bg-no-repeat bg-center h-dvh"
      >
        <div className="bg-black bg-opacity-60 p-4 rounded-3xl">
          <p className="text-xl font-semibold text-white shadow">
            Welcome. Enjoy your experience at Alpha Aesthetics where premium
            wallpapers live. Our fine selections of wallpapers will guarantee a
            fit for you.
          </p>
        </div>
      </div>
    );
  };

  const WallpapersView = () => (
    <div>
      <div className="h-96 bg-[#212529] flex flex-col justify-center items-center">
        <p className="text-5xl font-semibold text-center text-white">
          Wallpaper.
        </p>
        <p className="font-semibold text-center text-white p-4">
          A wide range of wallpapers exists here with many themes in play,
          please allow yourself some time to taste
        </p>
        {}
        <input
          type="text"
          placeholder="Search by tag..."
          defaultValue={searchTerm}
          onKeyDown={handleKeyDown}
          className="text-gray-700 mt-2 p-2 w-1/2 rounded shadow"
        />
      </div>
      <div className="grid grid-cols-4 gap-4 p-10 items-center bg-[#2b3035]">
        {filteredWallpapers.map((wp, index) => (
          <WallpaperCard
            key={index}
            wallpaper={wp}
            onClick={handleWallpaperClick}
          />
        ))}
      </div>
    </div>
  );

  function RemixView() {
    const [id, setId] = useState("");
    const [wallpaper, setWallpaper] = useState(null);
    const [newWallpaper, setNewWallpaper] = useState({
      description: "",
      source: "",
      imageUrl: "",
      tags: "", // Initialize as an empty string to handle the join/split operations safely
    });
    const [error, setError] = useState("");

    const handleFetch = () => {
      fetch(`http://127.0.0.1:8000/wallpapers/${id}`)
        .then((response) => {
          if (!response.ok) {
            if (response.status === 404) {
              throw new Error("Wallpaper does not exist");
            }
            throw new Error("Failed to fetch wallpaper");
          }
          return response.json();
        })
        .then((data) => {
          setWallpaper(data);
          setNewWallpaper({
            description: data.description,
            source: data.source,
            imageUrl: data.imageUrl,
            tags: data.tags ? data.tags.join(", ") : "",
          });
          setError("");
        })
        .catch((error) => {
          console.error("Error:", error);
          setError(error.message);
          setWallpaper(null);
        });
    };

    const handleCreateOrUpdate = (event) => {
      event.preventDefault();
      const method = wallpaper ? "PUT" : "POST";
      const url = wallpaper
        ? `http://127.0.0.1:8000/wallpapers/${id}`
        : "http://127.0.0.1:8000/wallpapers";
      const wallpaperData = {
        ...newWallpaper,
        tags: newWallpaper.tags.split(",").map((tag) => tag.trim()),
      };

      fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(wallpaperData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to process request");
          }
          return response.json();
        })
        .then((data) => {
          setWallpaper(data);
          alert(`Wallpaper ${wallpaper ? "updated" : "created"} successfully!`);
          if (!wallpaper) {
            setId(data.id);
          }
        })
        .catch((error) => {
          console.error(
            `Failed to ${wallpaper ? "update" : "create"} wallpaper:`,
            error
          );
        });
    };

    const handleDelete = () => {
      fetch(`http://127.0.0.1:8000/wallpapers/${id}`, {
        method: "DELETE",
      })
        .then(() => {
          setWallpaper(null);
          setNewWallpaper({
            description: "",
            source: "",
            imageUrl: "",
            tags: "",
          });
          setId("");
          setError("");
          alert("Wallpaper deleted successfully");
        })
        .catch((error) => {
          console.error("Failed to delete wallpaper:", error);
        });
    };

    //hree
    return (
      <div className="p-6 bg-[#2b3035]">
        <div
          className="max-w-lg mx-auto space-y-4"
          style={{ height: `calc(100vh - 56px)` }}
        >
          <input
            type="text"
            placeholder="Enter Wallpaper ID to edit"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
          />
          <button
            onClick={handleFetch}
            className="py-2 px-4 bg-blue-500 text-white rounded"
          >
            Fetch Wallpaper
          </button>

          <form onSubmit={handleCreateOrUpdate} className="space-y-4">
            {!wallpaper && (
              <input
                type="text"
                placeholder="ID"
                value={newWallpaper.id}
                onChange={(e) =>
                  setNewWallpaper({ ...newWallpaper, id: e.target.value })
                }
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            )}
            <input
              type="text"
              placeholder="Description"
              value={newWallpaper.description}
              onChange={(e) =>
                setNewWallpaper({
                  ...newWallpaper,
                  description: e.target.value,
                })
              }
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            <input
              type="text"
              placeholder="Source"
              value={newWallpaper.source}
              onChange={(e) =>
                setNewWallpaper({ ...newWallpaper, source: e.target.value })
              }
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={newWallpaper.imageUrl}
              onChange={(e) =>
                setNewWallpaper({ ...newWallpaper, imageUrl: e.target.value })
              }
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            <input
              type="text"
              placeholder="Tags (comma-separated)"
              value={newWallpaper.tags}
              onChange={(e) =>
                setNewWallpaper({ ...newWallpaper, tags: e.target.value })
              }
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            <button
              type="submit"
              className="py-2 px-4 bg-green-500 text-white rounded"
            >
              {wallpaper ? "Update" : "Create"} Wallpaper
            </button>
          </form>

          {id && (
            <button
              onClick={handleDelete}
              className="py-2 px-4 bg-red-500 text-white rounded"
            >
              Delete Wallpaper
            </button>
          )}

          {error && <div className="text-red-500">{error}</div>}
          <div className=" flex justify-center items-center h-96">
            {wallpaper && (
              <div className="mt-4 p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 max-w-lg">
                <h2 className="text-lg font-bold text-gray-900">
                  Wallpaper Details:
                </h2>
                <p className="text-gray-700">
                  <span className="font-semibold">Description:</span>{" "}
                  {wallpaper.description}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Source:</span>{" "}
                  {wallpaper.source}
                </p>
                <img
                  src={wallpaper.imageUrl}
                  alt="Wallpaper"
                  className="w-full max-w-xs mt-2 rounded"
                  style={{ height: "auto" }}
                />
                <p className="text-gray-700">
                  <span className="font-semibold">Tags:</span>{" "}
                  {wallpaper.tags.join(", ")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const PersonalView = () => {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#2b3035]">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96 bg-[#212529]">
          <div className="flex flex-col items-center">
            {/* Author Image */}
            <img
              className="w-40 h-40 rounded-full object-cover"
              src="https://i.pinimg.com/280x280_RS/43/29/46/4329469155e7c8068ab78eb3b6c64877.jpg"
              alt="Author"
            />
            {/* Author Name */}
            <h2 className="mt-4 text-xl font-bold text-white">
              Tawfeeq Alimami
            </h2>
            {/* Brief Description */}
            <p className="text-white mt-2 text-center">
              This project was done for the sake of introducing a better
              wallpaper website, an important lesson was learned that just
              because a person has newer tech that does not mean it is better, I
              couldnt implement the clutter desktop feature that I had on the
              midterm but that is all right
            </p>
            <h1 className="text-white mt-2 text-center">-</h1>
            <h4 className="text-white mt-2 text-center">
              SE/ComS319 Construction of User Interfaces, Spring 2024 , Dr.
              Abraham N. Aldaco Gastelum [aaldaco@iastate.edu], Dr. Ali
              Jannesari [jannesar@iastate.edu], talimami@iastate.edu
            </h4>
          </div>
        </div>
      </div>
    );
  };

  const getCurrentView = () => {
    switch (view) {
      case "Home":
        return <HomeView wallpapers={wallpaper} />;
      case "Wallpapers":
        return <WallpapersView />;
      case "Personal":
        return <PersonalView />;
      case "Remix":
        return <RemixView />;
      default:
        return <WallpapersView />;
    }
  };

  return (
    <div>
      <div className="bg-[#212529] text-white flex justify-between items-center px-5 py-2">
        <h1 className="font-bold text-lg hover:text-2xl transition-all duration-300 ease-in-out">
          ALPHA AESTHETICS
        </h1>

        <div>
          <button
            onClick={() => setView("Home")}
            className="hover:text-gray-300 text-white font-semibold py-2 px-4 rounded shadow"
          >
            Home
          </button>
          <button
            onClick={() => setView("Wallpapers")}
            className="hover:text-gray-300 text-white font-semibold py-2 px-4 rounded shadow mx-2"
          >
            Wallpapers
          </button>
          <button
            onClick={() => setView("Remix")}
            className="hover:text-gray-300 text-white font-semibold py-2 px-4 rounded shadow"
          >
            Remix Studio
          </button>
          <button
            onClick={() => setView("Personal")}
            className="hover:text-gray-300 text-white font-semibold py-2 px-4 rounded shadow"
          >
            Personal
          </button>
        </div>
      </div>
      {selectedWallpaper && (
        <WallpaperModal wallpaper={selectedWallpaper} onClose={closeModal} />
      )}
      {getCurrentView()}
    </div>
  );
}

export default AlphaAesthetic;
