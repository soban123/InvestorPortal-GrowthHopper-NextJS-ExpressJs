import '../public/build/css/custom.min.css';
import '../node_modules/react-date-range/dist/styles.css'; // main style file
import '../node_modules/react-date-range/dist/theme/default.css'; // theme css file
import '../static/css/style.css';
// import '../node_modules'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
