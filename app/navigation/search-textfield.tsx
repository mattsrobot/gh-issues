import "./styles.search-textfield.css";

type SearchTextFieldProps = {
    className?: string;
    placeholder?: string;
    children?: React.ReactNode
} & typeof defaultProps;

const defaultProps = {
    placeholder: "",
    className: "",
};

function SearchTextField(props: SearchTextFieldProps) {
    const { children, className, placeholder } = props;
    const styles = `rw-reset rw-search-textfield ${className}`;
    return (
        <input className={styles} placeholder={placeholder}>
            {children}
        </input>
    );
}

SearchTextField.displayName = 'SearchTextField';
SearchTextField.defaultProps = defaultProps;

export default SearchTextField;
