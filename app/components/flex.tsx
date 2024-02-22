import "./styles.flex.css";

type FlexProps = {
    className?: string;
    direction: "row" | "column";
    gap: "0" | "1" | "2" | "3" | "4" | "5"
    align: "center" | "start" | "end" | "baseline" | "stretch"
    padding: "0" | "1" | "2" | "3" | "4" | "5"
    children?: React.ReactNode
} & typeof defaultProps;

const defaultProps = {
    className: "",
    direction: "row",
    gap: "0",
    align: "start",
    padding: "0"
};

function Flex(props: FlexProps) {
    const { direction, className, gap, align, padding, children } = props;
    const styles = `rw-flex rw-flex-${direction} rw-flex-gap-${gap} rw-flex-align-${align} rw-flex-padding-${padding} ${className}`;
    return (
        <div className={styles}>
            {children}
        </div>
    );
}

Flex.displayName = 'Flex';
Flex.defaultProps = defaultProps;

export default Flex;
