import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
const API = "https://backend.notional.ventures/blogs";

const Form = ({ posts }) => {
  useEffect(() => {
    getItems();
  }, []);
  const [data, setData] = useState();
  const [isLoading, setLoading] = useState(true);
  const getItems = async () => {
    try {
      const response = await axios.get(`${API}`);
      const blogs = response.data.blogs;
      setData(blogs);
      setLoading(false);
      console.log(blogs);
      return blogs;
    } catch (errors) {
      console.error(errors);
    }
  };
  if (isLoading) {
    return (
      <div className="edit-container">
        <h1>List of blogs</h1>
        <div>Loading ...</div>
      </div>
    );
  } else {
    return (
      <div className="edit-container">
        {console.log(data)}
        <h1>List of blogs</h1>
        <div className="list">
          {data.map((data) => {
            return <Link style={{ display: 'flex' }} href={`/edit/${data.slug}`} className="title">
            {data.title}
            </Link>
          })}
        </div>
      </div>
    );
  }
};
export default Form;
