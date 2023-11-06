import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function IndexPage() {
  return (
    <div className="guide-container">
      <div className="header">
        <h1 className={styles.title}>
          How to write and submit a blog to Notional
        </h1>

        <p className={styles.description}>
          We will learn about how to use Markdown to write a blog and attach
          images with ease
        </p>
      </div>
      <div className="content">
        <h1>Blog Structure</h1>
        <p>
          To better understand about how we categorize blogs in Notional and
          how user can easily choose blog based on their need, here is the
          structure of blogs.
        </p>
        <h3>1. Title</h3>
        <p>
          Title of blog. The title length should not be greater than 100
          characters, which could affect user reading experience. This section
          is <strong>required</strong>.
        </p>
        <h3>2. Description</h3>A short description of the blog is suggested as
        it can quickly tell the reader about the main idea of the article.
        This section is <em>NOT required</em>.<h3>3. Categories</h3>
        <p>
          Each blog have to be in a specific category, which is one of 3
          below:
          <ul>
            <li>Code</li>
            <li>Infrastructure</li>
            <li>Data Analysis</li>
          </ul>
          Code category is the default category. This section is{" "}
          <strong>required</strong>.
        </p>
        <h3>4. Tags</h3>
        <p>
          Tags are used to make users easier in choose a suitable blog based
          on their keywords. This also help search engines like Google find
          these posts faster, increasing SEO.
        </p>
        Tags is <em>not required.</em>
        <h3>5. Series</h3>
        <p>
          We can group different blogs with same subject into a series.
          Articles in this series will be shown up after user read an article
          in this series.
          <br />
          Series is not required. You can choose a series from the list or
          create a new one.
        </p>
        <h3>6. Cover image</h3>
        <p>
          Every blogs should have a cover image for better look. this section
          is <strong>required</strong>.
        </p>
        <h3>7. Author</h3>
        <p>
          this section
          is <strong>required</strong>.
        </p>
        <h1>Markdown Syntax</h1>
        <p>
          The content of the blog will be saved in Markdown <code>.md</code>
          file. Below is common syntax that will be used in most of our
          articles.
        </p>
        <h3>1. Images</h3>
        <p>
          Image can not be directly included in Markdown files, so we have to
          instead embded a link to it. An useful link to get URL from images
          is:
          <strong>
            <a rel="stylesheet" href="https://imgbb.com">
              {" "}
              https://imgbb.com
            </a>
          </strong>
        </p>
        <p>
          Below is the example syntax of embding image in <code>.md</code>{" "}
          files.
        </p>
        <code>
          ![A description text](https://i.ibb.co/X8w41JY/case-atom.png)
        </code>
        <h3>2. Footnote</h3>
        <p>Footnote information is useful for reference purposes.</p>
        <code>
          There is a study[^1] that ....
          <br />
          [^1]: https://www.google.com
          <br />
          <br />
          or just add some name[^first]...
          <br />
          [^first]: https://www.google.com
          <br />
        </code>
        <p>
          It will automatically generate a section in the footer of the
          articles that show all the reference used in the content.
        </p>
        <h3>3. Quote</h3>
        <p> quote is useful for quoting speech, ...</p>
        <code>
          {"> "} This is the first line of quote
          <br />
          {"> "} <br />
          {"> "} This is the second line of quote
          <br />
          {">  "} and this is still second line of quote
          <br />
        </code>
        <p>It will become like this:</p>
        <div className="quote">
          This is the first line of quote
          <br />
          This is the second line of quote and this is still second line of
          quote
        </div>
        <h3>4. List</h3>
        <p> we can write unorder and order list with really simple syntax</p>
        <code>
          1. first line
          <br />
          2. second line
          <br />
          1. still, third line
          <br />
          22312. the fourth line
          <br />
        </code>
        <ol>
          <li>first line</li>
          <li>second line</li>
          <li>still, third line</li>
          <li>the fourth line</li>
        </ol>
        <p>or, start from custom index</p>
        <code>
          3. third line
          <br />
          2. fourth line
          <br />
          1. fifth line
          <br />
          22312. and the sixth line
          <br />
        </code>
        <p>
          or just an unordered list with <code>+</code>,<code>-</code>,
          <code>*</code>
        </p>
        <code>
          - first line
          <br />
          - second line
          <br />
          - third line
          <br />
          - fifth line
          <br />
        </code>
        <ul>
          <li>first line</li>
          <li>second line</li>
          <li>third line</li>
          <li>fourth line</li>
        </ul>
        <p>
          you can also create a sub list inside a list too. To do that, just
          add <strong>2 more space</strong> to the sublist
        </p>
        <code>
          - first line
          <br />
          - second line
          <br />
          {"..+"} first line
          <br />
          {"..+"} second line
          <br />
        </code>
        <ul>
          <li>first line</li>
          <li>
            second line
            <ul>
              <li>third line</li>
              <li>fourth line</li>
            </ul>
          </li>
        </ul>
        <h3>5. UML Diagram</h3>
        Yes, our blog support drawing UML diagrams right in blog too! and the syntax is pretty simple:<br />
        <code>
          {"~~~mermaid"} <br />
          {"sequenceDiagram"} <br />
          {"Alice ->> Bob: Hello Bob, how are you?"} <br />
          {"Bob-->>John: How about you John?"} <br />
          {"Bob--x Alice: I am good thanks!"} <br />
          {"Bob-x John: I am good thanks!"} <br />
          {"Note right of John: Bob thinks a long<br />long time, so long<br />that the text does<br />not fit on a row."} <br />
          {"Bob-->Alice: Checking with John..."} <br />
          {"Alice->John: Yes... John, how are you?"} <br />
          {"~~~"}
        </code>
        <p>Detail and syntax can be found <a href="https://mermaid.live/edit#pako:eNpVjstqw0AMRX9FaNVC_ANeFBq7zSbQQrPzZCFsOTMk80CWCcH2v3ccb1qtxD3nCk3Yxo6xxP4W760lUTjVJkCe96ay4gb1NJyhKN7mAyv4GPgxw_7lEGGwMSUXLq-bv18lqKbjqjGodeG6bKh69r8Cz1A3R0oa0_kvOd3jDB-N-7b5_H9ihXPrs-mp7KloSaAieSq4Q8_iyXX5_WlNDKplzwbLvHYkV4MmLNmjUePPI7RYqoy8wzF1pFw7ugj5LVx-AfLqVWg">here</a>.</p>
        <h3>6. Latex</h3>
        <p>You can directly write some simple math equations in markdown file. Only <code>\(...\)</code> brake is accepted.</p>
        <h1>Submit a blog</h1>
        <p>
          To submit a blog, click the "Submit a blog" button and navigate to the submit page, You will see a form that contain all the needed inputs of the blog. Follow the instruction and click the "Submit" button when finished.
        </p>
      </div>
    </div>
  );
}
