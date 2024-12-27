import { Link } from "react-router-dom";

// icons
import { LiaStopwatchSolid } from "react-icons/lia";
import { CiStopwatch } from "react-icons/ci";
import { MdOutlineWatch } from "react-icons/md";
import { IoWatchOutline } from "react-icons/io5";

import styles from "./index.module.css";
import { useState } from "react";

const Collection = () => {
  const [isSideView, setIsSideView] = useState(false);

  const imgSrc = isSideView ? "/side-view-watch.jpg" : "/watch.png";
  return (
    <section className={styles.container}>
      <div className={styles.content_container}>
        <img src={imgSrc} alt="watch" loading="lazy" />
        <button
          className={styles.link}
          onClick={() => setIsSideView(!isSideView)}
        >
          Side view
        </button>
        <span className={styles.title}>apple watch series 10</span>
        <span className={styles.description}>
          46mm Jet Black Aluminum Case with Black Solo Loop
        </span>
        <span className={styles.price}>From $429</span>
        <div className={styles.action_container}>
          <button>
            <MdOutlineWatch className={styles.icon} />
            Size
          </button>
          <button>
            <LiaStopwatchSolid className={styles.icon} />
            Case
          </button>
          <button>
            <IoWatchOutline className={styles.icon} />
            Band
          </button>
        </div>
      </div>
    </section>
  );
};

export default Collection;
