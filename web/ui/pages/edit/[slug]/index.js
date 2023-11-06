import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import SideBar from "../../../components/sidebar";

export async function getStaticPaths() {
  const res = await fetch("https://backend.notional.ventures/blogs");
  const blogs = await res.json();

  const paths = blogs.blogs.map((blog) => ({
    params: { slug: blog.slug.toString() },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps() {
  const res = await fetch("https://backend.notional.ventures/blogs");
  const posts = await res.json();
  return {
    props: {
      posts,
    },
  };
}

const Form = ({ posts }) => {
  const [formStatus, setFormStatus] = useState("");
  const [isKeyReleased, setIsKeyReleased] = useState(false);

  const [tags, setTags] = useState([]);
  const [tagsInput, setTagsInput] = useState("");
  const [file, setFile] = useState(undefined);
  const [cover, setCover] = useState(undefined);
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [series, setSeries] = useState("");
  const [category, setCategory] = useState("");
  const [data, setData] = useState();
  const [isLoading, setLoading] = useState(true);
  const router = useRouter();
  const { slug } = router.query;

  console.log(slug);
  useEffect(() => {
    getItems();
  }, []);
  const getItems = async () => {
    if (slug !== "undefined") {
      try {
        const response = await axios.get(
          `https://backend.notional.ventures/blogs/${slug}`
        );
        const blogOfSlug = response.data;
        //   console.log(response);
        setLoading(false);
        setData(blogOfSlug);
        setTags(blogOfSlug.tags);
        setDescription(blogOfSlug.description);
        setAuthor(blogOfSlug.author);
        setSeries(blogOfSlug.series);
        setCategory(blogOfSlug.category);
      } catch (errors) {
        console.error(errors);
      }
    }
  };
  console.log(data);

  const onDescriptionChange = (e) => {
    const { value } = e.target;
    setDescription(value);
  };

  const onAuthorChange = (e) => {
    const { value } = e.target;
    setAuthor(value);
  };

  const onTagsChange = (e) => {
    const { value } = e.target;
    setTagsInput(value);
  };

  const onSeriesChange = (e) => {
    const { value } = e.target;
    setSeries(value);
  };

  const onCategoryChange = (e) => {
    const value = e.target.innerText;
    setCategory(value);
  };

  const onFileChange = (e) => {
    const value = e.target.files[0];
    setFile(value);
  };

  const onCoverChange = (e) => {
    const value = e.target.files[0];
    setCover(value);
  };

  const onKeyDown = (e) => {
    const { key } = e;
    const trimmedInput = tagsInput.trim();

    if (key === "," && trimmedInput.length && !tags.includes(trimmedInput)) {
      e.preventDefault();
      setTags((prevState) => [...prevState, trimmedInput]);
      setTagsInput("");
    }

    if (
      key === "Backspace" &&
      !tagsInput.length &&
      tags.length &&
      isKeyReleased
    ) {
      const tagsCopy = [...tags];
      const poppedTag = tagsCopy.pop();
      e.preventDefault();
      setTags(tagsCopy);
      setTagsInput(poppedTag);
    }
    setIsKeyReleased(false);
  };

  const onKeyUp = () => {
    setIsKeyReleased(true);
  };

  const deleteTag = (index) => {
    setTags((prevState) => prevState.filter((tag, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("description", description);
    formData.append("author", author);
    formData.append("tags", tags);
    formData.append("series", series);
    formData.append("category", category);
    formData.append("cover", cover);
    formData.append("content", file);
    formData.append("date", new Date(Date.now()).toUTCString());
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
    axios
      .put(
        `https://backend.notional.ventures/blogs/${data.slug}/edit`,
        formData
      )
      .then(function (response) {
        setFormStatus(response.data.message);
        setDescription("");
        setAuthor("");
        setTags([]);
        setTagsInput("");
        setSeries("");
        setCategory("Blockchain");
        setFile(undefined);
        setCover(undefined);
        console.log(response);
      })
      .catch(function (error) {
        setFormStatus(error.response.data.message);
        console.log(error);
      });
  };

  if (!isLoading) {
    return (
      <div className="page">
        {/* <SideBar /> */}
        <div className="form">
          <h2 className="title">Edit blog</h2>
          <h1>{data.title}</h1>
          <form
            acceptCharset="UTF-8"
            method="PUT"
            encType="multipart/form-data"
            id="ajaxForm"
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                type="text"
                className="form-description"
                id="description"
                placeholder="Enter your description"
                name="description"
                value={description}
                onChange={onDescriptionChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="authors">Author</label>
              <label className="detail">
                Choose the author from current list or add a new one if not
                existed.
              </label>
              <input
                type="text"
                className="form-authors"
                id="description"
                list="authors"
                required
                name="author"
                value={author}
                placeholder="Enter an author (Required)"
                onChange={onAuthorChange}
              />
              <datalist id="authors">
                {posts.authors.map((author) => (
                  <option value={author} />
                ))}
              </datalist>
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags</label>
              <label className="detail">
                Add new tags or choose from the list. You can seperate multiple
                tags by using comma.
              </label>
              <div className="tags">
                {tags.map((tag, index) => (
                  <button
                    type="button"
                    className="tag"
                    onClick={() => deleteTag(index)}
                    style={{
                      backgroundColor: `hsl(${Math.floor(
                        Math.random() * 360
                      )}deg, 50%, 40%)`,
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <input
                value={tagsInput}
                list="tags"
                placeholder="Enter a tag"
                onKeyDown={onKeyDown}
                onKeyUp={onKeyUp}
                // required
                onChange={onTagsChange}
              />
              <datalist id="tags">
                {posts.tags.map((tag) => (
                  <option value={tag} />
                ))}
              </datalist>
            </div>

            <div className="form-group">
              <label htmlFor="series">Series</label>
              <label className="detail">
                If the article is a part of a series, choose that series from
                the list or add a new one.
              </label>
              <input
                type="text"
                list="series"
                className="form-control"
                id="series"
                placeholder="Enter your series"
                name="series"
                value={series}
                onChange={onSeriesChange}
              />
              <datalist id="series">
                {posts.series.map((seri) => (
                  <option value={seri} />
                ))}
              </datalist>
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <label className="detail">
                Choose the category of the blog. The default category is{" "}
                <em>Blockchain</em>.
              </label>
              <div
                className="form-control category"
                id="category"
                name="category"
                value={category}
              >
                <a
                  href="#0"
                  onClick={onCategoryChange}
                  className={category === "Blockchain" ? "category-active" : ""}
                >
                  Blockchain
                </a>
                <a
                  href="#0"
                  onClick={onCategoryChange}
                  className={
                    category === "Infrastructure" ? "category-active" : ""
                  }
                >
                  Infrastructure
                </a>
                <a
                  href="#0"
                  onClick={onCategoryChange}
                  className={
                    category === "Data Analysis" ? "category-active" : ""
                  }
                >
                  Data Analysis
                </a>
              </div>
            </div>

            <hr />

            <div className="form-group">
              <label htmlFor="content" className="mr-2">
                Content
              </label>
              <label className="detail">
                Upload your content file here. Only MarkDown files are accepted.
              </label>
              <input
                name="content"
                id="content"
                type="file"
                accept=".md"
                onChange={onFileChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="cover" className="mr-2">
                Cover image
              </label>
              <input
                name="cover"
                accept=".png, .jpg, .aviff, .jpeg"
                id="cover"
                type="file"
                onChange={onCoverChange}
              />
            </div>

            {formStatus !== "" ? (
              <div className="success-message">{formStatus}</div>
            ) : (
              ""
            )}
            <button type="submit" className="submit">
              Edit
            </button>
          </form>
        </div>
      </div>
    );
  } else {
    return <div>Loading ...</div>;
  }
};

export default Form;
