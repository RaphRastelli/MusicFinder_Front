import { Link } from 'react-router';

export default function Header(){
  return(
    <header className={style['headstyle']}>
      <h1>
        <Link to="/">MusicianFinder</Link>
      </h1>
    </header>
  )
}