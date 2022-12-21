import React, {useEffect, useState} from 'react';

function useForm(initialValues) {
    const [values, setValues]= useState(initialValues)

    function handleChange(e){
        const {name, value} = e.target
        setValues((prevSate) => ({
            ...prevSate,
            [name]: value
        }))
    }

    return {values, handleChange, setValues}
}

export default useForm;