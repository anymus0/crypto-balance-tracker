import Head from "next/head";
import Settings from "../components/Settings";
import styles from "../styles/Home.module.scss";

const Home = () => {
  return (
    <div id="app">
      <Head>
        <title>Crypto Balance Aggregator</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-JEW9xMcG8R+pH31jmWH6WWP0WintQrMb4s7ZOdauHnUtxwoG2vI5DkLtS3qm9Ekf"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <main className={styles.containerCentered}>
        <div className="container">
          <div className="row">
            <div className="col">
              <h2>Balance Tracker</h2>
            </div>
          </div>
          <div className={`row ${styles.section}`}>
            <div className="col">
              <p>App</p>
            </div>
          </div>
          <div className={`row ${styles.section}`}>
            <div className="col">
              <Settings />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
