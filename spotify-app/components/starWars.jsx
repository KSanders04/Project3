import { useEffect, useState, useRef } from "react";
import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "./starWars.css";

function StarWars() {
  const inputRef = useRef();
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [option, setOption] = React.useState("");

  async function expandUrls(urls) {
    if (!urls || urls.length === 0) return [];
    return await Promise.all(urls.map((u) => fetch(u).then((r) => r.json())));
  }

  const handleChange = async (event) => {
    const value = event.target.value;
    setOption(value);

    return loadCategory(value);
  };

  async function expandPerson(person) {
    const [films, species, starships, vehicles, homeworld] = await Promise.all([
      expandUrls(person.films),
      expandUrls(person.species),
      expandUrls(person.starships),
      expandUrls(person.vehicles),
      person.homeworld ? fetch(person.homeworld).then((r) => r.json()) : null,
    ]);

    return {
      ...person,
      films: films.length ? films.map((f) => f.title) : ["Unknown"],
      species: species.length ? species.map((s) => s.name) : ["Human"],
      starships: starships.length ? starships.map((s) => s.name) : ["Unknown"],
      vehicles: vehicles.length ? vehicles.map((v) => v.name) : ["Unknown"],
      homeworld: homeworld ? homeworld.name : "Unknown",
    };
  }

  async function loadCategory(type) {
    setLoading(true);
    try {
      let url = `https://swapi.dev/api/${type}/`;
      let all = [];

      while (url) {
        const res = await fetch(url);
        const data = await res.json();
        all.push(...data.results);
        url = data.next;
      }

      const expanded = await Promise.all(all.map(expandPerson));
      setPeople(expanded);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const search = async (query) => {
    setLoading(true);
    try {
      let url = `https://swapi.dev/api/${option}/?search=${query}`;
      let all = [];

      while (url) {
        const res = await fetch(url);
        const data = await res.json();

        all.push(...data.results);
        url = data.next;
      }

      const expanded = await Promise.all(all.map(expandPerson));
      setPeople(expanded);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  function ItemCard({ item }) {
    const isPerson = item.birth_year !== undefined;
    const isFilm = item.director !== undefined;
    const isPlanet = item.climate !== undefined;
    const isStarship = item.starship_class !== undefined;
    const isVehicle = item.vehicle_class !== undefined;

    return (
      <div className="card">
        <h2>{item.name || item.title}</h2>

        {isPerson && (
          <>
            <p>
              <strong>Homeworld:</strong> {item.homeworld}
            </p>
            <p>
              <strong>Height:</strong> {(item.height / 30.48).toFixed(2)} ft
            </p>
            <p>
              <strong>Eye Color:</strong> {item.eye_color}
            </p>
            <p>
              <strong>Films:</strong> {item.films?.join(", ")}
            </p>
            <p>
              <strong>Species:</strong> {item.species?.join(", ")}
            </p>
            <p>
              <strong>Starships:</strong> {item.starships?.join(", ")}
            </p>
            <p>
              <strong>Vehicles:</strong> {item.vehicles?.join(", ")}
            </p>
          </>
        )}

        {isFilm && (
          <>
            <p>
              <strong>Episode:</strong> {item.episode_id}
            </p>
            <p>
              <strong>Director:</strong> {item.director}
            </p>
            <p>
              <strong>Producer:</strong> {item.producer}
            </p>
            <p>
              <strong>Release Date:</strong> {item.release_date}
            </p>
          </>
        )}

        {isPlanet && (
          <>
            <p>
              <strong>Climate:</strong> {item.climate}
            </p>
            <p>
              <strong>Terrain:</strong> {item.terrain}
            </p>
            <p>
              <strong>Population:</strong> {item.population}
            </p>
          </>
        )}

        {isStarship && (
          <>
            <p>
              <strong>Model:</strong> {item.model}
            </p>
            <p>
              <strong>Manufacturer:</strong> {item.manufacturer}
            </p>
            <p>
              <strong>Class:</strong> {item.starship_class}
            </p>
            <p>
              <strong>Cost:</strong> {item.cost_in_credits}
            </p>
          </>
        )}

        {isVehicle && (
          <>
            <p>
              <strong>Model:</strong> {item.model}
            </p>
            <p>
              <strong>Manufacturer:</strong> {item.manufacturer}
            </p>
            <p>
              <strong>Class:</strong> {item.vehicle_class}
            </p>
            <p>
              <strong>Cost:</strong> {item.cost_in_credits}
            </p>
          </>
        )}
      </div>
    );
  }

  useEffect(() => {
    loadCategory();
  }, []);

  if (loading)
    return (
      <div className="container">
        <img
          src="../src/assets/images/starWarsLogo.png"
          className="logo"
          alt="Star Wars Logo"
        />

        <div className="searchContainer">
          <Box sx={{ minWidth: 120 }}>
            <FormControl
              fullWidth
              sx={{
                bgcolor: "black",
                "& .MuiInputLabel-root": { color: "#ffc103" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#ffc103" },
                  "&:hover fieldset": { borderColor: "#ffea00" },
                  "&.Mui-focused fieldset": { borderColor: "#ffc103" },
                },
                "& .MuiSelect-select": {
                  color: "#FFFFFF",
                },
              }}
            >
              <InputLabel id="demo-simple-select-label" className="itemTitle">
                Select
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={option}
                label="Select"
                onChange={handleChange}
              >
                <MenuItem value="people">People</MenuItem>
                <MenuItem value="films">Films</MenuItem>
                <MenuItem value="planets">Planets</MenuItem>
                <MenuItem value="vehicles">Vehicles</MenuItem>
                <MenuItem value="starships">Starships</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <input
            className="searchBox"
            ref={inputRef}
            type="text"
            placeholder="Search..."
          />
          <button
            className="searchButton"
            onClick={() => search(inputRef.current.value)}
          >
            Search
          </button>
        </div>
        <img
          src="../src/assets/images/deathStar.png"
          className="loadingLogo"
          alt="Star Wars Logo"
        />
        <div className="loading">In a galaxy far, far away...</div>
      </div>
    );

  return (
    <div className="container">
      <img
        src="../src/assets/images/starWarsLogo.png"
        className="logo"
        alt="Star Wars Logo"
      />

      <div className="searchContainer">
        <Box sx={{ minWidth: 120 }}>
          <FormControl
            fullWidth
            sx={{
              bgcolor: "black",
              "& .MuiInputLabel-root": { color: "#000" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#ffc103" },
                "&:hover fieldset": { borderColor: "#ffea00" },
                "&.Mui-focused fieldset": { borderColor: "#ffc103" },
              },
              "& .MuiSelect-select": {
                color: "#FFFFFF",
              },
            }}
          >
            <InputLabel id="demo-simple-select-label" className="itemTitle">
              Select
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={option}
              label="Select"
              onChange={handleChange}
            >
              <MenuItem value="people">People</MenuItem>
              <MenuItem value="films">Films</MenuItem>
              <MenuItem value="planets">Planets</MenuItem>
              <MenuItem value="vehicles">Vehicles</MenuItem>
              <MenuItem value="starships">Starships</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <input
          className="searchBox"
          ref={inputRef}
          type="text"
          placeholder="Search..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              search(inputRef.current.value);
            }
          }}
        />
        <button
          className="searchButton"
          onClick={() => search(inputRef.current.value)}
        >
          Search
        </button>
      </div>

      <div className="peopleList">
        {people.map((item) => (
          <ItemCard key={item.url} item={item} />
        ))}
      </div>
    </div>
  );
}

export default StarWars;
