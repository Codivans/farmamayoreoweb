import { useLocation, Link } from 'react-router-dom';

export const Breadcrum = () => {
    const location = useLocation();
    const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div className='content_breadcrum'>
        {
            pathnames.map((name, index) => {
                const isLast = index === pathnames.length - 1;
                return (
                    <li key={name}>
                        <span> / </span>
                        {isLast ? (
                            <span>{name}</span>
                        ):(
                            <span>{name}</span>
                        )}
                    </li>
                )
            })
        }
    </div>
  )
}
