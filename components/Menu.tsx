import cn from "classnames";
import Link from "next/link";
import { links } from "../menuPaths";
import DotButton from "./ui/DotButton";

interface MenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Menu = ({ isMenuOpen, setIsMenuOpen }: MenuProps) => {
  return (
    <div
      className={cn(
        "absolute top-0 p-4 pt-20 xl:p-20 xl:pt-28 w-full bg-orokoYellow text-black border-b-2 border-black z-40 shadow-3xl transition-transform",
        {
          "-translate-y-full": !isMenuOpen,
          "translate-y-0": isMenuOpen,
        }
      )}
    >
      <nav className="mb-10">
        <ul className="flex flex-col flex-wrap sm:flex-row xl:gap-8 justify-center items-center sm:space-x-2 space-y-4 sm:space-y-0">
          {links.map(({ name, url }, idx) => (
            <Link key={idx} href={url} passHref>
              <li
                className="flex-shrink-0 sm:my-6 xl:my-0"
                onClick={() => setIsMenuOpen(false)}
              >
                <DotButton size="large" transparent>
                  {name}
                </DotButton>
              </li>
            </Link>
          ))}
        </ul>
      </nav>
      <p className="font-serif block text-xl md:text-3xl xl:text-4xl text-center">
        Oroko is a not-for-profit independent internet radio station based in
        Accra, Ghana. We aim to connect, inspire and empower through
        conversation, collaboration and community.
      </p>
    </div>
  );
};

export default Menu;
