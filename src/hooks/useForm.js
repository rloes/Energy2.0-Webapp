import React, { useEffect, useState } from "react";

function useForm(initialValues) {
    const [values, setValues] = useState(initialValues);

    function handleChange(e) {
        const { name, value } = e.target;
        setValues((prevSate) => ({
            ...prevSate,
            [name]: value,
        }));
    }

    /**
     * example state could be:
     * state = {
     *     nested.state : {
     *         name: "",
     *         age: ""
     *     }
     * }
     * @param e
     */
    function handleNestedChange(e) {
        const { name, value } = e.target;
        const names = name.split(".");
        setValues((prevState) => ({
            ...prevState,
            [names[0]]: {
                ...prevState[names[0]],
                [names[1]]: value,
            },
        }));
    }

    return {
        values,
        handleChange,
        handleNestedChange,
        setValues,
    };
}

export default useForm;
