import "./styles.card.css";

type CardProps = {
    className?: string;
    size: "1" | "2" | "3";
    variant: "default" | "outlined";
    children?: React.ReactNode
} & typeof defaultProps;

const defaultProps = {
    className: "",
    size: "1",
    variant: "default",
};

function Card(props: CardProps) {
    const { children, size, variant, className } = props;
    const styles = `rw-card rw-size-${size} rw-card-${variant} ${className}`;
    return (
        <section className={styles}>
            {children}
        </section>
    );
}

Card.displayName = 'Card';
Card.defaultProps = defaultProps;

export default Card;
