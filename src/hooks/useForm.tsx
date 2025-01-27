import { useState } from "react";

const useForm = (initialValues: any) => {
    const [formValue, setFormValue] = useState(initialValues);
    const setFormData = (e: any) => {
        console.log("TARGET: ", e.target.name)
        console.log("VALUE: ", e.target.value)
        setFormValue({ ...formValue, [e.target.name]: e.target.value });
    };

    const setAllFormData = (allValues: any) => {
        setFormValue(allValues);
    };

    return {
        formValue,
        setFormData,
        setAllFormData
    };
};

export default useForm;