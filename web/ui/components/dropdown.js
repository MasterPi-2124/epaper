import Link from "next/link";
import Image from "next/image";

const DropDown = ({ minimized, isShow, buttonList }) => {
  return (
    isShow && (
      <div
        className="dropdown w-40 text-white absolute text-center"
        style={{
          top: "200px",
          left: minimized === false && "80px" || "200px",
          borderRadius: "10px",
          border: "1px solid rgba(86, 86, 86, 0.736)",
          zIndex: 9999999,
        }}
      >
        <ul
          className="p-0 m-0 text-center text-base"

        >
          {buttonList.map((button, index) => {
            return (
              <Link href={button.path} key={index}>
                <li
                  key={index}
                  style={{
                    margin: "10px 0",
                    gap: "10px",
                  }}
                  className="p-2 flex flex-row"
                >
                  <Image alt="" src={button.img} />
                  {button.text}
                </li>
              </Link>
            );
          })}
        </ul>
      </div>
    )
  );
};

export default DropDown;
