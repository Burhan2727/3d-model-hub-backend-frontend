import { useLoaderData } from "react-router";
import Banner from "../../components/Banner";
import { ModelCard } from "../../components/ModelCard";
const Home = () => {
  const data = useLoaderData();
  const models = data.result;

  return (
    <div>
      <Banner />

      <div className="text-center text-xl font-bold mt-10">Latest Model</div>

      <div className="grid grid-cols-3 lg:grid-cols-4 gap-3 mt-10">
        {
            models.map(model => <ModelCard model={model}></ModelCard>)
        }
      </div>
    </div>
  );
};

export default Home;
