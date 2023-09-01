import classNames from "classnames";
import { Link, useLocation, useParams } from "react-router-dom";

const BottomNav = () => {
  const { collectionId } = useParams();
  const pathname = useLocation().pathname;

  const homePaths = ["/", "/usage"];
  const configPaths = [
    `/config/${collectionId}`,
    `/config/${collectionId}/api`,
    `/config/${collectionId}/api/web`,
    `/config/${collectionId}/api/line`,
    `/config/${collectionId}/api/instagram`,
    `/config/${collectionId}/settings`,
  ];
  const isHomePath = homePaths.includes(pathname);
  const isConfigPath = configPaths.includes(pathname);

  return isHomePath || isConfigPath ? (
    <nav className="sticky top-0 z-10 w-full border-b border-slate-300/90 bg-white/70 p-2 px-6 backdrop-blur-lg">
      <ul className="flex items-center">
        {isHomePath && (
          <>
            <NavItem name="Collections" path="/" />
            <NavItem name="Usage" path="/usage" />
          </>
        )}
        {isConfigPath && (
          <>
            <NavItem name="Documents" path={`/config/${collectionId}`} />
            <NavItem name="API" path={`/config/${collectionId}/api`} />
            <NavItem
              name="Settings"
              path={`/config/${collectionId}/settings`}
            />
          </>
        )}
      </ul>
    </nav>
  ) : null;
};

interface NavItemProps {
  name: string;
  path: string;
}

const NavItem: React.FC<NavItemProps> = ({ name, path }) => {
  const pathname = useLocation().pathname;
  return (
    <li>
      <Link
        className={classNames("p-2 hover:bg-stone-100", {
          "text-stone-500": pathname !== path,
          "text-black": pathname === path,
        })}
        to={path}
      >
        {name}
      </Link>
    </li>
  );
};
export default BottomNav;
