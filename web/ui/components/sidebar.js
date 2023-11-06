import Link from "next/link";

export default function SideBar() {
  return (
    <div className="sidebar">
      <h1>asdasd</h1>
      <div className="navigation">
        <Link href={"/"}>Home</Link>
        <Link href={"/submit"}>Submit a Blog</Link>
        <Link href={"/edit"}>Edit a Blog</Link>
        <Link href={"/guide"}>Guide</Link>
      </div>
    </div>
  );
}
