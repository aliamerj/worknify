import Image from "next/image";
import { ButtonHeader } from "../buttonsHeader/button_header";
import styles from "./header.module.css";
import { FaLinkedin, FaGithub } from "react-icons/fa";
interface IHeader {
  fullName: string;
  image: string | null;
  username: string;
  background: string;
  linkedin: string | null;
  github: string | null;
  jobTitle: string;
}

export const Header = ({
  fullName,
  username,
  background,
  image,
  linkedin,
  github,
  jobTitle,
}: IHeader) => {
  return (
    <div
      className={`${styles.bgPattern} flex h-screen justify-center p-5 pt-20 text-white shadow-md`}
    >
      <div className="flex flex-col-reverse items-center justify-between pb-14 md:w-4/5 md:flex-row md:items-center md:justify-evenly md:gap-3">
        <section className="mx-5 flex flex-col items-center justify-center px-5 pt-16  md:items-start md:justify-start">
          <h1 className="text-4xl font-bold md:text-5xl">{fullName}</h1>
          <h2 className="text-xs text-gray-300">@{username}</h2>
          <p className="my-4 text-center text-lg md:w-96 md:text-start md:text-xl">
            {background}
          </p>
          <ButtonHeader />
        </section>
        <section className="mb-3 flex h-40 w-40 flex-col items-center justify-center gap-5 rounded-full md:h-64 md:w-64">
          <Image
            src={image ?? "/user_image.png"}
            alt="user Image"
            layout="responsive"
            width={140}
            height={140}
            className="rounded-full bg-foreground p-2"
          />

          <h1 className="flex text-center text-2xl font-bold italic tracking-wide text-white shadow-xl transition duration-300 ease-in-out md:text-3xl">
            {jobTitle}
          </h1>
        </section>
      </div>
      <div className="flex flex-col gap-5">
        {linkedin && (
          <a href={linkedin} target="_blank" rel="noreferrer">
            <FaLinkedin
              className="transform text-[35px] transition-transform hover:scale-125"
              aria-label="LinkedIn"
            />
          </a>
        )}
        {github && (
          <a href={github} target="_blank" rel="noreferrer">
            <FaGithub
              className="transform text-[35px] transition-transform hover:scale-125"
              aria-label="LinkedIn"
            />
          </a>
        )}
      </div>
    </div>
  );
};
