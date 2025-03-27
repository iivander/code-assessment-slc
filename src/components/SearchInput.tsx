import { useId, ChangeEvent } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface SearchInputProps {
    id?: string;
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput = ({ value, onChange, id }: SearchInputProps) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
        <label className="input flex items-center" htmlFor={inputId}>
            <span className="sr-only">Search</span>
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
            <input
                id={inputId}
                type="search"
                className="grow"
                placeholder="Search"
                value={value}
                onChange={onChange}
                aria-label="Search"
            />
        </label>
    );
}

export default SearchInput;