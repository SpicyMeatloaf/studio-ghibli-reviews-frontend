import styles from './Header.module.css';

function Header(props) {
    return (
        <header className={styles.header}>
            <h1>At the Bus Stop</h1>
            <nav>
                <ul>
                    <li>Login </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;