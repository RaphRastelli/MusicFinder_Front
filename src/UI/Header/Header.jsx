import { Link } from 'react-router-dom';
import style from './Header.module.css';

export default function Header() {
  return (
    <header className={style.headstyle}>
      <h1>
        <Link to="/">MusicianFinder</Link>
      </h1>
    </header>
  );
}