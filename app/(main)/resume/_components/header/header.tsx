import Image from "next/image";
import { ButtonHeader } from "../buttonsHeader/button_header";

interface IHeader {
  fullName: string;
  image?: string;
  username: string;
  background: string;
}

export const Header = ({ fullName, username, background, image }: IHeader) => {
  return (
    <div className="flex justify-center bg-content1 p-5 pt-20 text-white shadow-md">
      <div className="flex flex-col items-center justify-between pb-14 md:w-4/5 md:flex-row md:items-center md:justify-evenly md:gap-3">
        <section className="mb-3 flex h-40 w-40 items-center justify-center rounded-full md:h-64 md:w-64">
          <Image
            src={image ?? "/user_image.png"}
            alt="user Image"
            layout="responsive"
            width={140}
            height={140}
            className="rounded-full bg-primary p-2"
          />
        </section>
        <section className="mx-5 flex flex-col items-center justify-center px-5 pt-16  md:items-start md:justify-start">
          <h1 className="text-3xl font-bold">{fullName}</h1>
          <h2 className="text-xs text-gray-300">@{username}</h2>
          <p className="my-4 text-center text-medium md:w-96 md:text-start">
            {background}
          </p>
          <ButtonHeader />
        </section>
      </div>
    </div>
  );
};
