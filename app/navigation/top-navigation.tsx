import "./styles.top-navigation.css";

type TopNavigationProps = {
    className?: string;
    children?: React.ReactNode
} & typeof defaultProps;

const defaultProps = {
    className: "",
};

function TopNavigation({ children, className }: TopNavigationProps) {
    const styles = `rw-top-navigation ${className}`;
    return (
        <header className={styles}>
            {children}
        </header>
    );
}

TopNavigation.displayName = 'TopNavigation';
TopNavigation.defaultProps = defaultProps;

export default TopNavigation;
