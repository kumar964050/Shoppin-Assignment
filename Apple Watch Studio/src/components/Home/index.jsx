import { Link } from "react-router-dom";

import styles from "./index.module.css";

const Home = () => {
  return (
    <section className={styles.container}>
      <div>
        <span className={styles.small_text}>Apple Watch Studio</span>
        <span className={styles.main_text}>Choose a case.</span>
        <span className={styles.main_text}>Pick a band.</span>
        <span className={styles.main_text}>Create your own style.</span>
        <Link to="/collection">
          <button>Get started</button>
        </Link>
        <img src="/watch.png" alt="watch" loading="lazy" />
      </div>
    </section>
  );
};

export default Home;
