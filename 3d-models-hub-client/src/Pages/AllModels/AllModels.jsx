import { useLoaderData } from "react-router";
import { ModelCard } from "../../components/ModelCard";
import { useState } from "react";

const AllModels = () => {
  const data = useLoaderData();
  const [models, setModels] = useState(data)
  const [loading, setLoading] = useState(false)
  console.log(data);
  const handleSearch = (e)=>{
    e.preventDefault()
    const search_text = e.target.search.value;
    setLoading(true)
    fetch(`https://3d-models-hub-server-eta.vercel.app/search?search=${search_text}`)
    .then(res => res.json())
    .then(data => {
      console.log(data)
      setModels(data)
      setLoading(false)
    })
  }
  return (
    <div>
      <div className="text-2xl text-center font-bold"> All Models</div>
      <p className=" text-center mb-10 ">Explore 3d models.</p>
      {/* search input start */}
      <form onSubmit={handleSearch} className="flex justify-center gap-2 mb-10">
        <label className="input rounded-full">
        <svg
          className="h-[1em] opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input type="search" name="search" placeholder="Search" />
      </label>
      <button className="btn btn-secondary rounded-full">{loading ? "Searching..." : "Search"}</button>
      </form>
      {/* search input end */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {models.map((model) => (
          <ModelCard key={model._id} model={model}></ModelCard>
        ))}
      </div>
    </div>
  );
};

export default AllModels;
