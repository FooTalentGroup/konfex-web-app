"use client";
import Select, { MultiValue, SingleValue, ActionMeta, OnChangeValue } from 'react-select';
import { UseFormRegisterReturn } from 'react-hook-form';

type OptionType = { value: string; label: string; };

interface CustomMultiSelectProps {
    id?: string;
    options: OptionType[];
    label: string;
    placeholder?: string;
    error?: string;
    className?: string;
    style?: React.CSSProperties;
    value: string[]; 
    onChange: (newValue: string[]) => void; 
    onBlur?: () => void; 
}

const CustomMultiSelect: React.FC<CustomMultiSelectProps> = ({
    id,
    options,
    label,
    placeholder = "",
    error,
    className = "",
    style,
    value,
    onChange,
    onBlur,
}) => {
    const selectedOptions = options.filter(option => value.includes(option.value));

    const handleChange = (newValue: MultiValue<OptionType>, actionMeta: ActionMeta<OptionType>) => {
        const newValues = newValue.map(option => option.value);
        onChange(newValues);
    };

    return (
        <div className={`flex flex-col space-y-1`}>
            <label htmlFor={id} className="text-sm font-medium text-gray-600">
                {label}
            </label>
            <Select
                id={id}
                isMulti
                options={options}
                value={selectedOptions}
                onChange={handleChange}
                onBlur={onBlur}
                placeholder={placeholder}
                className={`rounded-lg text-black transition ${error
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-primary-300 focus:border-purple-300 focus:ring-purple-300"
                    } focus:ring-1 outline-none`}
                styles={{
                    control: (provided, state) => ({
                        ...provided,
                        borderColor: error ? '#EF4444' : '#B5A4C1',
                        '&:hover': {
                            borderColor: error ? '#EF4444' : '#B5A4C1', 
                        },
                        boxShadow: state.isFocused
                            ? error
                                ? '0 0 0 1px #EF4444'
                                : '0 0 0 1px #B5A4C1'
                            : error
                                ? '0 0 0 1px #EF4444'
                                : provided.boxShadow,
                        outline: 'none',

                        padding: '0.25rem',
                        backgroundColor: 'white',
                        color: 'black',
                        ...style,
                    }),
                    placeholder: (provided) => ({
                        ...provided,
                        color: '#9CA3AF',
                    }),
                     input: (provided) => ({
                        ...provided,
                        color: 'black',
                    }),
                }}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
};

export default CustomMultiSelect;