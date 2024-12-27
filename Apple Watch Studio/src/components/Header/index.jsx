import { Link } from "react-router-dom";

import styles from "./index.module.css";

const Header = () => {
  return (
    <div className={styles.container}>
      <Link to="/">
        <img src="/logo.jpg" alt="logo" loading="lazy" />
      </Link>
    </div>
  );
};

export default Header;
